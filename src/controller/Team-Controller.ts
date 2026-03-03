import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import { z } from "zod"

export class TeamController {

    async index(req: Request, res: Response){
        const team = await prisma.team.findMany()

        return res.json(team)
    }

    async create(req: Request, res: Response){
        const bodySchema = z.object({
            name: z.string(),
            description: z.string()
        })

        const { name, description} = bodySchema.parse(req.body)

        await prisma.team.create({
            data: {
                name,
                description
            }
        })

        return res.status(201).json()

    }
}