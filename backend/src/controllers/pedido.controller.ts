import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
const createSchema=z.object({clienteId:z.string().uuid(),mesaId:z.string().uuid().nullable().optional(),itens:z.array(z.object({pratoId:z.string().uuid(),quantidade:z.coerce.number().int().min(1)})).min(1),observacoes:z.string().nullable().optional()});
const statusSchema=z.object({status:z.enum(["PENDENTE","PREPARANDO","PRONTO","ENTREGUE"])});
const include={cliente:true,mesa:true,itens:{include:{prato:true}},usuario:{select:{id:true,nome:true,email:true}}} as const;
export class PedidoController {
 async list(_req:Request,res:Response){return res.json(await prisma.pedido.findMany({include,orderBy:{createdAt:"desc"}}));}
 async create(req:Request,res:Response){const p=createSchema.safeParse(req.body);if(!p.success)return res.status(400).json({error:"Cliente e ao menos um prato são obrigatórios"});if(!req.user)return res.status(401).json({error:"Não autenticado"});
  const ids=[...new Set(p.data.itens.map(i=>i.pratoId))],pratos=await prisma.prato.findMany({where:{id:{in:ids},ativo:true}});if(pratos.length!==ids.length)return res.status(400).json({error:"Um dos pratos não está disponível"});
  const itens=p.data.itens.map(i=>{const d=pratos.find(x=>x.id===i.pratoId)!;return {pratoId:i.pratoId,quantidade:i.quantidade,precoUnitario:d.preco};});const total=itens.reduce((s,i)=>s+Number(i.precoUnitario)*i.quantidade,0);
  const order=await prisma.pedido.create({data:{clienteId:p.data.clienteId,mesaId:p.data.mesaId||null,usuarioId:req.user.id,observacoes:p.data.observacoes,total,itens:{create:itens}},include});return res.status(201).json(order);
 }
 async update(req:Request,res:Response){const p=statusSchema.safeParse(req.body);if(!p.success)return res.status(400).json({error:"Status inválido"});return res.json(await prisma.pedido.update({where:{id:req.params.id},data:{status:p.data.status},include}));}
 async delete(req:Request,res:Response){await prisma.pedido.delete({where:{id:req.params.id}});return res.status(204).send();}
}
