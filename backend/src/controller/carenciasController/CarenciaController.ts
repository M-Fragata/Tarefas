import { Request, Response } from "express"
import { prisma } from "../../database/prisma"

export class CarenciaController {
    async unidades(req: Request, res: Response) {
        const unidades = await prisma.escola.findMany()

        return res.status(200).json(unidades)
    }

    async carencia(req: Request, res: Response) {
        const { escolaId, disciplina, turno, diaSemana, horarioTempo, turma } = req.body

        await prisma.carenciaDocente.upsert({
            where: {
                // Aqui usamos a chave composta que definimos no @@unique
                escolaId_disciplina_turno_diaSemana_horarioTempo: {
                    escolaId: Number(escolaId),
                    disciplina,
                    turno,
                    diaSemana: Number(diaSemana),
                    horarioTempo: Number(horarioTempo),
                }
            },
            update: {
                turma: turma,
                updatedAt: new Date(),
            },
            create: {
                escolaId: Number(escolaId),
                disciplina,
                turno,
                diaSemana: Number(diaSemana),
                horarioTempo: Number(horarioTempo),
                turma,
            },
        });

    }

    async boards(req: Request, res: Response) {

        const carencias = await prisma.carenciaDocente.findMany({
            include: { escola: true }
        })

        const grouped = carencias.reduce((map, carencia) => {
            const key = `${carencia.escolaId}-${carencia.disciplina}-${carencia.turno}`

            if (!map.has(key)) {
                map.set(key, {
                    escolaId: carencia.escolaId,
                    escolaNome: carencia.escola.nome,
                    disciplina: carencia.disciplina,
                    turno: carencia.turno,
                    grade: {},
                })
            }

            const board = map.get(key)!
            board.grade[`${carencia.diaSemana}-${carencia.horarioTempo}`] = carencia.turma?.toString() ?? ''
            return map
        }, new Map<string, {
            escolaId: number
            escolaNome: string
            disciplina: string
            turno: string
            grade: Record<string, string>
        }>())

        return res.status(200).json(Array.from(grouped.values()))

    }

    async index(req: Request, res: Response) {

        const carencias = await prisma.carenciaDocente.findMany({
            include: {
                escola: {
                    select: {
                        nome: true
                    }
                }
            }
        })

        return res.status(200).json(carencias)

    }
}