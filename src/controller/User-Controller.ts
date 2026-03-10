import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { UserRole } from "../../generated/prisma/enums";
import { z } from "zod"
import { hash, compare } from "bcrypt";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken"


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
            name: z.string().min(3),
            email: z.email(),
            role: z.enum(UserRole).default(UserRole.user)
        })

        const { id } = paramsSchema.parse(req.params)
        const { name, email, role } = bodySchema.parse(req.body)

        const user = await prisma.user.update({
            data: {name, email, role},
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

    async login(req: Request, res: Response){
       
            
            const bodySchema = z.object({
                email: z.email(),
                password: z.string()
            })

            const { email, password} = bodySchema.parse(req.body)

            const user = await prisma.user.findUnique({where: {
                email
            }})

            if(!user) {
                throw new AppError("Email ou senha incorretos")
            }

            const verifyPassword = await compare(password, user.password)

            if(!verifyPassword) {
                throw new AppError("Email ou senha incorretos")
            }

            const token = jwt.sign({role: user.role}, process.env.SECRET_KEY!, {
                subject: user.id,
                expiresIn: "1d"
            })


            const { password: _, ...userWithoutPassword} = user

            return res.json({
                userWithoutPassword,
                token
            })
    
    }
}