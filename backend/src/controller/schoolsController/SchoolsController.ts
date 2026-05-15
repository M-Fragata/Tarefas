import { Request, Response } from "express"
import { prisma } from "../../database/prisma"
import { is } from "zod/v4/locales/index.js";

export class SchoolsController {

    async unidades(req: Request, res: Response) {
        const unidades = await prisma.escola.findMany()

        return res.status(200).json(unidades)
    }

    async unidade(req: Request, res: Response) {
        const { id } = req.params

        if (!id) return res.status(400).json({ message: "Id é obrigatório" })

        const unidade = await prisma.escola.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!unidade) return res.status(404).json({ message: "Unidade não encontrada" })

        const aulas = await prisma.gradeHorario.findMany({
            where: {
                escolaId: Number(id)
            },
            include: { professor: true, disciplina: true, substituto: true }
        })

        const turmas = await prisma.turma.findMany({
            where: { escolaId: Number(id) }
        })

        const data = aulas.reduce((acc: Record<string, any>, aula) => {
            const key = `${aula.turmaId}-${aula.diaSemana}-${aula.tempo}`;
            acc[key] = {
                disciplina: aula.disciplina.sigla,
                professorNome: aula.professor?.nome,
                substitutoNome: aula.substituto?.nome,
                tipoCarencia: aula.tipoCarencia, 
                cor: aula.disciplina.corHex
            };
            return acc;
        }, {})

        return res.status(200).json({data, turmas})
    }

}