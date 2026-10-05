import { Router } from "express";
import { CursoController } from "../controllers/curso.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();
const controller = new CursoController();

router.use(authenticate);
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
