import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Testando conexão com PostgreSQL...");
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);

  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log("OK: PostgreSQL está acessível.");
  } catch (error) {
    console.error("ERRO: PostgreSQL não está acessível.");
    console.error("");
    console.error("Verifique se o serviço está iniciado e se a porta 5432 está liberada.");
    console.error("");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
