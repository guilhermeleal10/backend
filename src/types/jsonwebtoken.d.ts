declare module "jsonwebtoken" {
  export type SignOptions = { expiresIn?: number | string };
  export type JwtPayload = { [key: string]: unknown; sub?: string; email?: string };

  const jwt: {
    sign(payload: object, secret: string, options?: SignOptions): string;
    verify(token: string, secret: string): string | JwtPayload;
  };

  export default jwt;
}
