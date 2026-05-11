import { chromium } from 'playwright';
import { Task } from '../types/Task';
import { Locator } from 'puppeteer';

export async function EcidadeService(dados: Task) {

    const browser = await chromium.launch({ headless: false }); // 'false' para você ver ele trabalhando
    const page = await browser.newPage();

    const usuario = process.env.ECIDADE_USER
    const senha = process.env.ECIDADE_PASSWORD

    const escola = dados.saida

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
        //problema aqui -----------------

        // 3. Pequena pausa para garantir que os scripts do Select2 foram anexados ao DOM
        await page.waitForTimeout(500);

        // 4. Tente o clique agora
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

        // 2. Localiza o frame pelo nome na lista de frames ativos
        const frame = page.frames().find(f => f.name() === 'iframe_a1');

        if (!frame) return console.log('❌ Frame iframe_a1 não encontrado na página')

            const botao = frame.locator('input#pesquisar');
            await botao.dispatchEvent('click');

    } catch (error) {
        console.error('Erro ao tentar fazer login no e-cidade:', error);
        await browser.close();
    }

}
