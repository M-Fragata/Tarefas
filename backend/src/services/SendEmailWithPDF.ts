import nodemailer from 'nodemailer'
import { GenerateMemorandoPDF } from "./GenerateMemorandoPDF"
import { Task } from "../types/Task";

type TipoEnvio = 'ENTRADA' | 'SAIDA';

export async function SendEmailWithPDF(dados: Task, tipoEnvio: TipoEnvio) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_PROD_USER,
                pass: process.env.EMAIL_PROD_PASS
            }
        })

        let attachment: any = []
        let cc: string[] = []
        let destinatario = ""
        let corpoTexto = ""

        //const destinatarioTeste = "matheus.moraes@educ.marica.rj.gov.br"

        if (tipoEnvio === 'ENTRADA') {

            const pdfBuffer = await GenerateMemorandoPDF(dados);

            attachment = [{
                filename: `${dados.isMemorando ? `Memorando_` : `Encaminhamento_`}${dados.servidor}.pdf`,
                content: pdfBuffer
            }]
            cc = dados.copiaPara? dados.copiaPara : []
            destinatario = dados.emailEntrada;
            corpoTexto = `${dados.isMemorando ? `
            <p>Prezados,</p>
                <p>Informamos que encaminhamos o(a) funcionário(a) <strong>${dados.servidor}</strong>, 
                matrícula: <strong>${dados.matricula}</strong>, para atuar nesta unidade escolar 
                exercendo a função de <strong>${dados.funcao}</strong> a partir do dia <strong>${dados.inicio}</strong>.</p>
                <p><strong>OBS.:</strong> Segue o memorando em anexo.</p>
            ` : `
            <p>Prezados,</p>
                <p>Informamos que o(a) funcionário(a) <strong>${dados.servidor}</strong>, 
                matrícula: <strong>${dados.matricula}</strong>, passará a atuar nesta unidade escolar 
                com carga horária de <strong>${dados.cargaHoraria}</strong> a partir do dia <strong>${dados.inicio}</strong>.</p>
                <p><strong>OBS.:</strong> Segue o encaminhamento em anexo.</p>
            `}
                
            `;
        } else {
            if (!dados.emailSaida) return
            
            if (!dados.isTotal) {
                const pdfBuffer = await GenerateMemorandoPDF(dados);

                attachment = [{
                    filename: `Encaminhamento_ ${dados.servidor}.pdf`,
                    content: pdfBuffer
                }]
                cc = dados.copiaPara? dados.copiaPara : []
                destinatario = dados.emailSaida;
                corpoTexto = `
                <p>Prezados,</p>
                    <p>Informamos que o(a) funcionário(a) <strong>${dados.servidor}</strong>, 
                    matrícula: <strong>${dados.matricula}</strong>, passará a atuar nesta unidade escolar 
                    com carga horária de <strong>${dados.cargaHoraria}</strong> a partir do dia <strong>${dados.inicio}</strong>.</p>
                    <p><strong>OBS.:</strong> Segue o encaminhamento em anexo.</p>`;
            }
            else if (dados.isTotal) {
                destinatario = dados.emailSaida;
                corpoTexto = `
                    <p>Prezados,</p>
                    <p>Informamos que o(a) funcionário(a) <strong>${dados.servidor}</strong>, 
                    matrícula: <strong>${dados.matricula}</strong>, <strong>NÃO</strong> faz mais parte do 
                    quadro de funcionários desta unidade escolar a partir de <strong>${dados.inicio}</strong>.</p>
                `;
            } else {
                return
            }
        }

        return await transporter.sendMail({
            from: `"Movimentação Institucional" <${process.env.EMAIL_PROD_USER}>`,
            to: destinatario,
            cc: cc,
            subject: `Movimentação: ${dados.servidor}`,
            html: corpoTexto,
            attachments: attachment
        })

    } catch (error) {
        console.error("Erro no sendMailWithPdf:", error);
        throw error;
    }
}