import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { UserRole } from "../../generated/prisma/enums";
import { z } from "zod"
import { hash } from "bcrypt";
import { AppError } from "../utils/AppError";


export class UserController {
    async index(req: Request, res: Response) {

        const user = await prisma.user.findMany()

        return res.json(user)

    }

    async create(req: Request, res: Response) {

        const bodySchema = z.object({
            name: z.string().min(6),
            email: z.email(),
            password: z.string()
        })

        const { name, email, password } = bodySchema.parse(req.body)

        const passwordHashed = await hash(password, 10)

        await prisma.user.create({
            data: {
                name, 
                email, 
                password: passwordHashed
            }
        })

        return res.status(201).json()

    }

    async put(req: Request, res: Response) {

        const paramsSchema = z.object({
            id: z.uuid()
        })

        const bodySchema = z.object({
            role: z.enum(UserRole).default(UserRole.user),
            teamID: z.uuid()
        })

        const { id } = paramsSchema.parse(req.params)
        const { teamID, role} = bodySchema.parse(req.body)

        const user = await prisma.user.update({
            data: {teamID, role},
            where:{id}
        })

        return res.json(user)

    }

    async remove(req: Request, res: Response) {

        const paramsSchema = z.object({
            id: z.uuid()
        })

        const { id } = paramsSchema.parse(req.params)

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if(!user){
            throw new AppError("User Not Found", 404)
        }

        await prisma.user.delete({
            where: { id }
        })

        return res.status(204).json()

    }
}