import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import { z } from "zod"

export class TeamController {

    async index(req: Request, res: Response) {
        const team = await prisma.team.findMany({
            include: {
                _count: {
                    select: { users: true }
                },
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        })

        return res.json(team)
    }

    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            name: z.string().min(5),
            description: z.string()
        })

        const { name, description } = bodySchema.parse(req.body)

        await prisma.team.create({
            data: {
                name,
                description
            }
        })

        return res.status(201).json()
    }

    async remove(req: Request, res: Response) {

        const paramsSchema = z.object({
            id: z.uuid()
        })

        const { id } = paramsSchema.parse(req.params)

        const team = await prisma.team.findUnique({
            where: { id }
        })

        if (!team) {
            throw new AppError("User Not Found")
        }

        await prisma.team.delete({
            where: {
                id
            }
        })

        return res.status(204).json()

    }

    async update(req: Request, res: Response) {

        const paramsSchema = z.object({
            id: z.uuid()
        })

        const { id } = paramsSchema.parse(req.params)

        const bodySchema = z.object({
            "name": z.string(),
            "description": z.string()
        })

        const { name, description } = bodySchema.parse(req.body)


        const team = await prisma.team.findUnique({
            where: { id }
        })

        if (!team) {
            throw new AppError("User Not Found")
        }

        await prisma.team.update({
            data: {
                name, description
            },
            where: {
                id
            }
        })

        return res.status(200).json()

    }

}