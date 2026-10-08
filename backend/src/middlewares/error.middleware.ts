import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Dados inválidos",
      details: error.issues.map((item) => ({
        path: item.path,
        message: item.message
      }))
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Já existe um registro com esses dados" });
    }

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    if (error.code === "P2003") {
      return res.status(400).json({ error: "Registro relacionado não encontrado" });
    }
  }

  if (error instanceof Error && error.message.includes("Can't reach database server")) {
    return res.status(503).json({
      error: "Banco de dados indisponível",
      details: "Verifique se o PostgreSQL está rodando em localhost:5432."
    });
  }

  return res.status(500).json({ error: "Erro interno do servidor" });
};
