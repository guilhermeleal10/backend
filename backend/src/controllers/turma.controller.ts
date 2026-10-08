import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const schema = z.object({
  nome: z.string().trim().min(1),
  anoEscolar: z.string().trim().optional().nullable(),
  escola: z.string().trim().optional().nullable()
});

export class TurmaController {
  async list(_req: Request, res: Response) {
    const turmas = await prisma.turma.findMany({
      include: { _count: { select: { estudantes: true } } },
      orderBy: { nome: "asc" }
    });

    return res.json(turmas);
  }

  async get(req: Request, res: Response) {
    const turma = await prisma.turma.findUnique({
      where: { id: req.params.id },
      include: { estudantes: true }
    });

    if (!turma) return res.status(404).json({ error: "Turma não encontrada" });
    return res.json(turma);
  }

  async create(req: Request, res: Response) {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Nome da turma é obrigatório" });

    const turma = await prisma.turma.create({ data: parsed.data });
    return res.status(201).json(turma);
  }

  async update(req: Request, res: Response) {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inválidos" });

    const turma = await prisma.turma.update({
      where: { id: req.params.id },
      data: parsed.data
    });

    return res.json(turma);
  }

  async delete(req: Request, res: Response) {
    await prisma.turma.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }

  async students(req: Request, res: Response) {
    const students = await prisma.estudante.findMany({
      where: { turmaId: req.params.id },
      orderBy: { nome: "asc" }
    });

    return res.json(students);
  }
}
