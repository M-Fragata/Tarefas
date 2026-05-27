import { chromium } from 'playwright';
import { Task } from '../types/Task';
import { Get, Skill } from "./Agent"
import { Brain } from "./GeminiService" // Importa o Cérebro da IA

export async function EcidadeService(dados: Task) {

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    const usuario = process.env.ECIDADE_USER
    const senha = process.env.ECIDADE_PASSWORD

    const schoolSaida = await Get.FormatSchollName(dados.saida!)
    const schoolEntrada = await Get.FormatSchollName(dados.entrada!)

    try {
        await page.goto('https://ecidade.marica.rj.gov.br/e-cidade/login.php');
        await page.fill('input[name="login"]', usuario!);
        await page.fill('input[name="senha"]', senha!);
        await page.click('#btnlogar');

    
        // -------------------------------------------------------------
        // ETAPA 1: ESCOLA DE SAÍDA
        await Skill.saidaDeUnidade(page, dados, schoolSaida, browser)

        // -------------------------------------------------------------
        // ETAPA 2: ESCOLA DE ENTRADA
        await Skill.entradaDeUnidade(page, schoolEntrada, dados)

        console.log("🚀 Movimentação do servidor concluída com absoluto sucesso!");

    } catch (error) {
        console.error('❌ Erro crítico no fluxo de execução:', error);
        await browser.close();
    }
}