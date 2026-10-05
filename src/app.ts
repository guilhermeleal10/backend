import express from 'express';
import cors from 'cors';
import routes from './routes';
import { AppError } from './types';
import { NextFunction, Request, Response } from 'express';

const app = express();

app.set('query parser', 'extended');

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) { next(error); return; }
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }
  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
