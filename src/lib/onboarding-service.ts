import type { CheckpointPhase, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  CHECKPOINT_PHASES,
  ONBOARDING_DIMENSIONS,
  ONBOARDING_QUESTIONS,
} from "@/lib/onboarding-catalog";

export async function ensureOnboardingCatalog() {
  await prisma.$transaction(
    ONBOARDING_QUESTIONS.map((question) =>
      prisma.checkpointQuestion.upsert({
        where: { code: question.code },
        update: {
          dimension: question.dimension,
          prompt: question.prompt,
          sortOrder: question.sortOrder,
        },
        create: question,
      }),
    ),
  );
}

export async function getQuestionCatalog() {
  await ensureOnboardingCatalog();

  const questions = await prisma.checkpointQuestion.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return ONBOARDING_DIMENSIONS.map((dimension) => ({
    ...dimension,
    questions: questions.filter((question) => question.dimension === dimension.name),
  }));
}

export function getCheckpointSchedule(startDate: Date) {
  return CHECKPOINT_PHASES.map((phase) => {
    const plannedStart = new Date(startDate);
    plannedStart.setDate(plannedStart.getDate() + phase.offsetStart);

    const plannedEnd = new Date(startDate);
    plannedEnd.setDate(plannedEnd.getDate() + phase.offsetEnd);

    return {
      ...phase,
      plannedStart,
      plannedEnd,
    };
  });
}

export function buildCheckpointProgress(
  reviews: Array<{
    phase: CheckpointPhase;
    completedAt: Date | null;
    responses: Array<{ rating: number }>;
  }>,
  questionCount: number,
) {
  return CHECKPOINT_PHASES.map((phase) => {
    const review = reviews.find((item) => item.phase === phase.value);
    const answersCount = review?.responses.length ?? 0;
    const averageScore =
      answersCount > 0
        ? review!.responses.reduce((sum, response) => sum + response.rating, 0) /
          answersCount
        : null;

    return {
      phase: phase.value,
      label: phase.label,
      focus: phase.focus,
      answersCount,
      totalQuestions: questionCount,
      completed: Boolean(review?.completedAt) && answersCount === questionCount,
      averageScore,
    };
  });
}

export async function upsertCheckpointReview(input: {
  employeeId: string;
  phase: CheckpointPhase;
  reviewDate?: Date | null;
  generalComment?: string;
  responses: Array<{
    questionId: string;
    rating: number;
    comment?: string;
  }>;
}) {
  const review = await prisma.checkpointReview.upsert({
    where: {
      employeeId_phase: {
        employeeId: input.employeeId,
        phase: input.phase,
      },
    },
    update: {
      reviewDate: input.reviewDate ?? null,
      generalComment: input.generalComment?.trim() || null,
    },
    create: {
      employeeId: input.employeeId,
      phase: input.phase,
      reviewDate: input.reviewDate ?? null,
      generalComment: input.generalComment?.trim() || null,
    },
  });

  await prisma.$transaction(
    input.responses.map((response) =>
      prisma.checkpointResponse.upsert({
        where: {
          reviewId_questionId: {
            reviewId: review.id,
            questionId: response.questionId,
          },
        },
        update: {
          rating: response.rating,
          comment: response.comment?.trim() || null,
        },
        create: {
          reviewId: review.id,
          questionId: response.questionId,
          rating: response.rating,
          comment: response.comment?.trim() || null,
        },
      }),
    ),
  );

  const completedAt =
    input.responses.length === ONBOARDING_QUESTIONS.length ? new Date() : null;

  return prisma.checkpointReview.update({
    where: { id: review.id },
    data: {
      completedAt,
    },
    include: {
      responses: true,
    },
  });
}

export type EmployeeCheckpointSnapshot = Prisma.EmployeeGetPayload<{
  include: {
    checkpoints: {
      include: {
        responses: {
          include: {
            question: true;
          };
        };
      };
    };
  };
}>;
