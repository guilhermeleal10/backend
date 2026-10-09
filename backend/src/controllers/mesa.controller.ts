import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
const schema=z.object({nome:z.string().trim().min(1),lugares:z.coerce.number().int().min(1).max(50),status:z.enum(["DISPONIVEL","OCUPADA","RESERVADA"])});
export class MesaController {
 async list(_q:Request,res:Response){return res.json(await prisma.mesa.findMany({include:{_count:{select:{pedidos:true}}},orderBy:{nome:"asc"}}));}
 async get(req:Request,res:Response){const x=await prisma.mesa.findUnique({where:{id:req.params.id},include:{pedidos:true}});return x?res.json(x):res.status(404).json({error:"Mesa não encontrada"});}
 async create(req:Request,res:Response){const p=schema.safeParse(req.body);if(!p.success)return res.status(400).json({error:"Dados da mesa inválidos"});return res.status(201).json(await prisma.mesa.create({data:p.data}));}
 async update(req:Request,res:Response){const p=schema.partial().safeParse(req.body);if(!p.success)return res.status(400).json({error:"Dados inválidos"});return res.json(await prisma.mesa.update({where:{id:req.params.id},data:p.data}));}
 async delete(req:Request,res:Response){await prisma.mesa.delete({where:{id:req.params.id}});return res.status(204).send();}
 async students(_req:Request,res:Response){return res.json([]);}
}
