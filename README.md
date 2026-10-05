# API acadêmica

API REST em Node.js, Express, TypeScript e Prisma para uma instituição de ensino superior. O recurso principal é o cadastro de cursos; as rotas de cursos exigem autenticação JWT e cada usuário acessa somente os cursos que cadastrou.

## Requisitos

- Node.js e npm
- Docker Desktop com Docker Compose
- PowerShell

## Configuração e inicialização

Execute os comandos a partir da pasta do projeto:

```powershell
cd "C:\caminho\para\lab-backend-2026"
npm install
```

O arquivo `.env` não é versionado. Crie-o na raiz do projeto:

```powershell
@'
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/lab_backend_2026
'@ | Set-Content -Encoding ascii .env
```

Suba o PostgreSQL e o pgAdmin:

```powershell
docker compose up -d
docker compose ps
```

O PostgreSQL fica disponível em `localhost:5433`; o pgAdmin, em <http://localhost:8081>. O Compose usa um volume chamado `postgres_data` para persistir os dados.

Gere o Prisma Client e aplique as migrações:

```powershell
npx prisma generate
npx prisma migrate deploy
```

Inicie a API em modo de desenvolvimento:

```powershell
npm run dev
```

A API fica em <http://localhost:3000>. Para compilar e executar a versão compilada:

```powershell
npm run build
npm start
```

Confirme a resposta da API em outro terminal PowerShell:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api
```

## Cadastro e autenticação

Crie um usuário. A senha deve ter pelo menos seis caracteres e é armazenada com hash:

```powershell
$usuario = @{
  name = "Ana Silva"
  email = "ana@example.com"
  password = "senha123"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/api/users `
  -ContentType "application/json" `
  -Body $usuario
```

Faça login e guarde o JWT retornado:

```powershell
$credenciais = @{
  email = "ana@example.com"
  password = "senha123"
} | ConvertTo-Json

$sessao = Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/api/auth/login `
  -ContentType "application/json" `
  -Body $credenciais

$token = $sessao.token
$headers = @{ Authorization = "Bearer $token" }
```

Consulte o usuário autenticado:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/auth/me -Headers $headers
```

As rotas de cursos respondem `401 Unauthorized` quando o cabeçalho `Authorization: Bearer <token>` está ausente ou inválido.

## Cursos

O corpo de criação aceita `name`, `description` (opcional) e `durationSemesters` (inteiro positivo). Todas as rotas abaixo exigem `$headers`:

```powershell
# Listar cursos do usuário autenticado
Invoke-RestMethod -Uri http://localhost:3000/api/courses -Headers $headers

# Criar curso
$curso = @{
  name = "Engenharia de Software"
  description = "Curso de graduação"
  durationSemesters = 8
} | ConvertTo-Json

$novoCurso = Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/api/courses `
  -Headers $headers `
  -ContentType "application/json" `
  -Body $curso

# Consultar por ID
$cursoId = $novoCurso.id
Invoke-RestMethod -Uri "http://localhost:3000/api/courses/$cursoId" -Headers $headers

# Atualizar parcialmente
$alteracao = @{ durationSemesters = 9 } | ConvertTo-Json
Invoke-RestMethod `
  -Method Patch `
  -Uri "http://localhost:3000/api/courses/$cursoId" `
  -Headers $headers `
  -ContentType "application/json" `
  -Body $alteracao

# Excluir
Invoke-RestMethod `
  -Method Delete `
  -Uri "http://localhost:3000/api/courses/$cursoId" `
  -Headers $headers
```

| Método | Rota | Ação |
| --- | --- | --- |
| `POST` | `/api/users` | Cadastrar usuário |
| `POST` | `/api/auth/login` | Autenticar e obter JWT |
| `GET` | `/api/auth/me` | Consultar usuário autenticado |
| `GET` | `/api/courses` | Listar cursos próprios |
| `POST` | `/api/courses` | Cadastrar curso |
| `GET` | `/api/courses/:id` | Consultar curso próprio |
| `PATCH` | `/api/courses/:id` | Atualizar curso próprio |
| `DELETE` | `/api/courses/:id` | Excluir curso próprio |

## Encerrar os containers

```powershell
docker compose down
```

Esse comando mantém o volume e os dados do banco. Para apagar também o banco local e todos os dados persistidos, use `docker compose down -v`.
