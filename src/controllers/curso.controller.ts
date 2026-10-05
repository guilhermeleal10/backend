import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CursoService } from "../services/curso.service";

const courseInput = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().optional(),
  durationSemesters: z.coerce.number().int().positive(),
});

export class CursoController {
  private readonly cursoService = new CursoService();

  public list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json(await this.cursoService.list(req.user!.id));
    } catch (error) { next(error); }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const course = await this.cursoService.getById(req.user!.id, req.params.id as string);
      if (!course) { res.status(404).json({ message: "Curso não encontrado" }); return; }
      res.status(200).json(course);
    } catch (error) { next(error); }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = courseInput.parse(req.body);
      res.status(201).json(await this.cursoService.create(req.user!.id, data));
    } catch (error) {
      if (error instanceof z.ZodError) { res.status(400).json({ message: "Dados inválidos", errors: error.issues }); return; }
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = courseInput.partial().parse(req.body);
      if (Object.keys(data).length === 0) { res.status(400).json({ message: "Informe ao menos um campo para atualizar" }); return; }
      const course = await this.cursoService.update(req.user!.id, req.params.id as string, data);
      if (!course) { res.status(404).json({ message: "Curso não encontrado" }); return; }
      res.status(200).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) { res.status(400).json({ message: "Dados inválidos", errors: error.issues }); return; }
      next(error);
    }
  };

  public remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const removed = await this.cursoService.remove(req.user!.id, req.params.id as string);
      if (!removed) { res.status(404).json({ message: "Curso não encontrado" }); return; }
      res.status(204).end();
    } catch (error) { next(error); }
  };
}
