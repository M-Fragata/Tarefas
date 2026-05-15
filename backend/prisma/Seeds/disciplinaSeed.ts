import { prisma } from "../../src/database/prisma"

const disciplinasData = [
    { sigla: "LPORT", nomeCompleto: "Língua Portuguesa", corHex: "#FFADAD" },
    { sigla: "PT", nomeCompleto: "Produção Textual", corHex: "#FFADAD" },
    { sigla: "MAT", nomeCompleto: "Matemática", corHex: "#A0C4FF" },
    { sigla: "GEOM", nomeCompleto: "Geometria", corHex: "#A0C4FF" },
    { sigla: "CIEN", nomeCompleto: "Ciências", corHex: "#CAFFBF" },
    { sigla: "HIST", nomeCompleto: "História", corHex: "#FFD6A5" },
    { sigla: "GEOG", nomeCompleto: "Geografia", corHex: "#FDFFB6" },
    { sigla: "ART", nomeCompleto: "Artes", corHex: "#FFC6FF" },
    { sigla: "EDF", nomeCompleto: "Educação Física", corHex: "#9BF6FF" },
    { sigla: "ING", nomeCompleto: "Inglês", corHex: "#BDB2FF" },
    { sigla: "DOCII", nomeCompleto: "Docente II", corHex: "#3e82f0" },
];

async function main() {
    console.log("🚀 Iniciando criação de Disciplinas...");

    for (const d of disciplinasData) {
        await prisma.disciplina.upsert({
            where: { sigla: d.sigla },
            update: {
                nomeCompleto: d.nomeCompleto,
                corHex: d.corHex
            },
            create: {
                sigla: d.sigla,
                nomeCompleto: d.nomeCompleto,
                corHex: d.corHex
            },
        });
        console.log(`✅ Disciplina ${d.sigla} criada.`);
    }

    console.log("✨ Todas as disciplinas foram configuradas!");
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });