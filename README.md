# PulseWork

Aplicação de onboarding e acompanhamento de colaboradores com `Next.js`, `NextAuth`, `Prisma` e `PostgreSQL`.

## Ambiente local

1. Copie `.env.example` para `.env`.
2. Ajuste `DATABASE_URL`, `NEXTAUTH_URL` e `NEXTAUTH_SECRET`.
3. Gere o client do Prisma:

```bash
npm run prisma:generate
```

4. Sincronize o banco local:

```bash
npm run prisma:push
```

5. Inicie a aplicação:

```bash
npm run dev
```

## Deploy no Railway

1. Crie um projeto no Railway.
2. Adicione o repositório GitHub deste projeto.
3. Adicione um serviço PostgreSQL no mesmo projeto, ou reutilize o atual.
4. No serviço da aplicação, configure as variáveis:

```bash
DATABASE_URL=<reference variable do Postgres>
NEXTAUTH_URL=https://seu-app.up.railway.app
NEXTAUTH_SECRET=<segredo forte>
```

5. Em `Settings -> Deploy -> Pre-deploy Command`, configure:

```bash
npm run prisma:migrate:deploy
```

6. Gere o domínio público em `Settings -> Networking`.

## Produção

- `next.config.ts` usa `output: "standalone"` para deploy mais previsível no Railway.
- O projeto possui migration baseline em `prisma/migrations`.
- O build já roda `prisma generate` antes de `next build`.
