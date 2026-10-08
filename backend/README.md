# Backend do Meta Restaurante

API REST construída com Express, TypeScript e Prisma. Para iniciar o projeto completo com Docker, consulte o [README da raiz](../README.md).

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## Configuração local

1. Copie `.env.example` para `.env` e ajuste `DATABASE_URL` para o seu PostgreSQL.
2. Instale as dependências: `npm install`.
3. Gere o Prisma Client, aplique as migrações e carregue os dados iniciais: `npm run setup`.
4. Inicie a API: `npm run dev`.

Variáveis utilizadas: `DATABASE_URL`, `JWT_SECRET`, `PORT` (padrão `3000`) e `FRONTEND_URL` (padrão `http://localhost:5173`).

## Endpoints

- API: http://localhost:3000
- Health check: http://localhost:3000/health

## Conta inicial

- E-mail: `admin@meta.com`
- Senha: `admin123`

Altere a senha inicial e use um segredo JWT forte antes de disponibilizar a aplicação fora de desenvolvimento.
