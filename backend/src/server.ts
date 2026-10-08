import "dotenv/config";
import app from "./app";
import { prisma, disconnectPrisma } from "./lib/prisma";

const port = Number(process.env.PORT || 3000);

async function main() {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error("");
    console.error("==============================================");
    console.error(" ERRO: PostgreSQL indisponível");
    console.error("==============================================");
    console.error("Verifique:");
    console.error("1. PostgreSQL está instalado.");
    console.error("2. O serviço PostgreSQL está iniciado.");
    console.error("3. A porta 5432 está disponível.");
    console.error("4. DATABASE_URL no .env está correta.");
    console.error("");
    console.error("DATABASE_URL:", process.env.DATABASE_URL);
    console.error("");
    throw error;
  }

  const server = app.listen(port, () => {
    console.log(`Backend iniciado em http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectPrisma();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch(async (error) => {
  console.error("Falha ao iniciar o servidor.");
  console.error(error);
  await disconnectPrisma();
  process.exit(1);
});
