import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [scheme, token] = header.trim().split(/\s+/);

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Use Authorization: Bearer <token>" });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso restrito ao administrador" });
  }
  return next();
}
