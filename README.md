# Meta Restaurante

Sistema web para gestão de usuários, eventos, turmas, estudantes e pesquisas de campo, com autenticação e controle de acesso.

## Tecnologias

- Frontend: React, TypeScript e Vite
- Backend: Node.js, Express, TypeScript e Prisma
- Banco de dados: PostgreSQL
- Ambiente local integrado: Docker Compose

## Executar com Docker

Requisitos: Docker Desktop com o Docker Compose habilitado.

Na raiz do projeto, execute:

```powershell
docker compose up --build
```

Na primeira inicialização, o Compose cria o banco, aplica as migrações e insere dados iniciais. A aplicação fica disponível em:

- Frontend: http://localhost:5173
- API: http://localhost:3000
- Verificação da API: http://localhost:3000/health

Para encerrar, use `Ctrl+C`. Para iniciar os serviços em segundo plano, use `docker compose up --build -d`; para encerrá-los, use `docker compose down`. Os dados do PostgreSQL permanecem no volume `postgres_data`. Para apagar também os dados, execute `docker compose down -v`.

## Acesso inicial

- E-mail: `admin@meta.com`
- Senha: `admin123`

Troque a senha inicial antes de disponibilizar o sistema em um ambiente acessível a outras pessoas. Para uso fora de desenvolvimento, configure um `JWT_SECRET` forte no arquivo `.env` da raiz.

## Execução sem Docker

Requisitos: Node.js 20+ e PostgreSQL 14+.

1. Crie o banco `meta_restaurante` e configure `backend/.env` com base em `backend/.env.example`.
2. Instale as dependências na raiz com `npm run install:all`.
3. Gere o Prisma Client e aplique as migrações: `npm run backend:setup`.
4. Em terminais separados, execute `npm run backend:dev` e `npm run frontend:dev`.

O backend usa `DATABASE_URL`, `JWT_SECRET`, `PORT` e `FRONTEND_URL`. O frontend usa `VITE_API_URL` (padrão: `http://localhost:3000`).

## Verificações de compilação

```powershell
npm run build
```

## Estrutura

- `frontend/`: aplicação React
- `backend/`: API, esquema Prisma, migrações e seed
- `compose.yaml`: serviços de banco, API e frontend
