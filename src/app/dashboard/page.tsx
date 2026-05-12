import Link from "next/link";
import { ArrowRight, ChartColumnIncreasing, ClipboardList, Users } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { EmployeeCreateForm } from "@/components/dashboard/employee-create-form";
import { LogoutButton } from "@/components/auth/logout-button";
import { authOptions } from "@/lib/auth";
import { buildCheckpointProgress, ensureOnboardingCatalog } from "@/lib/onboarding-service";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  await ensureOnboardingCatalog();

  const [employees, questionCount] = await Promise.all([
    prisma.employee.findMany({
      include: {
        checkpoints: {
          include: {
            responses: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.checkpointQuestion.count(),
  ]);

  const totalCompletedCheckpoints = employees.reduce((sum, employee) => {
    const progress = buildCheckpointProgress(employee.checkpoints, questionCount);
    return sum + progress.filter((item) => item.completed).length;
  }, 0);

  const allResponses = employees
    .flatMap((employee) => employee.checkpoints)
    .flatMap((checkpoint) => checkpoint.responses);
  const averageScore = allResponses.length
    ? (
        allResponses.reduce((sum, response) => sum + response.rating, 0) /
        allResponses.length
      ).toFixed(1)
    : "0.0";

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="glass-card rounded-[2rem] border border-white/70 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-teal-900/10 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-900">
                Onboarding control center
              </span>
              <div className="space-y-2">
                <h1 className="display-font text-4xl font-semibold tracking-tight text-slate-950">
                  Bem-vindo, {session.user.name}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-600">
                  Cadastre colaboradores, acompanhe os checkpoints do onboarding e registre
                  avaliações por categoria com notas de 1 a 5, seguindo a base da planilha.
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <article className="glass-card rounded-[1.75rem] border border-white/70 p-6">
            <div className="mb-4 inline-flex rounded-2xl bg-slate-950 p-3 text-white">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="display-font text-3xl font-semibold text-slate-950">
              {employees.length}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Colaboradores cadastrados para acompanhamento do onboarding.
            </p>
          </article>

          <article className="glass-card rounded-[1.75rem] border border-white/70 p-6">
            <div className="mb-4 inline-flex rounded-2xl bg-slate-950 p-3 text-white">
              <ClipboardList className="h-5 w-5" />
            </div>
            <h2 className="display-font text-3xl font-semibold text-slate-950">
              {totalCompletedCheckpoints}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Checkpoints totalmente concluídos no cronograma de 90 dias.
            </p>
          </article>

          <article className="glass-card rounded-[1.75rem] border border-white/70 p-6">
            <div className="mb-4 inline-flex rounded-2xl bg-slate-950 p-3 text-white">
              <ChartColumnIncreasing className="h-5 w-5" />
            </div>
            <h2 className="display-font text-3xl font-semibold text-slate-950">
              {averageScore}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Média geral das avaliações registradas até agora.
            </p>
          </article>
        </section>

        <section className="glass-card rounded-[2rem] border border-white/70 p-6 sm:p-8">
          <div className="mb-6 space-y-2">
            <span className="inline-flex rounded-full border border-amber-900/10 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">
              Cadastro básico
            </span>
            <h2 className="display-font text-3xl font-semibold tracking-tight text-slate-950">
              Novo colaborador
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600">
              Cadastre os dados básicos do colaborador e abra automaticamente a gestão
              dos checkpoints do onboarding.
            </p>
          </div>

          <EmployeeCreateForm />
        </section>

        <section className="glass-card rounded-[2rem] border border-white/70 p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <span className="inline-flex rounded-full border border-teal-900/10 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-900">
                Acompanhamento
              </span>
              <h2 className="display-font text-3xl font-semibold tracking-tight text-slate-950">
                Colaboradores monitorados
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Cada colaborador possui 6 checkpoints, todos baseados no cronograma da
              planilha de onboarding.
            </p>
          </div>

          {employees.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-slate-900/12 bg-white/65 px-6 py-10 text-center text-slate-500">
              Nenhum colaborador cadastrado ainda. Comece pelo formulário acima.
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {employees.map((employee) => {
                const progress = buildCheckpointProgress(employee.checkpoints, questionCount);
                const completed = progress.filter((item) => item.completed).length;
                const answered = progress.reduce((sum, item) => sum + item.answersCount, 0);

                return (
                  <article
                    key={employee.id}
                    className="rounded-[1.75rem] border border-slate-900/8 bg-white/80 p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div>
                          <h3 className="display-font text-2xl font-semibold text-slate-950">
                            {employee.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">{employee.email}</p>
                        </div>

                        <div className="grid gap-2 text-sm text-slate-600">
                          <p>
                            <span className="font-semibold text-slate-800">Cargo:</span>{" "}
                            {employee.role}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-800">Projeto:</span>{" "}
                            {employee.project}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-800">Gestor:</span>{" "}
                            {employee.managerName}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-800">Início:</span>{" "}
                            {formatDate(employee.startDate)}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-900/8 bg-slate-950 px-4 py-3 text-white">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                          Progresso
                        </p>
                        <p className="display-font mt-2 text-3xl font-semibold">
                          {completed}/6
                        </p>
                        <p className="mt-2 text-sm text-white/75">
                          {answered} respostas registradas
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {progress.map((item) => (
                        <span
                          key={item.phase}
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                            item.completed
                              ? "bg-teal-100 text-teal-900"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/dashboard/collaborators/${employee.id}`}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--brand-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--brand)]"
                    >
                      Abrir acompanhamento
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
