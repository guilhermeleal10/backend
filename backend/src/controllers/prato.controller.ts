import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const schema = z.object({ nome:z.string().trim().min(1), descricao:z.string().nullable().optional(), categoria:z.string().nullable().optional(), preco:z.coerce.number().min(0), ativo:z.boolean().optional() });
export class PratoController {
 async list(_req:Request,res:Response){return res.json(await prisma.prato.findMany({orderBy:{nome:"asc"}}));}
 async get(req:Request,res:Response){const item=await prisma.prato.findUnique({where:{id:req.params.id}});return item?res.json(item):res.status(404).json({error:"Prato não encontrado"});}
 async create(req:Request,res:Response){const p=schema.safeParse(req.body);if(!p.success)return res.status(400).json({error:"Informe nome e preço válido"});return res.status(201).json(await prisma.prato.create({data:p.data}));}
 async update(req:Request,res:Response){const p=schema.partial().safeParse(req.body);if(!p.success)return res.status(400).json({error:"Dados inválidos"});return res.json(await prisma.prato.update({where:{id:req.params.id},data:p.data}));}
 async delete(req:Request,res:Response){await prisma.prato.delete({where:{id:req.params.id}});return res.status(204).send();}
}
