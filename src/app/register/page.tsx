import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { authOptions } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      badge="PulseWork"
      eyebrow="Onboarding seguro"
      title="Cadastre a primeira conta e abra a operacao com uma experiencia premium."
      description="A fundacao ja contempla boas praticas para proteger usuarios, preparar o crescimento da squad e manter a experiencia elegante desde o primeiro acesso."
      footer={
        <>
          <span>Ja iniciou seu acesso?</span>{" "}
          <Link className="font-semibold text-slate-700" href="/login">
            Voltar para login
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-amber-900/10 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">
            Cadastro
          </span>
          <h2 className="display-font text-3xl font-semibold tracking-tight text-slate-950">
            Criar conta de acesso
          </h2>
          <p className="text-sm leading-7 text-slate-500">
            Comece com um usuario administrador para operar a plataforma.
          </p>
        </div>
        <RegisterForm />
      </div>
    </AuthShell>
  );
}
