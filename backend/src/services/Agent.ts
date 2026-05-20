import { Page, Frame } from 'playwright'

interface horario {
    funcao: string;
    turno: string;
    tipoHora: string;
    dataInicio: string;
    dataFim: string;
}

export const Get = {

    Frame: async (page: Page, selector: string): Promise<Frame> => {
        const timeout = 30000;
        const start = Date.now();

        while (Date.now() - start < timeout) {
            // 1. Tenta no frame principal
            const mainCount = await page.locator(selector).count().catch(() => 0);
            if (mainCount > 0) return page.mainFrame();

            // 2. Percorre todos os frames
            const allFrames = page.frames();
            for (const frame of allFrames) {
                try {
                    const count = await frame.locator(selector).count();
                    if (count > 0) {
                        return frame;
                    }
                } catch (err) {
                    continue; // Pula se o frame estiver inacessível
                }
            }

            // 3. Aguarda 1 segundo antes da próxima tentativa
            await page.waitForTimeout(1000);
        }

        throw new Error(`❌ Erro: O seletor "${selector}" não apareceu em nenhum frame após 30s.`);
    },

    Horario: async (frame: Frame, selector: string) => {
        // Seleciona todas as linhas da grid de atividades

        const timeout = 30000;
        const start = Date.now();

        while (Date.now() - start < timeout) {

            const rows = await frame.locator(`${selector} tr`).all();
            const data = [];

            for (const row of rows) {
                // Pegamos todas as células daquela linha
                const cells = await row.locator('td.linhagrid').allTextContents();

                if (cells.length > 0) {
                    // Limpeza de strings para remover &nbsp; (\u00a0) e espaços comuns
                    const limparTexto = (txt: string) => txt.replace(/\u00a0/g, ' ').trim();

                    data.push({
                        funcao: limparTexto(cells[0]),
                        turno: limparTexto(cells[1]),
                        tipoHora: limparTexto(cells[2]), // Onde aparece "HORA EXTRA"
                        dataInicio: limparTexto(cells[4]),
                        dataFim: limparTexto(cells[5])    // Onde deve estar vazio ou com data
                    });
                }
            }

            return data;
        }
    },

    HoraExtra: async (data: any) => {

        return data.some((d: horario) => {
            // Limpeza básica para garantir que espaços vazios do e-Cidade não passem
            const tipoCerto = d.tipoHora?.toUpperCase() === "HORA EXTRA";
            const semDataFim = !d.dataFim || d.dataFim.trim() === "" || d.dataFim === "\u00a0";

            return tipoCerto && semDataFim;
        });

    },

    EncontrarEscola: async (frame: Frame, nomeEscolaAlvo: string) => {
        let escolaProcurada = "";

        if (nomeEscolaAlvo === "JIM JANELINHA DO SABER") {
            escolaProcurada = "JARDIM DE INFÂNCIA MUNICIPAL PROFESSORA ENILZEA SABINO DA COSTA PIRES";
        } else if (nomeEscolaAlvo === "EM ANÍSIO TEIXEIRA") {
            escolaProcurada = "CEPT Leonel de Moura Brizola";
        } else {
            escolaProcurada = nomeEscolaAlvo;
        }

        const normalizar = (t: string) => t
            .replace(/[\r\n\t]/g, ' ')
            .replace(/\u00a0/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toUpperCase();

        const alvoFormatado = normalizar(escolaProcurada);

        const rows = await frame.locator('tr').filter({ has: frame.locator('td.corpo') }).all();

        console.log(`🔎 Iniciando busca e clique por: "${alvoFormatado}"`);

        for (const row of rows) {
            const cells = await row.locator('td.corpo').all();

            // Garante que a linha possui pelo menos as 5 colunas (índices 0 a 4)
            if (cells.length >= 5) {
                const nomeRaw = await cells[0].textContent();
                const dataFimRaw = await cells[3].textContent();

                if (nomeRaw) {
                    const nomeLimpo = normalizar(nomeRaw);
                    const dataFimLimpa = dataFimRaw ? normalizar(dataFimRaw) : "";

                    // Verifica se o nome bate e se a Data Fim está vazia
                    if (nomeLimpo.includes(alvoFormatado) && dataFimLimpa === "") {
                        console.log(`🎯 Registro ativo encontrado para: "${nomeLimpo}"`);

                        // Localiza o primeiro link de alteração dentro do quinto TD (índice 4)
                        const botaoAlterar = cells[4].locator('a[title="ALTERAR CONTEÚDO DA LINHA"]').first();

                        console.log(`🖱️ Clicando no botão de alteração...`);
                        await botaoAlterar.click();

                        // Retorna a linha que sofreu a ação caso precise dela nos próximos passos
                        return [row];
                    }
                }
            }
        }

        console.log(`❌ Nenhuma escola ativa correspondente foi encontrada.`);
        return [];
    },

    FormatarSaida: (data: string) => {
        // Exemplo se dados.entrada for "20/05/2026"
        const [dia, mes, ano] = data.split('/').map(Number);

        // O mês no objeto Date do JS começa em 0 (Janeiro = 0, Maio = 4)
        const dataObjeto = new Date(ano, mes - 1, dia);

        // Subtrai 1 dia
        dataObjeto.setDate(dataObjeto.getDate() - 1);

        // Formata de volta para DD/MM/YYYY com preenchimento de zeros à esquerda (padStart)
        const diaSaida = String(dataObjeto.getDate()).padStart(2, '0');
        const mesSaida = String(dataObjeto.getMonth() + 1).padStart(2, '0');
        const anoSaida = dataObjeto.getFullYear();

        const dataSaida = `${diaSaida}/${mesSaida}/${anoSaida}`;
        return dataSaida;
    }

}