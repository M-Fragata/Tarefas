import { type Request, type Response } from "express";

import { SendEmailWithPDF } from "../services/SendEmailWithPDF"

export class GeneratePDFController {
    async generate(req: Request, res: Response) {

        const dados = req.body

console.log(dados)

        await SendEmailWithPDF(dados, 'ENTRADA')
        await SendEmailWithPDF(dados, 'SAIDA')

        return res.status(200).json({message: `Emails enviados com sucessos!`})
    }
}