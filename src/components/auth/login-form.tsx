"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage(null);

    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (!response || response.error) {
      setErrorMessage("E-mail ou senha invalidos.");
      return;
    }

    router.push(response.url ?? "/dashboard");
    router.refresh();
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="email">
          E-mail corporativo
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
            placeholder="Digite sua senha"
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
        Entrar no sistema
      </button>

      <p className="text-center text-sm text-slate-500">
        Primeiro acesso?{" "}
        <Link className="font-semibold text-teal-800 transition hover:text-teal-600" href="/register">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
