import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      badge="PulseWork"
      eyebrow="Gestao de acesso"
      title="Seu hub de equipe com entrada simples e segura."
      description="A primeira camada do produto ja nasce pronta para evoluir com cadastros de funcionarios, perfis e fluxo operacional de RH."
      footer={
        <>
          <span>Ao entrar, sua sessao sera protegida com autenticacao segura.</span>{" "}
          <Link className="font-semibold text-slate-700" href="/register">
            Criar uma conta agora
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-teal-900/10 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-teal-900">
            Login
          </span>
          <h2 className="display-font text-3xl font-semibold tracking-tight text-slate-950">
            Entrar na plataforma
          </h2>
          <p className="text-sm leading-7 text-slate-500">
            Use suas credenciais para acessar o painel inicial.
          </p>
        </div>
        <LoginForm />
      </div>
    </AuthShell>
  );
}
