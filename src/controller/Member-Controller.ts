import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { z } from "zod"
import { prisma } from "../database/prisma";


export class MemberController {

    async adicionar(req: Request, res: Response) {

        const paramsSchema = z.object({
            teamID: z.uuid()
        })

        const { teamID } = paramsSchema.parse(req.params)

        const team = await prisma.team.findUnique({
            where: { id: teamID }
        })

        if (!team) {
            throw new AppError("Team Not Found", 404)
        }

        const bodySchema = z.object({
            userID: z.uuid()
        })

        const { userID } = bodySchema.parse(req.body)

        const user = await prisma.user.findUnique({
            where: { id: userID }
        })

        if (!user) {
            throw new AppError("User Not Found", 404)
        }

        await prisma.user.update({
            data: {
                teamID
            },
            where: { id: userID }
        })

        return res.status(200).json({ message: `Usuário ${user.name} movido para o time ${team.name}` })

    }

    async remover(req: Request, res: Response) {

        const paramsSchema = z.object({
            userID: z.uuid()
        })

        const { userID } = paramsSchema.parse(req.params)

        const user = await prisma.user.findUnique({
            where: { id: userID }
        })

        if (!user) {
            throw new AppError("User Not Found", 404)
        }

        await prisma.user.update({
            where: { id: userID },
            data: {
                teamID: null
            }
        })

        return res.json({ message: "Membro removido do time com sucesso" })
    }

}