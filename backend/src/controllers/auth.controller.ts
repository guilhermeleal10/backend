import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(1, "Senha obrigatória")
});

export class AuthController {
  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase().trim() }
    });

    if (!user || !(await comparePassword(parsed.data.senha, user.senha))) {
      return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    });
  }

  async me(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json(user);
  }

  async logout(_req: Request, res: Response) {
    return res.json({ message: "Logout realizado com sucesso" });
  }
}
