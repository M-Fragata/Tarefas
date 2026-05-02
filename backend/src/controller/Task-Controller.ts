import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { AppError } from "../utils/AppError";
import { TaskPriority, TaskStatus, TaskType } from "../../generated/prisma";
import { z } from "zod"

export class TaskController {

    async index(req: Request, res: Response) {

        const task = await prisma.task.findMany({
            where: { userID: null }
        })

        return res.json(task)

    }

    async myTask(req: Request, res: Response) {

        const paramsSchema = z.object({
            userID: z.string()
        })

        const { userID } = paramsSchema.parse(req.params)

        const myTask = await prisma.task.findMany({
            where: { userID }
        })

        return res.json(myTask)
    }

    async taskDetails(req: Request, res: Response){
        const paramsSchema = z.object({
            id: z.string()
        })

        const { id } = paramsSchema.parse(req.params)

        const task = await prisma.task.findUnique({
            where:{id},
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                tasklogs: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })
        
        if(!task) return res.status(404).json({ message: "Tarefa não encontrada" })

        return res.status(200).json(task)
    }

    async create(req: Request, res: Response) {

        const bodySchema = z.object({
            servidor: z.string(),
            matricula: z.int(),
            entrada: z.string(),
            saida: z.string(),
            tipo: z.enum(TaskType),
            description: z.string(),
            priority: z.enum(TaskPriority)
        })

        const { servidor, matricula, entrada, saida, tipo, description, priority } = bodySchema.parse(req.body)

        await prisma.task.create({
            data: {
                servidor, matricula, entrada, saida, tipo, description, priority
            }
        })

        return res.status(201).json()

    }

    async update(req: Request, res: Response) {

        const reqParams = z.object({
            userID: z.uuid()
        })

        const bodySchema = z.object({
            status: z.enum(TaskStatus).default(TaskStatus.Andamento),
            id: z.string()
        })

        const { id, status } = bodySchema.parse(req.body)

        const { userID } = reqParams.parse(req.params)

        const task = await prisma.task.findUnique({
            where: { id }
        })

        if (!task || task.userID !== null) return

        await prisma.task.update({
            where: { id },
            data: {
                userID,
                status
            }
        })

        await prisma.taskLog.create({
            data: {
                status: status,
                taskID: id
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
            where: { taskID: id }
        })

        return res.json(taskLogs)

    }
}