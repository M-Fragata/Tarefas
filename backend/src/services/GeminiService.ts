import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa a API do Gemini com a sua chave de ambiente
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const Brain = {

    analisarHistoricoMovimentacao: async (
        historicoGrid: any[],
        tarefa: any
    ): Promise<{
        podeProsseguir: boolean;
        motivo: string;
        dataSaidaSugerida?: string;
    }> => {
        try {
            console.log("🧠 Solicitando análise de regras de negócio ao Gemini-3.5-Flash...");

            const prompt = `
            Você é o módulo de inteligência de um robô de automação de recursos humanos para o sistema municipal e-Cidade.
            Sua tarefa é analisar o histórico de atividades profissionais de um servidor e determinar se ele está elegível para uma nova movimentação (saída de uma escola e entrada em outra).

            Dados da Solicitação Atual:
            - Escola de Saída Solicitada: ${tarefa.saida}
            - Escola de Entrada Solicitada: ${tarefa.entrada}
            - Data de Início da Nova Alocação: ${tarefa.inicio}

            Histórico Atual do Servidor no e-Cidade (Extraído da Grid):
            ${JSON.stringify(historicoGrid, null, 2)}

            Regras de Negócio Importantes:
            1. Se houver alguma linha com tipoHora "HORA EXTRA" e a "dataFim" estiver vazia (ou em branco), o servidor está BLOQUEADO para movimentação automática até que o setor de RH encerre a hora extra manualmente.
            2. Verifique se o servidor já possui uma "dataFim" preenchida para a escola de saída solicitada. Se já possuir, significa que a saída já foi processada anteriormente.

            Responda EXCLUSIVAMENTE em formato JSON com a seguinte estrutura:
            {
                "podeProsseguir": true ou false,
                "motivo": "Texto explicando detalhadamente a decisão tomada",
                "dataSaidaSugerida": "DD/MM/YYYY" (se aplicável, sugira a data de saída baseada nas regras)
            }
            `;

            // Configura o modelo correto da nova geração
            const model = genAI.getGenerativeModel({
                model: "gemini-3.5-flash",
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            if (!responseText) {
                throw new Error("O modelo retornou uma string vazia.");
            }

            // Converte a string JSON purificada da IA de volta para um objeto válido no TypeScript
            const dadosAnalise = JSON.parse(responseText);
            return dadosAnalise;

        } catch (error) {
            console.error("❌ Erro na análise do cérebro (Gemini):", error);

            // Retorno de Fallback de segurança para não deixar seu EcidadeService quebrar
            return {
                podeProsseguir: false,
                motivo: "Erro interno de comunicação com o cérebro da IA. Movimentação abortada por segurança."
            };
        }
    },

    veririfyProfessorExistInSchool: async (screenshotBuffer: Buffer): Promise<boolean> => {
        try {
            console.log("👁️ [CÉREBRO] Analisando imagem da tela de busca com Gemini Vision...");

            // Converte o Buffer do print do Playwright para o formato que a API do Gemini espera
            const imagemPart = {
                inlineData: {
                    data: screenshotBuffer.toString("base64"),
                    mimeType: "image/png"
                },
            };

            const prompt = `
            Você é o sistema de visão computacional de um robô de automação do e-Cidade.
            Analise o print anexado da janela "Pesquisa de Recursos Humanos da Escola".

            Sua única tarefa é verificar se o texto "Nenhum Registro Retornado" aparece escrito na tela (geralmente ao lado dos botões Início/Anterior/Próximo/Último).

            Responda EXCLUSIVAMENTE um JSON com a estrutura abaixo:
            {
                "erroDetectado": true (se a mensagem "Nenhum Registro Retornado" estiver visível) ou false (se a mensagem NÃO estiver na tela)
            }
            `;

            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });

            // Passamos o prompt de texto e a imagem juntos
            const result = await model.generateContent([prompt, imagemPart]);
            const responseText = result.response.text();

            if (!responseText) throw new Error("Resposta vazia da API de Visão.");

console.log(responseText)

            const resultadoJson = JSON.parse(responseText);
            return resultadoJson.erroDetectado;

        } catch (error) {
            console.error("❌ Erro na análise de visão do Gemini:", error);
            // Fallback de segurança: assume que deu erro para evitar duplicar registros indevidamente
            return false;
        }
    }
};