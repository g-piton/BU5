"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage(null);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(payload.message ?? "Nao foi possivel criar a conta.");
      return;
    }

    const signInResponse = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (!signInResponse || signInResponse.error) {
      router.push("/login");
      router.refresh();
      return;
    }

    router.push(signInResponse.url ?? "/dashboard");
    router.refresh();
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="name">
          Nome completo
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-900/10 bg-white/85 px-4 py-3 shadow-sm shadow-slate-900/5">
          <UserRound className="h-4 w-4 text-slate-400" />
          <input
            id="name"
            type="text"
            placeholder="Nome e sobrenome"
            className="w-full border-none bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
            {...register("name")}
          />
        </div>
        {errors.name ? (
          <p className="text-sm text-[var(--danger)]">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="email">
          E-mail
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-900/10 bg-white/85 px-4 py-3 shadow-sm shadow-slate-900/5">
          <Mail className="h-4 w-4 text-slate-400" />
          <input
            id="email"
            type="email"
            placeholder="voce@empresa.com"
            className="w-full border-none bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
            {...register("email")}
          />
        </div>
        {errors.email ? (
          <p className="text-sm text-[var(--danger)]">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="password">
          Senha
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-900/10 bg-white/85 px-4 py-3 shadow-sm shadow-slate-900/5">
          <LockKeyhole className="h-4 w-4 text-slate-400" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimo de 8 caracteres"
            className="w-full border-none bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
            {...register("password")}
          />
          <button
            type="button"
            className="text-slate-400 transition hover:text-slate-700"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password ? (
          <p className="text-sm text-[var(--danger)]">{errors.password.message}</p>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand-strong)] px-4 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        Criar conta
      </button>

      <p className="text-center text-sm text-slate-500">
        Ja possui acesso?{" "}
        <Link className="font-semibold text-teal-800 transition hover:text-teal-600" href="/login">
          Fazer login
        </Link>
      </p>
    </form>
  );
}
