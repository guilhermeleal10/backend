import { Router } from "express";
import { authMiddleware, requireAdmin } from "./middlewares/auth.middleware";
import { AuthController } from "./controllers/auth.controller";
import { UserController } from "./controllers/user.controller";
import { TurmaController } from "./controllers/turma.controller";
import { EstudanteController } from "./controllers/estudante.controller";
import { EventoController } from "./controllers/evento.controller";
import { PesquisaController } from "./controllers/pesquisa.controller";

const router = Router();

const auth = new AuthController();
const users = new UserController();
const turmas = new TurmaController();
const estudantes = new EstudanteController();
const eventos = new EventoController();
const pesquisas = new PesquisaController();

router.get("/health", (_req, res) => {
  return res.json({
    ok: true,
    service: "monitoramento-eventos-backend",
    timestamp: new Date().toISOString()
  });
});

router.post("/login", auth.login.bind(auth));

router.use(authMiddleware);

router.get("/me", auth.me.bind(auth));
router.post("/logout", auth.logout.bind(auth));

router.get("/mesas", turmas.list.bind(turmas));
router.get("/turmas", turmas.list.bind(turmas));
router.get("/mesas/:id", turmas.get.bind(turmas));
router.get("/turmas/:id", turmas.get.bind(turmas));
router.get("/turmas/:id/estudantes", turmas.students.bind(turmas));
router.post("/mesas", turmas.create.bind(turmas));
router.post("/turmas", turmas.create.bind(turmas));
router.put("/mesas/:id", turmas.update.bind(turmas));
router.put("/turmas/:id", turmas.update.bind(turmas));
router.delete("/mesas/:id", turmas.delete.bind(turmas));
router.delete("/turmas/:id", turmas.delete.bind(turmas));

router.get("/clientes", estudantes.list.bind(estudantes));
router.get("/estudantes", estudantes.list.bind(estudantes));
router.get("/clientes/:id", estudantes.get.bind(estudantes));
router.get("/estudantes/:id", estudantes.get.bind(estudantes));
router.post("/clientes", estudantes.create.bind(estudantes));
router.post("/estudantes", estudantes.create.bind(estudantes));
router.put("/clientes/:id", estudantes.update.bind(estudantes));
router.put("/estudantes/:id", estudantes.update.bind(estudantes));
router.delete("/clientes/:id", estudantes.delete.bind(estudantes));
router.delete("/estudantes/:id", estudantes.delete.bind(estudantes));

router.get("/cardapio", eventos.list.bind(eventos));
router.get("/eventos", eventos.list.bind(eventos));
router.get("/cardapio/:id", eventos.get.bind(eventos));
router.get("/eventos/:id", eventos.get.bind(eventos));
router.post("/cardapio", eventos.create.bind(eventos));
router.post("/eventos", eventos.create.bind(eventos));
router.put("/cardapio/:id", eventos.update.bind(eventos));
router.put("/eventos/:id", eventos.update.bind(eventos));
router.delete("/cardapio/:id", eventos.delete.bind(eventos));
router.delete("/eventos/:id", eventos.delete.bind(eventos));

router.get("/pedidos", pesquisas.list.bind(pesquisas));
router.get("/pesquisas", pesquisas.list.bind(pesquisas));
router.post("/pedidos", pesquisas.create.bind(pesquisas));
router.post("/pesquisas", pesquisas.create.bind(pesquisas));
router.delete("/pedidos/:id", pesquisas.delete.bind(pesquisas));
router.delete("/pesquisas/:id", pesquisas.delete.bind(pesquisas));

router.use("/usuarios", requireAdmin);
router.get("/usuarios", users.list.bind(users));
router.post("/usuarios", users.create.bind(users));
router.put("/usuarios/:id", users.update.bind(users));
router.delete("/usuarios/:id", users.delete.bind(users));

export default router;
