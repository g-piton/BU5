import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { CheckpointPhase } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { CHECKPOINT_PHASE_VALUES } from "@/lib/onboarding-catalog";
import { ensureOnboardingCatalog, upsertCheckpointReview } from "@/lib/onboarding-service";
import { prisma } from "@/lib/prisma";
import { checkpointReviewSchema } from "@/lib/validations/checkpoint";

type RouteContext = {
  params: Promise<{
    employeeId: string;
    phase: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const { employeeId, phase } = await context.params;

  if (!CHECKPOINT_PHASE_VALUES.includes(phase as CheckpointPhase)) {
    return NextResponse.json({ message: "Checkpoint inválido." }, { status: 400 });
  }

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { id: true },
  });

  if (!employee) {
    return NextResponse.json({ message: "Colaborador não encontrado." }, { status: 404 });
  }

  try {
    await ensureOnboardingCatalog();

    const body = await request.json();
    const parsed = checkpointReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Os dados do checkpoint estão incompletos ou inválidos." },
        { status: 400 },
      );
    }

    const validQuestionIds = new Set(
      (
        await prisma.checkpointQuestion.findMany({
          select: { id: true },
        })
      ).map((question) => question.id),
    );

    const hasInvalidQuestion = parsed.data.responses.some(
      (response) => !validQuestionIds.has(response.questionId),
    );

    if (hasInvalidQuestion) {
      return NextResponse.json(
        { message: "Uma ou mais perguntas do checkpoint não são válidas." },
        { status: 400 },
      );
    }

    const reviewDate = parsed.data.reviewDate ? new Date(parsed.data.reviewDate) : null;

    await upsertCheckpointReview({
      employeeId,
      phase: phase as CheckpointPhase,
      reviewDate,
      generalComment: parsed.data.generalComment ?? "",
      responses: parsed.data.responses,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível salvar este checkpoint." },
      { status: 500 },
    );
  }
}
