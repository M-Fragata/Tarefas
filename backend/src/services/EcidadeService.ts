import { chromium } from 'playwright';
import { Task } from '../types/Task';
import { Get } from "./Agent"

export async function EcidadeService(dados: Task) {

    const browser = await chromium.launch({ headless: false }); // 'false' para você ver ele trabalhando
    const page = await browser.newPage();

    const usuario = process.env.ECIDADE_USER
    const senha = process.env.ECIDADE_PASSWORD


    const escolaSaida = await Get.FormatSchollName(dados.saida!)
    const escolaEntrada = await Get.FormatSchollName(dados.entrada!)


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

        await Get.AcessScholl(page, escolaSaida)

        await page.waitForTimeout(1000);

        await Get.InsertMatricula(page, dados.matricula.toString())

        const frameFuncaoExercida = await Get.Frame(page, 'input[name="a4"]')
        const botaoFuncaoExercida = frameFuncaoExercida.locator('input[name="a4"]')
        await page.waitForTimeout(500)
        await botaoFuncaoExercida.click()

        const frameGrid = await Get.Frame(page, 'table#gridAtividadeProfissionalbody');
        const atividades = await Get.Horario(frameGrid, 'table#gridAtividadeProfissionalbody');

        const bloqueado = await Get.HoraExtra(atividades)

        if (bloqueado === true) return

        await Get.AcessEscolas(page) //Acessa a tela de escolas do E-cidade

        const saida = await Get.EncontrarEscola(page, escolaSaida)

        //----------
        if (saida.length > 0) {
            console.log("Passou aqui")
            const frameDataSaida = await Get.Frame(page, 'input[name="ed75_i_saidaescola"]')

            const dataSaida = Get.FormatarSaida(dados.inicio)

            await frameDataSaida.locator('input[name="ed75_i_saidaescola"]').click()
            await frameDataSaida.locator('input[name="ed75_i_saidaescola"]').pressSequentially(dataSaida, { delay: 150 })

            await page.waitForTimeout(2000);

            await page.keyboard.press('Enter')
        }

        await page.waitForTimeout(2000);

        await Get.AcessScholl(page, escolaEntrada)

        await page.waitForTimeout(4000);

        await Get.InsertMatricula(page, dados.matricula.toString())
        await Get.AcessEscolas(page)

        const entrada = await Get.EncontrarEscola(page, escolaEntrada)

console.log(entrada.length)

        if (entrada.length == 0) {
            await Get.InsertNewDataIngress(page, dados.inicio)
            await Get.AcessFuncaoExercida(page)
        } else {
            await Get.AcessFuncaoExercida(page)
        }

    } catch (error) {
        console.error('Erro ao tentar fazer login no e-cidade:', error);
        await browser.close();
    }

}
