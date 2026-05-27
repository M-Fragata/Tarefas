import { Page, Frame } from 'playwright'
import { Brain } from "./GeminiService"

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
            const mainCount = await page.locator(selector).count().catch(() => 0);
            if (mainCount > 0) return page.mainFrame();

            const allFrames = page.frames();
            for (const frame of allFrames) {
                try {
                    const count = await frame.locator(selector).count();
                    if (count > 0) return frame;
                } catch (err) {
                    continue;
                }
            }
            await page.waitForTimeout(1000);
        }
        throw new Error(`❌ Erro: O seletor "${selector}" não apareceu em nenhum frame após 30s.`);
    },

    Horario: async (frame: Frame, selector: string) => {
        const timeout = 30000;
        const start = Date.now();

        while (Date.now() - start < timeout) {
            const rows = await frame.locator(`${selector} tr`).all();
            const data = [];

            for (const row of rows) {
    console.log("Rows:", row) //Testando
                const cells = await row.locator('td.linhagrid').allTextContents();
                if (cells.length > 0) {
                    const limparTexto = (txt: string) => txt.replace(/\u00a0/g, ' ').trim();
                    data.push({
                        funcao: limparTexto(cells[0]),
                        turno: limparTexto(cells[1]),
                        tipoHora: limparTexto(cells[2]),
                        dataInicio: limparTexto(cells[4]),
                        dataFim: limparTexto(cells[5])
                    });
                }
            }
            return data;
        }
    },

    AcessAlteracao: async (page: Page) => {

        const menuButton = await Get.Frame(page, '.taskbar-menu-button');
        await menuButton.locator('.taskbar-menu-button').click();

        await page.click('.area_8')
        await page.click('.modulo_1100747')
        await page.click('#menu_id_3470')
        await page.click('#menu_id_1100881')
        await page.click('#menu_id_1100883')

    },
    // SKILL ESPECÍFICA DE SAÍDA: Encontra a escola ativa e clica no botão Alterar
    AlterarEscolaSaida: async (page: Page, nomeEscolaAlvo: string) => {
        console.log(`🔎 [AGENTE] Procurando escola ativa para registrar saída...`);
        const frame = await Get.Frame(page, 'td.corpo');
        const alvoFormatado = Get.NormalizarTexto(Get.TraduzirNomeEscola(nomeEscolaAlvo));

        const rows = await frame.locator('tr').filter({ has: frame.locator('td.corpo') }).all();

        for (const row of rows) {
            const cells = await row.locator('td.corpo').all();
            if (cells.length >= 5) {
                const nomeRaw = await cells[0].textContent();
                const dataFimRaw = await cells[3].textContent();

                if (nomeRaw) {
                    const nomeLimpo = Get.NormalizarTexto(nomeRaw);
                    const dataFimLimpa = dataFimRaw ? Get.NormalizarTexto(dataFimRaw) : "";

                    if (nomeLimpo.includes(alvoFormatado)) {
                        if (!dataFimLimpa) {
                            console.log(`🎯 Registro ativo encontrado. Abrindo alteração para: ${nomeLimpo}`);
                            const botaoAlterar = cells[4].locator('a[title="ALTERAR CONTEÚDO DA LINHA"]').first();
                            await botaoAlterar.click();
                            return [row];
                        } else {
                            console.log(`ℹ️ Linha de "${nomeLimpo}" ignorada (já possui data fim: ${dataFimLimpa})`);
                        }
                    }
                }
            }
        }
        return [];
    },

    AlterarEscolaEntrada: async (page: Page, nomeEscolaAlvo: string, data: any) => {
        const frame = await Get.Frame(page, 'td.corpo');
        const alvoFormatado = Get.NormalizarTexto(Get.TraduzirNomeEscola(nomeEscolaAlvo));

        const rows = await frame.locator('tr').filter({ has: frame.locator('td.corpo') }).all();

        for (const row of rows) {
            const cells = await row.locator('td.corpo').all();
            if (cells.length >= 5) {
                const nomeRaw = await cells[0].textContent();
                const dataEntradaRaw = await cells[1].textContent();
                const dataFimRaw = await cells[3].textContent();

                if (nomeRaw) {
                    const nomeLimpo = Get.NormalizarTexto(nomeRaw);
                    const dataEntradaLimpa = dataEntradaRaw ? Get.NormalizarTexto(dataEntradaRaw) : "";
                    const dataFimLimpa = dataFimRaw ? Get.NormalizarTexto(dataFimRaw) : "";

                    if (dataFimLimpa) continue

                    if (nomeLimpo.includes(alvoFormatado)) {
                        if (dataEntradaLimpa === data) {
                            console.log(`🎯 Registro ativo encontrado. Abrindo alteração para: ${nomeLimpo}`);

                            return [row];
                        } else if (dataEntradaLimpa !== data) {
                            const botaoAlterar = cells[4].locator('a[title="ALTERAR CONTEÚDO DA LINHA"]').first();
                            await botaoAlterar.click();

                            await page.waitForTimeout(1000);

                            const botaoIngresso = await Get.Frame(page, 'input#ed75_d_ingresso');
                            const dataFormatada = Get.FormatarEntrada(data);
                            await botaoIngresso.locator('input#ed75_d_ingresso').click();
                            await botaoIngresso.locator('input#ed75_d_ingresso').pressSequentially(dataFormatada, { delay: 150 });
                            await page.waitForTimeout(2000);
                            await page.keyboard.press('Enter');

                            return [row]
                        }
                    }
                }
            }
        }
        return [];
    },

    // SKILL ESPECÍFICA DE ENTRADA: Apenas checa se ela já existe na listagem atual sem clicar
    ChecarEscolaExistente: async (page: Page, nomeEscolaAlvo: string) => {
        console.log(`🔎 [AGENTE] Verificando se a escola de destino já consta no histórico...`);
        const frame = await Get.Frame(page, 'td.corpo');
        const alvoFormatado = Get.NormalizarTexto(Get.TraduzirNomeEscola(nomeEscolaAlvo));

        const rows = await frame.locator('tr').filter({ has: frame.locator('td.corpo') }).all();
        const resultados = [];

        for (const row of rows) {
            const cells = await row.locator('td.corpo').all();
            if (cells.length >= 5) {
                const nomeRaw = await cells[0].textContent();
                if (nomeRaw) {
                    const nomeLimpo = Get.NormalizarTexto(nomeRaw);
                    if (nomeLimpo.includes(alvoFormatado)) {
                        resultados.push(row);
                    }
                }
            }
        }
        return resultados;
    },

    NormalizarTexto: (t: string) => t
        .replace(/[\r\n\t]/g, ' ')
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase(),

    TraduzirNomeEscola: (nome: string) => {
        if (nome === "JIM JANELINHA DO SABER") return "JARDIM DE INFÂNCIA MUNICIPAL PROFESSORA ENILZEA SABINO DA COSTA PIRES";
        if (nome === "EM ANÍSIO TEIXEIRA") return "CEPT Leonel de Moura Brizola";
        if (nome === "SEC MUNICIPAL DE EDUCACAO") return "SECRETARIA DE EDUCACAO";
        return nome;
    },

    FormatarSaida: (data: string) => {
        const [dia, mes, ano] = data.split('/').map(Number);
        const dataObjeto = new Date(ano, mes - 1, dia);
        dataObjeto.setDate(dataObjeto.getDate() - 1);
        return `${String(dataObjeto.getDate()).padStart(2, '0')}${String(dataObjeto.getMonth() + 1).padStart(2, '0')}${dataObjeto.getFullYear()}`;
    },

    FormatarEntrada: (data: string) => {
        const [dia, mes, ano] = data.split('/').map(Number);
        return `${String(dia).padStart(2, '0')}${String(mes).padStart(2, '0')}${ano}`;
    },

    AcessScholl: async (page: Page, nomeEscolaAlvo: string) => {
        await page.click('div[title="Configurações da Janela"]')
        await page.waitForTimeout(500);
        await page.keyboard.press('Tab')
        await page.keyboard.press('Space');
        await page.waitForTimeout(500);

        for (const char of nomeEscolaAlvo.split("")) {
            await page.keyboard.press(char);
        }

        console.log(`🏫 Selecionando escola no painel de contexto: ${nomeEscolaAlvo}`);
        await page.keyboard.press('Enter')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Space');
    },

    FormatSchollName: async (nomeEscolaAlvo: string) => {
        if (nomeEscolaAlvo === "JIM PROFESSORA ENILZEA SABINO DA COSTA PIRES") return "JIM JANELINHA DO SABER";
        if (nomeEscolaAlvo === "CEPT Leonel de Moura Brizola") return "EM ANÍSIO TEIXEIRA";
        if (nomeEscolaAlvo === "Secretaria de Educação") return "SEC MUNICIPAL DE EDUCACAO";
        return nomeEscolaAlvo;
    },

    InsertMatricula: async (page: Page, matricula: string) => {
        const frameBotao = await Get.Frame(page, 'input#pesquisar');
        await frameBotao.locator('input#pesquisar').click();

        let frameMatricula = await Get.Frame(page, 'input#chave_ed284_i_rhpessoal');
        await frameMatricula.fill('input#chave_ed284_i_rhpessoal', matricula);
        await frameMatricula.locator('input#pesquisar2').click();

        await page.waitForTimeout(1500);

        let nenhumRegistroRetornado = false;

        try {

            const frameForm = frameMatricula.locator('form[name="navega_lovNoMe"]');

            // Verifica se o formulário de fato apareceu na tela
            if (await frameForm.count() > 0) {
                // Pega todo o texto contido dentro do formulário (incluindo nós de texto soltos)
                const textoDoForm = await frameForm.textContent();

                if (textoDoForm && textoDoForm.includes("Nenhum Registro Retornado")) {
                    nenhumRegistroRetornado = true;
                }
            }

        } catch (error) {
            nenhumRegistroRetornado = false;
        }

        if (nenhumRegistroRetornado) {

            await frameBotao.locator('input#fechar').click();

            const novo = await Get.Frame(page, 'input#novo');
            await novo.locator('input#novo').click();

            const select = await Get.Frame(page, 'select#ed20_i_tiposervidor');
            await select.locator('select#ed20_i_tiposervidor').selectOption({ value: '1' });
            await page.waitForTimeout(500);

            const linkMatricula = await Get.Frame(page, 'a.DBAncora');
            await linkMatricula.locator('a.DBAncora').click();

            const matriculaInput = await Get.Frame(page, 'input#chave_ed284_i_rhpessoal');
            await matriculaInput.fill('input#chave_ed284_i_rhpessoal', matricula);
            await matriculaInput.locator('input[name="pesquisar"]').click();

            return
        }

        return
    },

    AcessEscolas: async (page: Page) => {
        const frameEscolas = await Get.Frame(page, 'input[name="a8"]')
        await frameEscolas.locator('input[name="a8"]').click()
    },

    AcessFuncaoExercida: async (page: Page) => {
        console.log("Entrou aqui no funcao exercida")
        const frameFuncaoExercida = await Get.Frame(page, 'input[name="a4"]')
        await frameFuncaoExercida.locator('input[name="a4"]').click()
    },

    InsertNewDataIngress: async (page: Page, data: any) => {
        const entrada = Get.FormatarEntrada(data)
        const dataIngressoFrame = await Get.Frame(page, 'input#ed75_d_ingresso')
        const dataIngressoInput = dataIngressoFrame.locator('input#ed75_d_ingresso')
        await dataIngressoInput.click()
        await dataIngressoInput.pressSequentially(entrada, { delay: 150 })
        await page.waitForTimeout(2000);
        await page.keyboard.press('Enter')
    },
    HoraExtra: async (data: any) => {

        return data.some((d: horario) => {
            // Limpeza básica para garantir que espaços vazios do e-Cidade não passem
            const tipoCerto = d.tipoHora?.toUpperCase() === "HORA EXTRA";
            const semDataFim = !d.dataFim || d.dataFim.trim() === "" || d.dataFim === "\u00a0";

            return tipoCerto && semDataFim;
        });

    },
}

