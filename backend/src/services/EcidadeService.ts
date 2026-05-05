import { chromium } from 'playwright';
import { Task } from '../types/Task';

export async function EcidadeService(dados: Task) {

    const browser = await chromium.launch({ headless: false }); // 'false' para você ver ele trabalhando
    const page = await browser.newPage();

    const usuario = process.env.ECIDADE_USER
    const senha = process.env.ECIDADE_PASSWORD

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
        
        await page.click('.select2-selection__rendered')

        await page.click('.select2-search__field')

        console.log('Login no e-cidade realizado com sucesso!');

    } catch (error) {
        console.error('Erro ao tentar fazer login no e-cidade:', error);
        await browser.close();
    }

}
