import { type Request, type Response } from "express";

import { EcidadeService } from "../services/EcidadeService"

export class EcidadeController{
    async movimentar(req: Request, res: Response){

        const {task} = req.body

        await EcidadeService(task)

        return res.status(200).json({message: "Login feito com sucesso"})
    }
}