"use client";

import type { CheckpointPhase, CheckpointQuestion } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CalendarDays, CheckCheck, LoaderCircle, Save } from "lucide-react";
import { RATING_OPTIONS } from "@/lib/onboarding-catalog";

type QuestionGroup = {
  name: string;
  objective: string;
  riskAlert: string;
  questions: CheckpointQuestion[];
};

type ReviewData = {
  phase: CheckpointPhase;
  reviewDate: string | null;
  generalComment: string | null;
  responses: Array<{
    questionId: string;
    rating: number;
    comment: string | null;
  }>;
};

type CheckpointWorkspaceProps = {
  employeeId: string;
  schedule: Array<{
    value: CheckpointPhase;
    label: string;
    focus: string;
    plannedStart: string;
    plannedEnd: string;
  }>;
  questionGroups: QuestionGroup[];
  reviews: ReviewData[];
};

export function CheckpointWorkspace({
  employeeId,
  schedule,
  questionGroups,
  reviews,
}: CheckpointWorkspaceProps) {
  const router = useRouter();
  const [selectedPhase, setSelectedPhase] = useState<CheckpointPhase>(schedule[0].value);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reviewDate, setReviewDate] = useState<string>(
    reviews.find((review) => review.phase === selectedPhase)?.reviewDate ?? "",
  );
  const [generalComment, setGeneralComment] = useState<string>(
    reviews.find((review) => review.phase === selectedPhase)?.generalComment ?? "",
  );
  const [drafts, setDrafts] = useState<Record<string, { rating?: number; comment: string }>>(() => {
    const initial: Record<string, { rating?: number; comment: string }> = {};
    for (const review of reviews) {
      for (const response of review.responses) {
        initial[`${review.phase}:${response.questionId}`] = {
          rating: response.rating,
          comment: response.comment ?? "",
        };
      }
    }
    return initial;
  });

  const selectedReview = useMemo(
    () => reviews.find((review) => review.phase === selectedPhase),
    [reviews, selectedPhase],
  );

  const selectedMeta = schedule.find((item) => item.value === selectedPhase) ?? schedule[0];
  const answeredCount = questionGroups
    .flatMap((group) => group.questions)
    .filter((question) => drafts[`${selectedPhase}:${question.id}`]?.rating)
    .length;

  function syncPhaseState(nextPhase: CheckpointPhase) {
    setSelectedPhase(nextPhase);
    const nextReview = reviews.find((review) => review.phase === nextPhase);
    setReviewDate(nextReview?.reviewDate ?? "");
    setGeneralComment(nextReview?.generalComment ?? "");
    setFeedback(null);
    setErrorMessage(null);
  }

  async function handleSubmit() {
    setSaving(true);
    setFeedback(null);
    setErrorMessage(null);

    const responses = questionGroups
      .flatMap((group) => group.questions)
      .map((question) => {
        const value = drafts[`${selectedPhase}:${question.id}`];

        return {
          questionId: question.id,
          rating: value?.rating,
          comment: value?.comment ?? "",
        };
      });

    const pending = responses.filter((response) => !response.rating);
    if (pending.length > 0) {
      setSaving(false);
      setErrorMessage("Preencha a nota de todas as perguntas antes de salvar o checkpoint.");
      return;
    }

    const response = await fetch(
      `/api/employees/${employeeId}/checkpoints/${selectedPhase}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: selectedPhase,
          reviewDate,
          generalComment,
          responses,
        }),
      },
    );

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(payload.message ?? "Não foi possível salvar este checkpoint.");
      setSaving(false);
      return;
    }

    setFeedback("Checkpoint salvo com sucesso.");
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <section className="glass-card rounded-[1.75rem] border border-white/70 p-5 sm:p-6">
        <div className="flex flex-wrap gap-3">
          {schedule.map((phase) => {
            const active = phase.value === selectedPhase;
            return (
              <button
                key={phase.value}
                type="button"
                onClick={() => syncPhaseState(phase.value)}
                className={`rounded-2xl px-4 py-3 text-left transition ${
                  active
                    ? "bg-slate-950 text-white shadow-lg"
                    : "border border-slate-900/8 bg-white/80 text-slate-700 hover:border-slate-900/20"
                }`}
              >
                <div className="text-sm font-semibold">{phase.label}</div>
                <div className={`mt-1 text-xs ${active ? "text-white/75" : "text-slate-500"}`}>
                  {phase.focus}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="glass-card rounded-[1.75rem] border border-white/70 p-5 sm:p-6">
        <div className="flex flex-col gap-5 border-b border-slate-900/8 pb-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <span className="inline-flex rounded-full border border-amber-900/10 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">
                {selectedMeta.label}
              </span>
              <h2 className="display-font text-3xl font-semibold tracking-tight text-slate-950">
                Avaliação do checkpoint
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-slate-600">
                {selectedMeta.focus} Use notas de 1 a 5 para todas as perguntas e registre
                comentários quando precisar contextualizar a avaliação.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 rounded-3xl border border-slate-900/8 bg-white/80 px-4 py-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                <CalendarDays className="h-4 w-4" />
                Janela planejada
              </span>
              <span>
                {selectedMeta.plannedStart} até {selectedMeta.plannedEnd}
              </span>
              <span>
                {answeredCount} de{" "}
                {questionGroups.reduce((total, group) => total + group.questions.length, 0)}{" "}
                perguntas respondidas
              </span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="reviewDate">
                Data do checkpoint
              </label>
              <input
                id="reviewDate"
                type="date"
                value={reviewDate}
                onChange={(event) => setReviewDate(event.target.value)}
                className="w-full rounded-2xl border border-slate-900/10 bg-white/85 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-700/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="generalComment">
                Observações gerais
              </label>
              <textarea
                id="generalComment"
                value={generalComment}
                onChange={(event) => setGeneralComment(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-900/10 bg-white/85 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-700/50"
                placeholder="Registre contexto, decisões ou próximos passos deste checkpoint."
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {RATING_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="rounded-full border border-slate-900/8 bg-white/75 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {option.label} = {option.description}
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6">
          {questionGroups.map((group) => (
            <section key={group.name} className="rounded-[1.5rem] border border-slate-900/8 bg-white/72 p-5">
              <div className="space-y-2 border-b border-slate-900/8 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="display-font text-xl font-semibold text-slate-950">
                    {group.name}
                  </h3>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                    {group.questions.length} perguntas
                  </span>
                </div>
                <p className="text-sm leading-7 text-slate-600">{group.objective}</p>
                <p className="text-sm text-amber-700">
                  Alerta de risco: {group.riskAlert}
                </p>
              </div>

              <div className="mt-5 grid gap-5">
                {group.questions.map((question, index) => {
                  const key = `${selectedPhase}:${question.id}`;
                  const value = drafts[key] ?? { comment: "" };

                  return (
                    <article key={question.id} className="rounded-3xl border border-slate-900/8 bg-white/85 p-4">
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-900 text-sm font-semibold text-white">
                            {index + 1}
                          </div>
                          <p className="pt-1 text-sm font-medium leading-7 text-slate-800">
                            {question.prompt}
                          </p>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-5">
                          {RATING_OPTIONS.map((option) => {
                            const selected = value.rating === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                  setDrafts((current) => ({
                                    ...current,
                                    [key]: {
                                      rating: option.value,
                                      comment: value.comment,
                                    },
                                  }))
                                }
                                className={`rounded-2xl border px-3 py-3 text-left transition ${
                                  selected
                                    ? "border-teal-800 bg-teal-900 text-white"
                                    : "border-slate-900/8 bg-white text-slate-700 hover:border-slate-900/18"
                                }`}
                              >
                                <div className="text-sm font-semibold">{option.label}</div>
                                <div className={`mt-1 text-xs ${selected ? "text-white/75" : "text-slate-500"}`}>
                                  {option.description}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <textarea
                          rows={2}
                          value={value.comment}
                          onChange={(event) =>
                            setDrafts((current) => ({
                              ...current,
                              [key]: {
                                rating: value.rating,
                                comment: event.target.value,
                              },
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-900/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-700/50"
                          placeholder="Observação opcional para esta pergunta."
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            {selectedReview?.responses.length ? (
              <span className="inline-flex items-center gap-2">
                <CheckCheck className="h-4 w-4 text-teal-700" />
                Este checkpoint já possui respostas registradas.
              </span>
            ) : (
              "Ainda não há respostas salvas para este checkpoint."
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar checkpoint
          </button>
        </div>

        {feedback ? (
          <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
            {feedback}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}
      </section>
    </div>
  );
}
