import { type Request, type Response } from "express";
import { prisma } from "../database/prisma";
import { SendEmailWithPDF } from "../services/SendEmailWithPDF"
import { Task } from "../types/Task";

export class GeneratePDFController {
    async generate(req: Request, res: Response) {

        const { dados, memorandoNumber, encaminhamentoNumber } = req.body

        console.log(dados)

        let currentMemo = memorandoNumber
        let currentEnc = encaminhamentoNumber

        for (const dado of dados) {
            if (dado.enviado) {
                console.log(`Task ${dado.id} já enviada.`);
                continue; 
            }

            const numeroAtribuido = dado.isMemorando ? currentMemo++ : currentEnc++;

            const taskAtualizada = await prisma.task.update({
                where: { id: dado.id },
                data: {
                    number: numeroAtribuido,
                    enviado: true
                }
            });

            // Envio para a Unidade de Destino
            await SendEmailWithPDF(taskAtualizada, 'ENTRADA');

            // Envio para a Unidade de Origem
            if (taskAtualizada.saida) {
                await SendEmailWithPDF(taskAtualizada, 'SAIDA');
            }
        }

        return res.status(200).json({ message: `Emails enviados com sucessos!` })
    }
}