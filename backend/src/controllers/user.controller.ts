import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/password";

const createSchema = z.object({
  nome: z.string().trim().min(1),
  email: z.string().email(),
  senha: z.string().min(6),
  role: z.enum(["ADMIN", "ATENDENTE"]).default("ATENDENTE")
});

const updateSchema = createSchema.partial();

export class UserController {
  async list(_req: Request, res: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { nome: "asc" }
    });

    return res.json(users);
  }

  async create(req: Request, res: Response) {
    const parsed = createSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Nome, e-mail, senha mínima de 6 caracteres e perfil são obrigatórios"
      });
    }

    const user = await prisma.user.create({
      data: {
        nome: parsed.data.nome,
        email: parsed.data.email.toLowerCase(),
        senha: await hashPassword(parsed.data.senha),
        role: parsed.data.role
      },
      select: { id: true, nome: true, email: true, role: true }
    });

    return res.status(201).json(user);
  }

  async update(req: Request, res: Response) {
    const parsed = updateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    const data: {
      nome?: string;
      email?: string;
      senha?: string;
      role?: "ADMIN" | "ATENDENTE";
    } = {};

    if (parsed.data.nome !== undefined) data.nome = parsed.data.nome;
    if (parsed.data.email !== undefined) data.email = parsed.data.email.toLowerCase();
    if (parsed.data.role !== undefined) data.role = parsed.data.role;
    if (parsed.data.senha !== undefined) data.senha = await hashPassword(parsed.data.senha);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, nome: true, email: true, role: true }
    });

    return res.json(user);
  }

  async delete(req: Request, res: Response) {
    if (req.params.id === req.user?.id) {
      return res.status(400).json({ error: "Não é permitido excluir a própria conta" });
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }
}
