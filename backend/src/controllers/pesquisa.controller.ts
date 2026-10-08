import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const schema = z.object({
  eventoId: z.string().uuid(),
  estudanteId: z.string().uuid(),
  observacoes: z.string().optional().nullable()
});

export class PesquisaController {
  async list(req: Request, res: Response) {
    const eventoId = typeof req.query.eventoId === "string" ? req.query.eventoId : undefined;
    const turmaId = typeof req.query.turmaId === "string" ? req.query.turmaId : undefined;

    const records = await prisma.pesquisaCampo.findMany({
      where: {
        ...(eventoId ? { eventoId } : {}),
        ...(turmaId ? { estudante: { turmaId } } : {})
      },
      include: {
        evento: true,
        estudante: { include: { turma: true } },
        usuario: { select: { id: true, nome: true, email: true, role: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return res.json(records);
  }

  async create(req: Request, res: Response) {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Evento e estudante são obrigatórios" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const record = await prisma.pesquisaCampo.create({
      data: {
        eventoId: parsed.data.eventoId,
        estudanteId: parsed.data.estudanteId,
        observacoes: parsed.data.observacoes,
        usuarioId: req.user.id
      },
      include: {
        evento: true,
        estudante: { include: { turma: true } },
        usuario: { select: { id: true, nome: true, email: true } }
      }
    });

    return res.status(201).json(record);
  }

  async delete(req: Request, res: Response) {
    const record = await prisma.pesquisaCampo.findUnique({
      where: { id: req.params.id }
    });

    if (!record) return res.status(404).json({ error: "Pesquisa não encontrada" });

    if (req.user?.role !== "ADMIN" && record.usuarioId !== req.user?.id) {
      return res.status(403).json({ error: "Você só pode excluir seus próprios registros" });
    }

    await prisma.pesquisaCampo.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }
}
