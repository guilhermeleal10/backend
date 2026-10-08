import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origem não autorizada pelo CORS"));
  }
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use((_req, res) => {
  return res.status(404).json({ error: "Rota não encontrada" });
});

app.use(errorMiddleware);

export default app;
