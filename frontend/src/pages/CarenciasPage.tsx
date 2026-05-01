import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TimetableCard } from '../components/TimetableCard';

const DISCIPLINAS = ['Português', 'Matemática', 'História', 'Ciências', 'Geografia', 'Artes', 'Inglês', 'Ed. Física'];

export function CarenciasPage() {
    const [disciplinaAtiva, setDisciplinaAtiva] = useState('Português');

    // Estado para controlar quantos pares de grades existem
    const [grades, setGrades] = useState([{ id: 1 }]);

    // Adiciona um novo par de Manhã/Tarde
    const adicionarGrade = () => {
        setGrades([...grades, { id: Date.now() }]);
    };

    // Remove um par específico
    const removerGrade = (id: number) => {
        if (grades.length > 1) {
            setGrades(grades.filter(g => g.id !== id));
        }
    };

    return (
        <> 
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-movi-dark mb-2">Carências</h2>
                    <p className="text-gray-600">Gerencie as carências de docentes por disciplina</p>
                </div>
            </header>

            {/* Abas de Disciplinas */}
            <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-wrap gap-0 border-b-2 border-gray-200">
                    {DISCIPLINAS.map((disciplina) => (
                        <button
                            key={disciplina}
                            onClick={() => setDisciplinaAtiva(disciplina)}
                            className={`px-4 py-3 font-semibold text-sm transition-all ${disciplinaAtiva === disciplina
                                    ? 'text-white bg-movi-blue border-b-4 border-movi-blue'
                                    : 'text-gray-700 hover:text-movi-blue hover:bg-gray-50'
                                }`}
                        >
                            {disciplina}
                        </button>
                    ))}
                </div>
            </div>

            {/* ÁREA DAS GRADES */}
            <div className="space-y-12 w-full">
                {grades.map((grade) => (
                    <div key={grade.id} className="relative group w-full">
                        {/* Botão de remover */}
                        {grades.length > 1 && (
                            <button
                                onClick={() => removerGrade(grade.id)}
                                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}

                        {/* Container com scroll interno para as tabelas */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 overflow-x-auto">
                            <div className="flex flex-row gap-6 min-w-min">
                                <div className="min-w-[500px] flex-1">
                                    <TimetableCard turno="Manhã" disciplina={disciplinaAtiva} />
                                </div>

                                <div className="min-w-[500px] flex-1">
                                    <TimetableCard turno="Tarde" disciplina={disciplinaAtiva} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* BOTÃO PARA GERAR MAIS */}
            <div className="mt-12 flex justify-center pb-8"> {/* Adicionado pb-8 para não grudar no footer */}
                <button
                    onClick={adicionarGrade}
                    className="flex items-center gap-2 bg-movi-blue hover:bg-movi-cyan text-white px-8 py-4 rounded-full font-bold shadow-xl transition-all transform hover:scale-105"
                >
                    <Plus size={24} />
                    ADICIONAR NOVO QUADRO (MANHÃ/TARDE)
                </button>
            </div>
        </>
    );
}
