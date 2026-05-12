"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { employeeSchema, type EmployeeInput } from "@/lib/validations/employee";

export function EmployeeCreateForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      project: "",
      managerName: "",
      startDate: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage(null);

    const response = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as { id?: string; message?: string };

    if (!response.ok || !payload.id) {
      setErrorMessage(payload.message ?? "Não foi possível cadastrar o colaborador.");
      return;
    }

    reset();
    router.push(`/dashboard/collaborators/${payload.id}`);
    router.refresh();
  });

  const fields = [
    { name: "name", label: "Nome completo", placeholder: "Ex.: Ana Lima", type: "text" },
    { name: "email", label: "E-mail", placeholder: "ana@empresa.com", type: "email" },
    { name: "role", label: "Cargo / papel", placeholder: "Ex.: Product Designer", type: "text" },
    { name: "project", label: "Cliente / projeto", placeholder: "Ex.: Portal RH", type: "text" },
    { name: "managerName", label: "Gestor responsável", placeholder: "Ex.: Carlos Souza", type: "text" },
    { name: "startDate", label: "Data de início", placeholder: "", type: "date" },
  ] as const;

  return (
    <form className="grid gap-4 lg:grid-cols-2" onSubmit={onSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor={field.name}>
            {field.label}
          </label>
          <input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            className="w-full rounded-2xl border border-slate-900/10 bg-white/85 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-700/50"
            {...register(field.name)}
          />
          {errors[field.name] ? (
            <p className="text-sm text-[var(--danger)]">{errors[field.name]?.message}</p>
          ) : null}
        </div>
      ))}

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 lg:col-span-2">
          {errorMessage}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 lg:col-span-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-900/10 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-900">
          <UserPlus className="h-3.5 w-3.5" />
          Novo colaborador
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-strong)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Cadastrar colaborador
        </button>
      </div>
    </form>
  );
}
