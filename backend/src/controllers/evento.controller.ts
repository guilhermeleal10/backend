import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const schema = z.object({
  nome: z.string().trim().min(1),
  descricao: z.string().optional().nullable(),
  local: z.string().optional().nullable(),
  dataInicio: z.coerce.date().optional().nullable(),
  dataFim: z.coerce.date().optional().nullable(),
  ativo: z.boolean().optional()
});

export class EventoController {
  async list(_req: Request, res: Response) {
    const events = await prisma.evento.findMany({
      include: { _count: { select: { pesquisas: true } } },
      orderBy: [{ ativo: "desc" }, { dataInicio: "asc" }, { nome: "asc" }]
    });

    return res.json(events);
  }

  async get(req: Request, res: Response) {
    const event = await prisma.evento.findUnique({
      where: { id: req.params.id },
      include: {
        pesquisas: {
          include: {
            estudante: { include: { turma: true } },
            usuario: { select: { id: true, nome: true, email: true } }
          }
        }
      }
    });

    if (!event) return res.status(404).json({ error: "Evento não encontrado" });
    return res.json(event);
  }

  async create(req: Request, res: Response) {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados do evento inválidos" });

    const event = await prisma.evento.create({ data: parsed.data });
    return res.status(201).json(event);
  }

  async update(req: Request, res: Response) {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados inválidos" });

    const event = await prisma.evento.update({
      where: { id: req.params.id },
      data: parsed.data
    });

    return res.json(event);
  }

  async delete(req: Request, res: Response) {
    await prisma.evento.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }
}
