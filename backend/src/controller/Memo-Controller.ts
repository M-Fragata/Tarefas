import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai"
import funcionarios from '../database/funcionarios.json';
import configBase from '../database/configBase.json';

import { prisma } from "../database/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class MemoController {
    async generateTasks(req: Request, res: Response) {
        try {
            const { userMessage } = req.body;

            const prompt = `
                Aja como um assistente de MOVIMENTAÇÃO da Secretaria de Educação de Maricá. 
                Analise o seguinte texto de e-mail e extraia TODOS os pedidos de movimentação:
                "${userMessage}"

                DIRETRIZES DE CRUZAMENTO:
                - Matrícula: Se não informada, use ${JSON.stringify(funcionarios)} para buscar pelo nome completo.
                - Unidades/Emails: Use ${JSON.stringify(configBase.unidades)} para encontrar os nomes oficiais e e-mails.
                - Cargos/Funções: Selecione apenas de ${configBase.cargos} e ${configBase.funcoes}.

                Retorne um JSON seguindo este contrato:
                {
                    "servidores": [
                        {
                            "servidor": "NOME COMPLETO",
                            "matricula": "MATRICULA",
                            "saida": "UNIDADE DE ORIGEM",
                            "emailSaida": "EMAIL DA UNIDADE DE SAIDA",
                            "entrada": "UNIDADE DE DESTINO",
                            "emailEntrada": "EMAIL DA UNIDADE DE DESTINO",
                            "cargo": "CARGO",
                            "funcao": "FUNÇÃO",
                            "cargaHoraria": "ex: 40 HORAS SEMANAIS",
                            "inicio": "DATA DE INICIO",
                            "expedicao": "${new Date().toLocaleDateString('pt-BR')}"
                        }
                    ]
                }
            `;

            const model = genAI.getGenerativeModel({
                model: "gemini-3-flash-preview",
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });

            // 2. Chamada simplificada
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            const { servidores } = JSON.parse(responseText)

            if (!servidores) return res.status(400).json({ error: "Falha na estrutura do JSON retornado." });

            const tasks = await prisma.task.createMany({
                data: servidores.map((servidor: any) => ({
                    servidor: servidor.servidor,
                    matricula: parseInt(servidor.matricula, 10),
                    entrada: servidor.entrada,
                    emailEntrada: servidor.emailEntrada,
                    saida: servidor.saida,
                    emailSaida: servidor.emailSaida,
                    cargo: servidor.cargo,
                    funcao: servidor.funcao,
                    cargaHoraria: servidor.cargaHoraria,
                    inicio: servidor.inicio,
                    expedicao: servidor.expedicao,

                    // Campos de controle do sistema
                    tipo: "Movimentacao",
                    priority: "Media",
                    status: "Pendente",
                    enviado: false, // Novo campo do schema
                    description: `Movimentação de ${servidor.saida} para ${servidor.entrada}. Início em ${servidor.inicio}.`,
                }))
            });

            return res.status(201).json({
                message: `${tasks.count} movimentações processadas com sucesso!`,
                data: servidores
            })

        } catch (error) {
            console.error("Erro no processamento da IA:", error);
            return res.status(500).json({ error: "Erro interno ao processar rascunhos." });
        }
    }
}