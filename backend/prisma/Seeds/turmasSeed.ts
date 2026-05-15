import { prisma } from "../../src/database/prisma"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function tratarTurno(turnoPlanilha: string): "MANHA" | "TARDE" | "NOITE" | "INTEGRAL" {
  const t = (turnoPlanilha || "").toUpperCase().trim();
  if (t.includes("MANHÃ") || t.includes("MANHA")) return "MANHA";
  if (t.includes("TARDE")) return "TARDE";
  if (t.includes("INTEGRAL")) return "INTEGRAL";
  if (t.includes("NOITE")) return "NOITE";
  return "MANHA";
}

async function main() {
  // 1. Caminho corrigido (Pasta 'data' dentro de 'prisma')
  // 2. Nome corrigido (com o espaço: 'planilha turmas.csv')
  const csvFilePath = path.resolve(__dirname, '../data/planilhaturmas.csv');

  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ Arquivo não encontrado em: ${csvFilePath}`);
    return;
  }

  const parser = fs.createReadStream(csvFilePath).pipe(
    parse({
      delimiter: ';',     // Garante o uso do ponto e vírgula
      columns: true,      // Usa a primeira linha como chaves do objeto
      skip_empty_lines: true,
      trim: true,         // Remove espaços em branco extras
      bom: true           // CRITICAL: Remove o caractere invisível do Excel no início do arquivo
    })
  );

  console.log("🚀 Iniciando importação...");
  let contador = 0;

  for await (const linha of parser) {
    // Pegando os nomes exatos das colunas do seu arquivo
    const nomeEscola = linha['escola'];
    const codTurmaEcidade = Number(linha['Cod_turma']);

    // Se o nomeEscola vier vazio, vamos logar para entender o erro
    if (!nomeEscola || isNaN(codTurmaEcidade)) {
      console.log("⚠️ Linha ignorada por falta de dados:", linha);
      continue;
    }

    try {
      const escola = await prisma.escola.upsert({
        where: { nome: nomeEscola },
        update: {},
        create: { nome: nomeEscola },
      });

      await prisma.turma.upsert({
        where: { idEcidade: codTurmaEcidade },
        update: {
          codigoTurma: String(linha['Turma']),
          turno: tratarTurno(linha['Turno']),
          escolaId: escola.id,
        },
        create: {
          idEcidade: codTurmaEcidade,
          codigoTurma: String(linha['Turma']),
          turno: tratarTurno(linha['Turno']),
          escolaId: escola.id,
        },
      });

      contador++;
      console.log(`✅ [${contador}] Turma ${linha['Turma']} (${nomeEscola}) importada.`);
    } catch (error) {
      console.error(`❌ Erro ao inserir turma ${linha['Turma']}:`, error);
    }
  }

  console.log(`✨ Seed finalizado! ${contador} turmas processadas.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });