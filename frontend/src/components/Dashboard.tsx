import { useState, useEffect } from "react"
import { DocenteCard } from "./DocenteCard"

export function Dashboard() {

    const [data, setData] = useState<any>({})
    const [colunasDisciplinas, setColunasDisciplinas] = useState<string[]>([])
    const [totaisGlobais, setTotaisGlobais] = useState({})

    async function handleGetCarencias() {
        try {
            const response = await fetch("http://localhost:3333/carencias", {
                headers: { "Content-type": "application/json" }
            })

            const data = await response.json()

            const organizarPorEscola = (listaCarencias: any[]) => {
                return listaCarencias.reduce((acc, curr) => {
                    const { escolaId, disciplina, escola } = curr;
                    const escolaNome = escola.nome;

                    // Inicializa o objeto da escola se não existir no acumulador
                    if (!acc[escolaId]) {
                        acc[escolaId] = {
                            nome: escolaNome,
                            disciplinas: {},
                            totalGeral: 0
                        };
                    }

                    // Inicializa a disciplina se não existir para esta escola
                    if (!acc[escolaId].disciplinas[disciplina]) {
                        acc[escolaId].disciplinas[disciplina] = 0;
                    }

                    // Incrementa os contadores
                    acc[escolaId].disciplinas[disciplina] += 1;
                    acc[escolaId].totalGeral += 1;

                    return acc;
                }, {});
            };

            const resultado = organizarPorEscola(data);

            // Agora você tem um objeto onde a chave é o ID da escola
            // e o valor são as estatísticas dela
            setData(resultado);
            const disciplinas = [...new Set(data.map((c: any) => c.disciplina))].sort() as string[]

            setColunasDisciplinas(disciplinas)

            const totaisPorDisciplina = data.reduce((acc: any, curr: any) => {
                const { disciplina } = curr;
                acc[disciplina] = (acc[disciplina] || 0) + 1;
                return acc;
            }, {});

            setTotaisGlobais(totaisPorDisciplina)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetCarencias()
    }, [])

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <DocenteCard totais={totaisGlobais} />

                {/* Você pode usar o segundo slot para outro resumo, como "Top 5 Escolas com mais carência" */}
                <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-movi-blue">
                    <h3 className="font-bold text-slate-700 mb-4">Resumo da Rede - Maricá</h3>
                    <p className="text-sm text-slate-500">
                        Total de tempos em aberto: <span className="font-bold text-movi-blue">{data.length}</span>
                    </p>
                    {/* Outras métricas aqui */}
                </div>
            </div>
            <div>
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="p-3 text-left">Unidade Escolar</th>
                            {colunasDisciplinas.map(disc => (
                                <th key={disc} className="p-3 text-center">{disc}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(data).map(([id, info]: [string, any]) => (
                            <tr key={id} className="border-t hover:bg-slate-50 transition-colors">
                                <td className="p-3 font-medium text-slate-700">{info.nome}</td>
                                {colunasDisciplinas.map(disc => (
                                    <td key={disc} className={`p-4 text-center text-sm ${info.disciplinas[disc] > 0 ? 'font-bold text-movi-blue' : 'text-slate-300'}`}>
                                        {info.disciplinas[disc] || 0}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}