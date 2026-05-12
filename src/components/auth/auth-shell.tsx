import type { ReactNode } from "react";

type AuthShellProps = {
  badge: string;
  eyebrow: string;
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
};

export function AuthShell({
  badge,
  eyebrow,
  title,
  description,
  footer,
  children,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.2),_transparent_30%),radial-gradient(circle_at_85%_15%,_rgba(245,158,11,0.24),_transparent_22%),linear-gradient(135deg,_rgba(255,255,255,0.9),_rgba(238,244,243,0.72))]" />
      <div className="absolute left-[-8rem] top-[12rem] -z-10 h-52 w-52 rounded-full bg-teal-700/10 blur-3xl" />
      <div className="absolute bottom-0 right-[-5rem] -z-10 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="glass-card hidden rounded-[2rem] border border-white/60 p-10 text-slate-900 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <span className="inline-flex w-fit rounded-full border border-teal-800/10 bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-900">
              {badge}
            </span>

            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
                {eyebrow}
              </p>
              <h1 className="display-font max-w-xl text-5xl font-semibold leading-[1.02] tracking-tight text-balance">
                {title}
              </h1>
              <p className="max-w-lg text-lg leading-8 text-slate-600">
                {description}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Acesso seguro por credenciais",
              "Sessao protegida para operacoes sensiveis",
              "Base preparada para RH, permissoes e auditoria",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-900/8 bg-white/70 p-5 text-sm leading-6 text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-[2rem] border border-white/70 p-6 sm:p-8">
          {children}
          <div className="mt-6 border-t border-slate-900/8 pt-5 text-sm text-slate-500">
            {footer}
          </div>
        </section>
      </div>
    </div>
  );
}
