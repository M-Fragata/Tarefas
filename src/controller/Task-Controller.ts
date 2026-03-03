import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import { TaskPriority } from "../../generated/prisma/enums";
import { z } from "zod"

export class TaskController {

    async index(req: Request, res: Response){

        const task = await prisma.task.findMany()

        return res.json(task)

    }

    async create(req: Request, res: Response) {

        const bodySchema = z.object({
            userID: z.uuid(),
            title: z.string(),
            description: z.string(),
            priority: z.enum(TaskPriority)
        })

        const { userID, title, description, priority } = bodySchema.parse(req.body)

        const user = await prisma.user.findUnique({ where: { id: userID } })

        if (!user) {
            throw new AppError("User Not Found", 404)
        }

        await prisma.task.create({
            data: {
                userID, title, description, priority
            }
        })

        return res.status(201).json()

    }
}