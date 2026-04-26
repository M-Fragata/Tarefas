import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import { TaskPriority, TaskStatus } from "../../generated/prisma";
import { z } from "zod"

export class TaskController {

    async index(req: Request, res: Response) {

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

    async update(req: Request, res: Response) {

        const reqParams = z.object({
            id: z.uuid()
        })

        const bodySchema = z.object({
            priority: z.enum(TaskPriority),
            status: z.enum(TaskStatus)
        })

        if (!req.user) return

        const userId = req.user.id
        const userRole = req.user.role

        const { id: taskId } = reqParams.parse(req.params)

        const task = await prisma.task.findUnique({
            where: { id: taskId }
        })

        if (!task) return

        if (task.userID !== userId && userRole !== "admin") {
            console.log("caindo aqui")
            throw new AppError("Usuário não autorizado", 401)
        }

        const { priority, status } = bodySchema.parse(req.body)

        await prisma.task.update({
            where: { id: taskId },
            data: {
                priority,
                status
            }
        })

        await prisma.taskLog.create({
            data: {
                description: status,
                taskID: taskId
            }
        })

        return res.status(200).json({ message: "Task editada com suceddo!" })

    }

    async remove(req: Request, res: Response) {

        const reqParamsSchema = z.object({
            id: z.uuid()
        })

        const { id } = reqParamsSchema.parse(req.params)

        await prisma.task.delete({
            where: { id }
        })

        return res.status(204).json({ message: "Task deletada com sucesso!" })

    }

    async status(req: Request, res: Response) {

        const bodySchema = z.object({
            status: z.enum(TaskStatus)
        })

        const { status } = bodySchema.parse(req.body)

        const statusTask = await prisma.task.findMany({
            where: { status }
        })

        return res.json(statusTask)
    }

    async priority(req: Request, res: Response) {

        const bodySchema = z.object({
            priority: z.enum(TaskPriority)
        })

        const { priority } = bodySchema.parse(req.body)

        const priorityTask = await prisma.task.findMany({
            where: { priority }
        })

        return res.json(priorityTask)

    }

    async historic(req: Request, res: Response) {

        const paramsSchema = z.object({
            id: z.uuid()
        })

        const { id } = paramsSchema.parse(req.params)

        const taskLogs = await prisma.taskLog.findMany({
            where: {taskID: id}
        })

        return res.json(taskLogs)

    }
}