export const Skill = {
    saidaDeUnidade: async (page: Page, dados: any, schoolSaida: string, browser: any) => {
        await Get.AcessAlteracao(page)
        await page.waitForTimeout(1000);

        await Get.AcessScholl(page, schoolSaida)
        await page.waitForTimeout(1000);

        await Get.InsertMatricula(page, dados.matricula.toString())
        await page.waitForTimeout(500)
        await Get.AcessFuncaoExercida(page)

        // Coleta o histórico bruto da grid através do Agente
        const frameGrid = await Get.Frame(page, 'table#gridAtividadeProfissionalbody');
        const atividades = await Get.Horario(frameGrid, 'table#gridAtividadeProfissionalbody');

        console.log("🔍 CONTEÚDO EXTRAÍDO DA GRID:", JSON.stringify(atividades, null, 2));

        const bloqueado = await Get.HoraExtra(atividades)

        if(bloqueado === true) return

        await Get.AcessEscolas(page)
        const registrosSaida = await Get.AlterarEscolaSaida(page, schoolSaida)

        if (registrosSaida.length > 0) {
            const frameDataSaida = await Get.Frame(page, 'input[name="ed75_i_saidaescola"]')
            const dataSaida = Get.FormatarSaida(dados.inicio)

            await frameDataSaida.locator('input[name="ed75_i_saidaescola"]').click()
            await frameDataSaida.locator('input[name="ed75_i_saidaescola"]').pressSequentially(dataSaida, { delay: 150 })
            await page.waitForTimeout(2000);
            await page.keyboard.press('Enter')
        }

        const closeFrame = await Get.Frame(page, 'div[title="Fechar Janela"]')
        const closeButton = closeFrame.locator('div[title="Fechar Janela"]');
        await closeButton.click();
    },

    entradaDeUnidade: async (page: Page, schoolEntrada: string, dados: any) => {
        await page.waitForTimeout(1000);
        await Get.AcessAlteracao(page)

        await Get.AcessScholl(page, schoolEntrada)
        await page.waitForTimeout(1000);

        // Recaptura a matrícula no novo frame renovado do e-Cidade
        await Get.InsertMatricula(page, dados.matricula.toString())
        await Get.AcessEscolas(page)

        // Verifica o histórico na nova escola através da skill dedicada

        const data = await Get.AlterarEscolaEntrada(page, schoolEntrada, dados.inicio)
        console.log(data)
        /*
        const registrosEntrada = await Get.ChecarEscolaExistente(page, schoolEntrada)
        console.log("Registros de entrada:", registrosEntrada)
        if (registrosEntrada.length === 0) {
            console.log("🆕 Vínculo inexistente nesta escola. Cadastrando novo ingresso...");
            await Get.InsertNewDataIngress(page, dados.inicio)
            await Get.AcessFuncaoExercida(page)
        } else {
            console.log("⏭️ Histórico já existente nesta escola. Redirecionando para Função Exercida...");
            await Get.AcessFuncaoExercida(page)
        }*/
    }
}