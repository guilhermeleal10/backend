import { Router } from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";
import courseRoutes from "./curso.route";
const routes = Router();

routes.use("/users", userRoutes);
routes.use("/auth", authRoutes);
routes.use("/courses", courseRoutes);

routes.get("/", (req, res) => {
  res.json({ message: "API acadêmica - Cursos e autenticação" });
});

export default routes;
