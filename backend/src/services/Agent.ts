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

    EncontrarEscola: async (page: Page, nomeEscolaAlvo: string) => {

        const frame = await Get.Frame(page, 'td.corpo')

        let escolaProcurada = "";

        if (nomeEscolaAlvo === "JIM JANELINHA DO SABER") {
            escolaProcurada = "JARDIM DE INFÂNCIA MUNICIPAL PROFESSORA ENILZEA SABINO DA COSTA PIRES";
        } else if (nomeEscolaAlvo === "EM ANÍSIO TEIXEIRA") {
            escolaProcurada = "CEPT Leonel de Moura Brizola";
        } else if (nomeEscolaAlvo === "SEC MUNICIPAL DE EDUCACAO") {
            escolaProcurada = "SECRETARIA DE EDUCACAO";
        }
        else {
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
                    if (nomeLimpo.includes(alvoFormatado)) {

                        if (!dataFimLimpa) {

                            // Localiza o primeiro link de alteração dentro do quinto TD (índice 4)
                            const botaoAlterar = cells[4].locator('a[title="ALTERAR CONTEÚDO DA LINHA"]').first();

                            await botaoAlterar.click();

                            // Retorna a linha que sofreu a ação caso precise dela nos próximos passos
                            return [row];
                        } else {
                            console.log(`ℹ️ Linha de "${nomeLimpo}" ignorada pois já possui data fim: ${dataFimLimpa}`)
                        }
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

        const dataSaida = `${diaSaida}${mesSaida}${anoSaida}`;
        return dataSaida;
    },

    FormatarEntrada: (data: string) => {
        // Exemplo se dados.entrada for "20/05/2026"
        const [dia, mes, ano] = data.split('/').map(Number);

        // O mês no objeto Date do JS começa em 0 (Janeiro = 0, Maio = 4)
        const dataObjeto = new Date(ano, mes, dia);

        // Subtrai 1 dia
        dataObjeto.setDate(dataObjeto.getDate());

        // Formata de volta para DD/MM/YYYY com preenchimento de zeros à esquerda (padStart)
        const diaEntrada = String(dataObjeto.getDate()).padStart(2, '0');
        const mesEntrada = String(dataObjeto.getMonth() + 1).padStart(2, '0');
        const anoEntrada = dataObjeto.getFullYear();

        const dataEntrada = `${diaEntrada}${mesEntrada}${anoEntrada}`;
        return dataEntrada;
    },

    AcessScholl: async (page: Page, nomeEscolaAlvo: string) => {
        await page.click('div[title="Configurações da Janela"]')

        // 3. Pequena pausa para garantir que os scripts do Select2 foram anexados ao DOM
        await page.waitForTimeout(500);

        await page.keyboard.press('Tab')
        await page.keyboard.press('Space');

        await page.waitForTimeout(500);

        nomeEscolaAlvo?.split("").map(async (e) => {
            await page.keyboard.press(e)
        })

        console.log(nomeEscolaAlvo)

        await page.keyboard.press('Enter')

        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Space');
    },

    FormatSchollName: async (nomeEscolaAlvo: string) => {
        if (nomeEscolaAlvo === "JIM PROFESSORA ENILZEA SABINO DA COSTA PIRES") {
            return "JIM JANELINHA DO SABER"
        } else if (nomeEscolaAlvo === "CEPT Leonel de Moura Brizola") {
            return "EM ANÍSIO TEIXEIRA"
        } else if (nomeEscolaAlvo === "Secretaria de Educação") {
            return "SEC MUNICIPAL DE EDUCACAO"
        }
        else {
            return nomeEscolaAlvo
        }
    },

    InsertMatricula: async (page: Page, matricula: string) => {

        // 1. Localiza o frame e clica no botão principal de pesquisar
        const frameBotao = await Get.Frame(page, 'input#pesquisar');
        const botao = frameBotao.locator('input#pesquisar');
        await botao.click();

        // 2. Localiza o frame do campo de matrícula e preenche o valor
        const frameMatricula = await Get.Frame(page, 'input#chave_ed284_i_rhpessoal');
        await frameMatricula.fill('input#chave_ed284_i_rhpessoal', matricula);

        // 3. Localiza e clica no botão interno de pesquisar (pesquisar2)
        const pesquisarInterno = frameMatricula.locator('input#pesquisar2');
        await pesquisarInterno.click();
    },

    AcessEscolas: async (page: Page) => {
        const frameEscolas = await Get.Frame(page, 'input[name="a8"]')
        const botaoEscolas = frameEscolas.locator('input[name="a8"]')
        await botaoEscolas.click()
    },
    AcessFuncaoExercida: async (page: Page) => {
        const frameFuncaoExercida = await Get.Frame(page, 'input[name="a4"]')
        const botaoFuncaoExercida = frameFuncaoExercida.locator('input[name="a4"]')
        await botaoFuncaoExercida.click()
    },

    InsertNewDataIngress: async (page: Page, data: any) => {

        const entrada = Get.FormatarEntrada(data)

        const dataIngressoFrame = await Get.Frame(page, 'input#ed75_d_ingresso')
        const dataIngressoInput = dataIngressoFrame.locator('input#ed75_d_ingresso')
        await dataIngressoInput.click()
        await dataIngressoInput.pressSequentially(entrada, { delay: 150 })


        await page.waitForTimeout(2000);
        await page.keyboard.press('Enter')

    }

}