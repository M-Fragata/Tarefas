import nodemailer from 'nodemailer'
import { GenerateMemorandoPDF } from "./GenerateMemorandoPDF"

interface Task {
    id: string;
    servidor: string;
    matricula: string;
    entrada: string;
    emailEntrada: string;
    saida: string;
    emailSaida: string;
    cargo: string;
    funcao: string;
    cargaHoraria: string;
    inicio: string;
    expedicao: string;
    tipo: string;
    priority: string;
    status: string;
    description: string;
    createdAt: string;
    user: {
        name: string;
    };
    tasklogs: Array<{
        id: string;
        action: string;
        createdAt: string;
    }>;
}

type TipoEnvio = 'ENTRADA' | 'SAIDA';

export async function SendEmailWithPDF(dados: Task, tipoEnvio: TipoEnvio) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        let attachment: any = []
        let cc: string[] = []
        let destinatario = ""
        let corpoTexto = ""

        const destinatarioTeste = "matheus.moraes@educ.marica.rj.gov.br"

        if (tipoEnvio === 'ENTRADA') {

            const pdfBuffer = await GenerateMemorandoPDF(dados);

            attachment = [{
                filename: `memo_${dados.servidor}.pdf`,
                content: pdfBuffer
            }]

            cc = ["rheducacao@educ.marica.rj.gov.br", "subensino2025@educ.marica.rj.gov.br"]
            destinatario = dados.emailEntrada;
            corpoTexto = `
                <p>Prezados,</p>
                <p>Informamos que encaminhamos o(a) funcionário(a) <strong>${dados.servidor}</strong>, 
                matrícula: <strong>${dados.matricula}</strong>, para atuar nesta unidade escolar 
                exercendo a função de <strong>${dados.funcao}</strong> a partir do dia <strong>${dados.inicio}</strong>.</p>
                <p><strong>OBS.:</strong> Segue o memorando em anexo.</p>
            `;
        } else {
            destinatario = dados.emailSaida;
            corpoTexto = `
                <p>Prezados,</p>
                <p>Informamos que o(a) funcionário(a) <strong>${dados.servidor}</strong>, 
                matrícula: <strong>${dados.matricula}</strong>, <strong>NÃO</strong> faz mais parte do 
                quadro de funcionários desta unidade escolar a partir de <strong>${dados.inicio}</strong>.</p>
            `;
        }

        return await transporter.sendMail({
            from: `"Movimentação Institucional" <${process.env.EMAIL_USER}>`,
            to: destinatarioTeste,
            //cc: cc,
            subject: `Movimentação: ${dados.servidor}`,
            html: corpoTexto,
            attachments: attachment
        })

    } catch (error) {
        console.error("Erro no sendMailWithPdf:", error);
        throw error;
    }
}