import { useState, useEffect, Fragment} from 'react';
import { MoreVertical } from 'lucide-react';

// Constantes baseadas na imagem image_77bb8d.png
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
const TEMPOS = [1, 2, 3, 4, 5, 6]; // 6 tempos por turno

// Exemplo de dados de turmas (isso viria do seu banco via Escola -> Turma)
const TurmasManha = [
    { id: '21784', codigo: '411' },
    { id: '21785', codigo: '412' },
    { id: '21786', codigo: '413' },
    { id: '21790', codigo: '511' },
    { id: '21791', codigo: '512' },
    { id: '21792', codigo: '513' },
    { id: '21796', codigo: '611' },
];

const TurmasTarde = [
    { id: '21787', codigo: '421' },
    { id: '21788', codigo: '422' },
    { id: '21789', codigo: '423' },
    { id: '21797', codigo: '521' },
    { id: '21799', codigo: '522' },
    { id: '21750', codigo: '523' },
    { id: '21749', codigo: '621' },
];

export function QuadroHorariosPage() {
    /*
    const [escolas, setEscolas] = useState([]);

    async function handleGetSchools () {
        try {

            const response = await fetch("http://localhost:3333/schools/1", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            setEscolas(data);
            console.log("Escolas:", data);

        } catch (error) {
            console.error("Erro ao buscar escolas:", error);
        }
    }

    useEffect(() => {
        handleGetSchools();
    }, []);
*/
    return (
        <div className="flex flex-col h-full">
            <section id='manha'>
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-700">Quadro de Horários - 1º Turno</h2>
                </div>

                {/* Container com Scroll Horizontal */}
                <div className="flex-1 overflow-x-auto bg-white border border-gray-200 rounded-sm shadow-sm">
                    <table className="table-fixed border-collapse">
                        <thead>
                            {/* Cabeçalho de Turmas */}
                            <tr className="bg-gray-100">
                                <th className="w-16 border border-gray-300 border-r-gray-100 sticky left-0 z-10 bg-gray-100"></th>
                                <th className="w-30 border border-gray-300 sticky left-0 z-10 bg-gray-100"></th>
                                {TurmasManha.map((turma) => (
                                    <th key={turma.id} className="w-40 border border-gray-300 p-1 text-center">
                                        <div className="text-xs font-bold text-gray-600">{turma.codigo}</div>
                                        <div className="text-[10px] text-gray-400">{turma.id}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {DIAS.map((dia) => (
                                <Fragment key={dia}>
                                    {TEMPOS.map((tempo, idx) => (
                                        <tr key={`${dia}-${tempo}`} className="h-5">
                                            {/* Coluna Fixa: Dia e Tempo */}
                                            <td className={`border border-gray-300 bg-gray-50 sticky left-0 z-10 text-center ${idx === 0 ? 'bg-gray-100' : ''}`}>
                                                <div className="text-[10px] font-bold text-gray-700">{dia}</div>
                                            </td>
                                            <td className="border border-gray-300 bg-yellow-100 sticky left-0 z-10 text-center">
                                                <div className="text-[9px] text-gray-500">{tempo}º</div>
                                            </td>

                                            {/* Colunas de Turmas (Células de Aula) */}
                                            {TurmasManha.map((turma) => (
                                                <td
                                                    key={`${turma.id}-${dia}-${tempo}`}
                                                    className="border border-gray-300 p-0 relative group hover:bg-blue-50 transition-colors"
                                                >
                                                    {/* Card de Aula (Simulado) */}
                                                    <div className="flex h-full w-full items-center px-2 gap-1 overflow-hidden">
                                                        <div className="bg-pink-200 text-[10px] font-bold px-1 rounded border border-pink-300">
                                                            LPOR
                                                        </div>
                                                        <div className="flex-1 text-[9px] font-medium text-gray-600 truncate uppercase">
                                                            PROF. EXEMPLO
                                                        </div>
                                                        <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded transition">
                                                            <MoreVertical size={12} className="text-gray-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {/* Espaçador entre dias (estilo e-Cidade) */}
                                    <tr className="h-2 bg-gray-50">
                                        <td className="border border-gray-300 sticky left-0 z-10 bg-gray-50"></td>
                                        {TurmasManha.map((turma) => (
                                            <td key={`spacer-${turma.id}`} className="border border-gray-300"></td>
                                        ))}
                                    </tr>
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            <section id='tarde'>
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-700">Quadro de Horários - 2º Turno</h2>
                </div>

                {/* Container com Scroll Horizontal */}
                <div className="flex-1 overflow-x-auto bg-white border border-gray-200 rounded-sm shadow-sm">
                    <table className="table-fixed border-collapse">
                        <thead>
                            {/* Cabeçalho de Turmas */}
                            <tr className="bg-gray-100">
                                <th className="w-16 border border-gray-300 border-r-gray-100 sticky left-0 z-10 bg-gray-100"></th>
                                <th className="w-30 border border-gray-300 sticky left-0 z-10 bg-gray-100"></th>
                                {TurmasTarde.map((turma) => (
                                    <th key={turma.id} className="w-40 border border-gray-300 p-1 text-center">
                                        <div className="text-xs font-bold text-gray-600">{turma.codigo}</div>
                                        <div className="text-[10px] text-gray-400">{turma.id}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {DIAS.map((dia) => (
                                <Fragment key={dia}>
                                    {TEMPOS.map((tempo, idx) => (
                                        <tr key={`${dia}-${tempo}`} className="h-5">
                                            {/* Coluna Fixa: Dia e Tempo */}
                                            <td className={`border border-gray-300 bg-gray-50 sticky left-0 z-10 text-center ${idx === 0 ? 'bg-gray-100' : ''}`}>
                                                <div className="text-[10px] font-bold text-gray-700">{dia}</div>
                                            </td>
                                            <td className="border border-gray-300 bg-yellow-100 sticky left-0 z-10 text-center">
                                                <div className="text-[9px] text-gray-500">{tempo}º</div>
                                            </td>

                                            {/* Colunas de Turmas (Células de Aula) */}
                                            {TurmasTarde.map((turma) => (
                                                <td
                                                    key={`${turma.id}-${dia}-${tempo}`}
                                                    className="border border-gray-300 p-0 relative group hover:bg-blue-50 transition-colors"
                                                >
                                                    {/* Card de Aula (Simulado) */}
                                                    <div className="flex h-full w-full items-center px-2 gap-1 overflow-hidden">
                                                        <div className="bg-pink-200 text-[10px] font-bold px-1 rounded border border-pink-300">
                                                            LPOR
                                                        </div>
                                                        <div className="flex-1 text-[9px] font-medium text-gray-600 truncate uppercase">
                                                            PROF. EXEMPLO
                                                        </div>
                                                        <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded transition">
                                                            <MoreVertical size={12} className="text-gray-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {/* Espaçador entre dias (estilo e-Cidade) */}
                                    <tr className="h-2 bg-gray-50">
                                        <td className="border border-gray-300 sticky left-0 z-10 bg-gray-50"></td>
                                        {TurmasTarde.map((turma) => (
                                            <td key={`spacer-${turma.id}`} className="border border-gray-300"></td>
                                        ))}
                                    </tr>
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}