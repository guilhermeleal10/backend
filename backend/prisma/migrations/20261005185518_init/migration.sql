-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PESQUISADOR');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PESQUISADOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "local" TEXT,
    "data_inicio" TIMESTAMP(3),
    "data_fim" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "turmas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ano_escolar" TEXT,
    "escola" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudantes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "profissao_futura" TEXT NOT NULL,
    "turma_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estudantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pesquisas_campo" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "evento_id" TEXT NOT NULL,
    "estudante_id" TEXT NOT NULL,
    "observacoes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pesquisas_campo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "estudantes_turma_id_idx" ON "estudantes"("turma_id");

-- CreateIndex
CREATE INDEX "pesquisas_campo_usuario_id_idx" ON "pesquisas_campo"("usuario_id");

-- CreateIndex
CREATE INDEX "pesquisas_campo_evento_id_idx" ON "pesquisas_campo"("evento_id");

-- CreateIndex
CREATE INDEX "pesquisas_campo_estudante_id_idx" ON "pesquisas_campo"("estudante_id");

-- CreateIndex
CREATE UNIQUE INDEX "pesquisas_campo_evento_id_estudante_id_key" ON "pesquisas_campo"("evento_id", "estudante_id");

-- AddForeignKey
ALTER TABLE "estudantes" ADD CONSTRAINT "estudantes_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesquisas_campo" ADD CONSTRAINT "pesquisas_campo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesquisas_campo" ADD CONSTRAINT "pesquisas_campo_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pesquisas_campo" ADD CONSTRAINT "pesquisas_campo_estudante_id_fkey" FOREIGN KEY ("estudante_id") REFERENCES "estudantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
