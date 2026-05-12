import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, CalendarRange, FolderKanban, UserRound } from "lucide-react";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { CheckpointWorkspace } from "@/components/dashboard/checkpoint-workspace";
import { authOptions } from "@/lib/auth";
import {
  buildCheckpointProgress,
  getCheckpointSchedule,
  getQuestionCatalog,
} from "@/lib/onboarding-service";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function CollaboratorPage({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const { employeeId } = await params;
  const [employee, questionGroups] = await Promise.all([
    prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        checkpoints: {
          include: {
            responses: {
              include: {
                question: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    }),
    getQuestionCatalog(),
  ]);

  if (!employee) {
    notFound();
  }

  const schedule = getCheckpointSchedule(employee.startDate).map((item) => ({
    ...item,
    plannedStart: formatDate(item.plannedStart),
    plannedEnd: formatDate(item.plannedEnd),
  }));

  const progress = buildCheckpointProgress(
    employee.checkpoints.map((review) => ({
      phase: review.phase,
      completedAt: review.completedAt,
      responses: review.responses,
    })),
    questionGroups.reduce((total, group) => total + group.questions.length, 0),
  );

  const completedCount = progress.filter((item) => item.completed).length;

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="glass-card rounded-[2rem] border border-white/70 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-slate-900/8 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900/15"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao painel
              </Link>

              <div className="space-y-3">
                <span className="inline-flex rounded-full border border-teal-900/10 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-900">
                  Controle por colaborador
                </span>
                <h1 className="display-font text-4xl font-semibold tracking-tight text-slate-950">
                  {employee.name}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-600">
                  Acompanhe o onboarding completo deste colaborador e registre os seis
                  checkpoints da jornada de 90 dias com perguntas por categoria e notas
                  de 1 a 5.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-900/8 bg-white/82 p-5">
              <div className="grid gap-3 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4 text-slate-900" />
                  {employee.role}
                </div>
                <div className="inline-flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-slate-900" />
                  {employee.project}
                </div>
                <div className="inline-flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-slate-900" />
                  {employee.managerName}
                </div>
                <div className="inline-flex items-center gap-2">
                  <CalendarRange className="h-4 w-4 text-slate-900" />
                  Início em {formatDate(employee.startDate)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <article className="glass-card rounded-[1.75rem] border border-white/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Progresso
            </p>
            <p className="display-font mt-3 text-4xl font-semibold text-slate-950">
              {completedCount}/6
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Checkpoints concluídos dentro do cronograma de onboarding.
            </p>
          </article>

          <article className="glass-card rounded-[1.75rem] border border-white/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Questionário
            </p>
            <p className="display-font mt-3 text-4xl font-semibold text-slate-950">
              {questionGroups.reduce((total, group) => total + group.questions.length, 0)}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Perguntas distribuídas por categoria para cada checkpoint.
            </p>
          </article>

          <article className="glass-card rounded-[1.75rem] border border-white/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Média atual
            </p>
            <p className="display-font mt-3 text-4xl font-semibold text-slate-950">
              {(() => {
                const averages = progress
                  .map((item) => item.averageScore)
                  .filter((value): value is number => value !== null);

                return averages.length
                  ? averages.reduce((sum, value) => sum + value, 0).toFixed(1)
                  : "0.0";
              })()}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Média consolidada das avaliações já respondidas.
            </p>
          </article>
        </section>

        <section className="grid gap-4 xl:grid-cols-[320px_1fr]">
          <aside className="glass-card rounded-[1.75rem] border border-white/70 p-5">
            <h2 className="display-font text-2xl font-semibold text-slate-950">
              Cronograma dos checkpoints
            </h2>
            <div className="mt-5 grid gap-3">
              {progress.map((item, index) => (
                <article
                  key={item.phase}
                  className="rounded-3xl border border-slate-900/8 bg-white/80 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900">
                      {index + 1}. {item.label}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                        item.completed
                          ? "bg-teal-900 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.completed ? "Concluído" : "Pendente"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.focus}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {item.answersCount}/{item.totalQuestions} respostas
                    {item.averageScore !== null
                      ? ` • média ${item.averageScore.toFixed(1)}`
                      : ""}
                  </p>
                </article>
              ))}
            </div>
          </aside>

          <CheckpointWorkspace
            employeeId={employee.id}
            schedule={schedule}
            questionGroups={questionGroups}
            reviews={employee.checkpoints.map((review) => ({
              phase: review.phase,
              reviewDate: review.reviewDate
                ? review.reviewDate.toISOString().slice(0, 10)
                : null,
              generalComment: review.generalComment,
              responses: review.responses.map((response) => ({
                questionId: response.questionId,
                rating: response.rating,
                comment: response.comment,
              })),
            }))}
          />
        </section>
      </div>
    </main>
  );
}
