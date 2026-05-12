# PulseWork

Aplicacao inicial para controle de funcionarios com `Next.js`, `NextAuth`, `Prisma` e `PostgreSQL`.

## Como rodar

1. Copie `.env.example` para `.env`.
2. Ajuste `DATABASE_URL`, `NEXTAUTH_URL` e `NEXTAUTH_SECRET`.
3. Gere o client do Prisma:

```bash
npm run prisma:generate
```

4. Envie o schema para o banco:

```bash
npm run prisma:push
```

5. Inicie a aplicacao:

```bash
npm run dev
```

## MVP entregue

- Criacao de conta com hash seguro de senha
- Login com credenciais
- Logout
- Area autenticada inicial
