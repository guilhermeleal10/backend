import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const schema = z.object({
  nome: z.string().trim().min(1),
  idade: z.coerce.number().int().min(1).max(120),
  profissaoFutura: z.string().trim().min(1),
  turmaId: z.string().uuid()
});

export class EstudanteController {
  async list(req: Request, res: Response) {
    const turmaId = typeof req.query.turmaId === "string" ? req.query.turmaId : undefined;

    const students = await prisma.estudante.findMany({
      where: turmaId ? { turmaId } : undefined,
      include: { turma: true },
      orderBy: { nome: "asc" }
    });

    return res.json(students);
  }

  async get(req: Request, res: Response) {
    const student = await prisma.estudante.findUnique({
      where: { id: req.params.id },
      include: {
        turma: true,
        pesquisas: {
          include: { evento: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!student) return res.status(404).json({ error: "Estudante não encontrado" });
    return res.json(student);
  }

  async create(req: Request, res: Response) {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Nome, idade, profissão futura e turma são obrigatórios"
      });
    }

    const student = await prisma.estudante.create({
      data: parsed.data,
      include: { turma: true }
    });

    return res.status(201).json(student);
  }

  async update(req: Request, res: Response) {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inválidos" });

    const student = await prisma.estudante.update({
      where: { id: req.params.id },
      data: parsed.data,
      include: { turma: true }
    });

    return res.json(student);
  }

  async delete(req: Request, res: Response) {
    await prisma.estudante.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }
}
