import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TimetableCard } from '../components/TimetableCard';
import { Dashboard } from "../components/Dashboard"

const DISCIPLINAS = ['Português', 'Matemática', 'História', 'Ciências', 'Geografia', 'Artes', 'Inglês', 'Ed. Física'];

interface UnidadesProps {
    id: number,
    nome: string,
    createdAt: string
}

interface Board {
    escolaId: number;
    escolaNome: string;
    disciplina: string;
    turno: 'Manhã' | 'Tarde';
    grade: Record<string, string>;
}

interface SchoolRow {
    id: number;
    escolaId?: number;
    escolaNome?: string;
    morningBoard?: Board;
    afternoonBoard?: Board;
}

export function CarenciasPage() {
    const [disciplinaAtiva, setDisciplinaAtiva] = useState('Português');
    const [unidades, setUnidades] = useState<UnidadesProps[]>([])
    const [boards, setBoards] = useState<Board[]>([])
    const [dashboard, setDashboard] = useState<boolean>(false)

    // Estado para controlar os quadrinhos por escola
    const [rows, setRows] = useState<SchoolRow[]>([{ id: Date.now() }]);

    // Adiciona um novo par de Manhã/Tarde
    const adicionarGrade = () => {
        setRows([...rows, { id: Date.now() }]);
    };

    // Remove um par específico
    const removerGrade = (id: number) => {
        if (rows.length > 1) {
            setRows(rows.filter((g) => g.id !== id));
        }
    };

    useEffect(() => {
        const loadData = async () => {

            try {
                const response = await fetch("http://localhost:3333/carencias/unidades")
                const data = await response.json()
                setUnidades(data)
            } catch (error) {
                console.log(error)
            }

            try {
                const response = await fetch("http://localhost:3333/carencias/boards")
                const data = await response.json()
                setBoards(data)
            } catch (error) {
                console.log(error)
            }
        }

        loadData()
    }, [])

    useEffect(() => {

        const filtered = boards.filter((board) => board.disciplina === disciplinaAtiva)

        if (filtered.length === 0) {
            setRows([{ id: Date.now() }])
            return
        }

        const grouped = new Map<number, SchoolRow>()

        filtered.forEach((board) => {
            const row = grouped.get(board.escolaId) ?? {
                id: board.escolaId,
                escolaId: board.escolaId,
                escolaNome: board.escolaNome,
            }

            if (board.turno === 'Manhã') {
                row.morningBoard = board
            } else {
                row.afternoonBoard = board
            }

            grouped.set(board.escolaId, row)
        })

        setRows(Array.from(grouped.values()))

    }, [boards, disciplinaAtiva])

    return (
        <>
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-movi-dark mb-2">Carências - Doc I</h2>
                    <p className="text-gray-600">Gerencie as carências de docentes por disciplina</p>
                </div>
            </header>

            {/* Abas de Disciplinas */}
            <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden flex">
                <div className="flex">
                    {DISCIPLINAS.map((disciplina) => (
                        <button
                            key={disciplina}
                            onClick={() => {
                                setDashboard(false)
                                setDisciplinaAtiva(disciplina)
                            }}
                            className={`px-4 py-3 font-semibold text-sm cursor-pointer transition-all ${disciplinaAtiva === disciplina
                                ? 'text-white bg-movi-blue border-b-4 border-movi-blue'
                                : 'text-gray-700 hover:text-movi-blue hover:bg-gray-50 hover:border-b hover:border-movi-blue'
                                }`}
                        >
                            {disciplina}
                        </button>
                    ))}
                </div>
                <div className='flex-1'>
                    <button
                        onClick={() => {
                            setDisciplinaAtiva("")
                            setDashboard(true)
                        }}
                        className={`w-full px-4 py-3 font-semibold cursor-pointer text-sm transition-all ${dashboard === true
                            ? 'text-white bg-movi-blue border-b-4 border-movi-blue'
                            : 'text-gray-700 hover:text-movi-blue hover:bg-gray-50 hover:border-b hover:border-movi-blue'
                            }`}
                    >Dashboard</button>
            </div>
        </div >
        {
            dashboard?(
                <div className = "w-full" >
                    {/* ÁREA DO DASHBOARD */ }
                    <Dashboard/>
                </div >
            ) : (
        <> {/* Fragmento para envolver a lista e o botão */}
            <div className="space-y-12 w-full">
                {rows.map((row) => (
                    <div key={row.id} className="relative group w-full">
                        {rows.length > 1 && (
                            <button
                                onClick={() => removerGrade(row.id)}
                                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}

                        {/* Container do Card com scroll interno controlado */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto p-6 custom-scrollbar">
                                <div className="flex flex-row gap-6 min-w-[1050px]">
                                    <div className="flex-1">
                                        <TimetableCard
                                            unidades={unidades}
                                            turno="Manhã"
                                            disciplina={disciplinaAtiva}
                                            defaultUnidadeNome={row.escolaNome}
                                            gradeData={row.morningBoard?.grade}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <TimetableCard
                                            unidades={unidades}
                                            turno="Tarde"
                                            disciplina={disciplinaAtiva}
                                            defaultUnidadeNome={row.escolaNome}
                                            gradeData={row.afternoonBoard?.grade}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* BOTÃO PARA GERAR MAIS - Fora do loop, mas dentro do bloco else do dashboard */}
            <div className="mt-12 flex justify-center pb-12">
                <button
                    onClick={adicionarGrade}
                    className="flex items-center gap-2 bg-movi-blue hover:bg-movi-cyan text-white px-8 py-4 rounded-full font-bold shadow-xl transition-all transform hover:scale-105"
                >
                    <Plus size={24} />
                    ADICIONAR NOVO QUADRO (MANHÃ / TARDE)
                </button>
            </div>
        </>
    )
}

        </>
    );
}
