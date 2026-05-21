import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa a API do Gemini com a sua chave de ambiente
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const Brain = {
    /**
     * Analisa o histórico de atividades extraído da grid e decide se a movimentação pode prosseguir.
     */
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
    }
};