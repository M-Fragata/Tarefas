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
        console.log(nomeEscolaAlvo)
        if (nomeEscolaAlvo === "JIM JANELINHA DO SABER") {
            escolaProcurada = "JARDIM DE INFÂNCIA MUNICIPAL PROFESSORA ENILZEA SABINO DA COSTA PIRES";
        } else if (nomeEscolaAlvo === "EM ANÍSIO TEIXEIRA") {
            escolaProcurada = "CEPT Leonel de Moura Brizola";
        } else {
            escolaProcurada = nomeEscolaAlvo;
        }

        // Normaliza o alvo: remove &nbsp;, múltiplos espaços e coloca em UpperCase
        const normalizar = (t: string) => t.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase();
        const alvoFormatado = normalizar(escolaProcurada);

        // 1. Tenta buscar todas as linhas que tenham a classe corpo em qualquer nível
        const rows = await frame.locator('tr').filter({ has: frame.locator('td.corpo') }).all();
        const resultados = [];

        console.log(`🔎 Iniciando busca por: "${alvoFormatado}" em ${rows.length} linhas.`);

        for (const row of rows) {
            const tdNome = row.locator('td.corpo').first();
            const nomeRaw = await tdNome.textContent();

            if (nomeRaw) {
                const nomeLimpo = normalizar(nomeRaw);

                // Log de debug para você ver o que o robô está lendo no e-Cidade
                if (nomeLimpo.includes(alvoFormatado.substring(0, 10))) {
                    console.log(`❓ Quase bateu: Sistema["${nomeLimpo}"] vs Alvo["${alvoFormatado}"]`);
                }

                if (nomeLimpo === alvoFormatado) {
                    resultados.push(row);
                }
            }
        }

        return resultados;
    }

}