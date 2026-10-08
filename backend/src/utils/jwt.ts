import jwt from "jsonwebtoken";

export type UserRole = "ADMIN" | "PESQUISADOR";

export type JwtPayload = {
  id: string;
  email: string;
  role: UserRole;
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não configurado no arquivo .env");
  }
  return secret;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "8h" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}
