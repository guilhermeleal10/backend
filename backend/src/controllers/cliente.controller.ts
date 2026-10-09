import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
const schema=z.object({nome:z.string().trim().min(1),telefone:z.string().trim().nullable().optional(),email:z.string().trim().email().nullable().or(z.literal("")).optional()});
export class ClienteController {
 async list(_q:Request,res:Response){return res.json(await prisma.cliente.findMany({orderBy:{nome:"asc"}}));}
 async get(req:Request,res:Response){const x=await prisma.cliente.findUnique({where:{id:req.params.id},include:{pedidos:true}});return x?res.json(x):res.status(404).json({error:"Cliente não encontrado"});}
 async create(req:Request,res:Response){const p=schema.safeParse(req.body);if(!p.success)return res.status(400).json({error:"Nome e contato válido são necessários"});return res.status(201).json(await prisma.cliente.create({data:{...p.data,email:p.data.email||null}}));}
 async update(req:Request,res:Response){const p=schema.partial().safeParse(req.body);if(!p.success)return res.status(400).json({error:"Dados inválidos"});return res.json(await prisma.cliente.update({where:{id:req.params.id},data:{...p.data,email:p.data.email||null}}));}
 async delete(req:Request,res:Response){await prisma.cliente.delete({where:{id:req.params.id}});return res.status(204).send();}
}
