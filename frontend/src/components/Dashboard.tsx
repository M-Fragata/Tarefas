import { useState, useEffect } from "react"

export function Dashboard() {

    const [data, setData] = useState({})

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

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetCarencias()
    }, [])

    return (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data).map(([id, info]: [string, any]) => (
            <div key={id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold border-b pb-2 mb-2">{info.nome}</h3>
                {Object.entries(info.disciplinas).map(([disc, total]) => (
                    <div key={disc} className="flex justify-between text-sm">
                        <span>{disc}:</span>
                        <span className="font-semibold">{total as number} tempos</span>
                    </div>
                ))}
                <div className="mt-2 text-right font-bold text-movi-blue">
                    Total: {info.totalGeral}
                </div>
            </div>
        ))}
    </div>)
}