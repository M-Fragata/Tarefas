import { chromium } from 'playwright';
import { Task } from '../types/Task';
import { Get } from "./Agent"

export async function EcidadeService(dados: Task) {

    const browser = await chromium.launch({ headless: false }); // 'false' para você ver ele trabalhando
    const page = await browser.newPage();

    const usuario = process.env.ECIDADE_USER
    const senha = process.env.ECIDADE_PASSWORD

    let escola = ""

    if (dados.saida === "JIM PROFESSORA ENILZEA SABINO DA COSTA PIRES") {
        escola = "JIM JANELINHA DO SABER"
    } else if (dados.saida === "CEPT Leonel de Moura Brizola") {
        escola = "EM ANÍSIO TEIXEIRA"
    } else {
        escola = dados.saida!
    }

    try {
        await page.goto('https://ecidade.marica.rj.gov.br/e-cidade/login.php');

        await page.fill('input[name="login"]', usuario!);

        await page.fill('input[name="senha"]', senha!);

        await page.click('#btnlogar');

        await page.click('.taskbar-menu-button')

        await page.click('.area_8')

        await page.click('.modulo_1100747')

        await page.click('#menu_id_3470')

        await page.click('#menu_id_1100881')

        await page.click('#menu_id_1100883')

        await page.click('div[title="Configurações da Janela"]')

        // 3. Pequena pausa para garantir que os scripts do Select2 foram anexados ao DOM
        await page.waitForTimeout(500);

        await page.keyboard.press('Tab')
        await page.keyboard.press('Space');

        await page.waitForTimeout(500);

        escola?.split("").map(async (e) => {
            await page.keyboard.press(e)
        })

        await page.keyboard.press('Enter')

        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Space');

        //erro aqui, tentando pesquisar
        await page.waitForTimeout(1000);

        const frameBotao = await Get.Frame(page, 'input#pesquisar')
        const botao = frameBotao.locator('input#pesquisar');
        await botao.click();

        const frameMatricula = await Get.Frame(page, 'input#chave_ed284_i_rhpessoal')
        await frameMatricula.fill('input#chave_ed284_i_rhpessoal', (dados.matricula).toString())

        const pesquisar = frameMatricula.locator('input#pesquisar2')
        await pesquisar.click()

        const frameFuncaoExercida = await Get.Frame(page, 'input[name="a4"]')
        const botaoFuncaoExercida = frameFuncaoExercida.locator('input[name="a4"]')
        await botaoFuncaoExercida.click()

        //--------------------
        const frameGrid = await Get.Frame(page, 'table#gridAtividadeProfissionalbody');
        const atividades = await Get.Horario(frameGrid, 'table#gridAtividadeProfissionalbody');

        const bloqueado = await Get.HoraExtra(atividades)

        if(bloqueado === true) return

        const frameEscolas = await Get.Frame(page, 'input[name="a8"]')
        const botaoEscolas = frameEscolas.locator('input[name="a8"]')
        await botaoEscolas.click()

        const frameEscola = await Get.Frame(page, 'td.corpo')
        const linhaEscola = await Get.EncontrarEscola(frameEscola, escola)

        console.log(linhaEscola)


    } catch (error) {
        console.error('Erro ao tentar fazer login no e-cidade:', error);
        await browser.close();
    }

}
