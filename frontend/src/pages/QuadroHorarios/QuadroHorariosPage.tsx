import { useState, useEffect, Fragment } from 'react';
import { Settings, ChevronDown, School } from 'lucide-react';

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

interface EscolaProps {
    id: number,
    nome: string,
    createdAt: Date
}

interface AulaData {
    disciplina: string;
    professorId?: string; // ID do professor no banco
    professorNome?: string;
    substitutoNome?: string;
    tipoCarencia?: 'REAL' | 'TEMPORARIA' | 'NENHUMA';
    cor: string;
}

export function QuadroHorariosPage() {

    const [escolas, setEscolas] = useState<EscolaProps[]>([]);
    const [escolaSelecionada, setEscolaSelecionada] = useState<string>("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [slotAtivo, setSlotAtivo] = useState<string | null>(null);

    const [formData, setFormData] = useState<AulaData>({
        disciplina: '',
        professorNome: '',
        substitutoNome: '',
        tipoCarencia: 'NENHUMA',
        cor: 'bg-white'
    });

    const [gradeHoraria, setGradeHoraria] = useState<Record<string, AulaData>>({
        // "turmaId-dia-tempo": { disciplina: 'LPOR', professor: 'FABIO', cor: '#fce7f3' }
        "21784-Seg-1": { disciplina: 'LPOR', professorNome: 'MARIA SILVA', tipoCarencia: 'NENHUMA', cor: 'bg-pink-100' },
        "21784-Seg-2": { disciplina: 'LPOR', professorNome: 'MARIA SILVA', tipoCarencia: 'NENHUMA', cor: 'bg-pink-100' },
        "21784-Seg-3": { disciplina: 'MAT', professorNome: 'JOSE CARLOS', tipoCarencia: 'NENHUMA', cor: 'bg-blue-100' },
        "21784-Seg-4": { disciplina: 'MAT', professorNome: 'JOSE CARLOS', tipoCarencia: 'NENHUMA', cor: 'bg-blue-100' },
        "21784-Ter-5": { disciplina: 'MAT', professorNome: 'JOSE CARLOS', tipoCarencia: 'NENHUMA', cor: 'bg-blue-100' },
        "21784-Ter-6": { disciplina: 'MAT', professorNome: 'JOSE CARLOS', tipoCarencia: 'NENHUMA', cor: 'bg-blue-100' },
    });

    async function handleGetSchools() {
        try {

            const response = await fetch("http://localhost:3333/schools/unidades", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            setEscolas(data);

            if (data.length > 0) {
                setEscolaSelecionada(data[0].nome)
            }

        } catch (error) {
            console.error("Erro ao buscar escolas:", error);
        }
    }

    useEffect(() => {
        handleGetSchools();
    }, []);

    async function handleGetSchoolsData() {
        try {

            const id = escolas.find(escola => escola.nome === escolaSelecionada)?.id;

            if (!id) return console.error("Escola não encontrada");

            const response = await fetch(`http://localhost:3333/schools/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            console.log(data);

        } catch (error) {
            console.error("Erro ao buscar dados das escolas:", error);
        }
    }

    function openModal(key: string) {
        setSlotAtivo(key);
        const dadosAtuais = gradeHoraria[key];

        if (dadosAtuais) {
            setFormData(dadosAtuais);
        } else {
            setFormData({
                disciplina: '',
                professorNome: '',
                substitutoNome: '',
                tipoCarencia: 'NENHUMA',
                cor: 'bg-white'
            });
        }
        setIsModalOpen(true);
    };

    const handleSalvar = () => {
        if (slotAtivo) {
            setGradeHoraria(prev => ({
                ...prev,
                [slotAtivo]: formData
            }));
            setIsModalOpen(false);
        }
    };

    return (
        <main>
            <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <School className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800 leading-tight">SEMED Maricá</h1>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            {escolaSelecionada || "Selecione uma unidade"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* ENGRENAGEM COM SELECT */}
                    <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-1.5 gap-2 hover:bg-gray-200 transition-colors cursor-pointer group">
                        <Settings size={18} className="text-gray-500 group-hover:rotate-90 transition-transform duration-300" />
                        <select
                            className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer"
                            value={escolaSelecionada}
                            onChange={(e) => setEscolaSelecionada(e.target.value)}
                        >
                            <option value="" disabled>Trocar Unidade Escolar</option>
                            {escolas.map((escola: EscolaProps) => (
                                <option key={escola.id} value={escola.nome}>
                                    {escola.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            <div className="flex flex-col h-full">
                <section id='manha' className="mb-12">
                    <div className="mt-2">
                        <h2 className="text-xl font-bold text-gray-700">Quadro de Horários - 1º Turno</h2>
                    </div>

                    <div className="flex-1 overflow-x-auto bg-white border border-gray-200 rounded-sm shadow-sm">
                        <table className="table-fixed border-collapse">
                            <thead>
                                {/* Cabeçalho de Turmas */}
                                <tr className="bg-gray-100">
                                    <th className="min-w-8 border border-gray-300 border-r-gray-100 sticky left-0 z-10 bg-gray-100"></th>
                                    <th className="min-w-6 border border-gray-300 sticky left-0 z-10 bg-gray-100"></th>
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
                                            <tr key={`${dia}-${tempo}`} className="h-6">

                                                <td className={`border border-gray-300 bg-gray-50 sticky left-0 z-10 text-center ${idx === 0 ? 'bg-gray-100' : ''}`}>
                                                    <div className="text-[10px] font-bold text-gray-700">{dia}</div>
                                                </td>
                                                <td className="border border-gray-300 bg-yellow-50 sticky left-0 z-10 text-center">
                                                    <div className="text-[9px] text-gray-500">{tempo}º</div>
                                                </td>


                                                {TurmasManha.map((turma) => {
                                                    const slotKey = `${turma.id}-${dia}-${tempo}`;
                                                    const aula = gradeHoraria[slotKey];

                                                    return (
                                                        <td key={slotKey} className="border border-gray-300 p-0 relative group h-4 w-35">
                                                            {aula ? (
                                                                <div className={`flex h-full w-full items-center justify-between px-2`}>
                                                                    <div className="flex gap-2 items-center">
                                                                        <div className="flex items-start">
                                                                            <span className={`text-[8px] p-1 rounded-sm font-bold uppercase ${aula.cor}`}>{aula.disciplina}</span>
                                                                        </div>
                                                                        <div className="text-[9px] truncate text-gray-600">
                                                                            {aula.tipoCarencia !== 'NENHUMA' ? (
                                                                                <span className="text-red-600 font-semibold italic">
                                                                                    {aula.substitutoNome ? `Sub: ${aula.substitutoNome}` : 'CARÊNCIA'}
                                                                                </span>
                                                                            ) : aula.professorNome}
                                                                        </div>
                                                                    </div>

                                                                    <button
                                                                        onClick={() => openModal(slotKey)} className="cursor-pointer p-1 ">
                                                                        <ChevronDown size={12} className="text-gray-400 hover:text-blue-600" />
                                                                    </button>
                                                                </div>
                                                            ) : (

                                                                <div className="flex justify-end mr-2">
                                                                    <button
                                                                        onClick={() => openModal(slotKey)} className="cursor-pointer p-1">
                                                                        <ChevronDown size={12} className="text-gray-400 hover:text-blue-600" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}


                                        <tr className="h-2 bg-gray-100">
                                            <td className="border border-gray-300 sticky left-0 z-10 bg-gray-100"></td>
                                            <td className="border border-gray-300 sticky left-0 z-10 bg-gray-100"></td>
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
                <section id='tarde' className="mb-12">
                    <div className="mt-2">
                        <h2 className="text-xl font-bold text-gray-700">Quadro de Horários - 2º Turno</h2>
                    </div>


                    <div className="flex-1 overflow-x-auto bg-white border border-gray-200 rounded-sm shadow-sm">
                        <table className="table-fixed border-collapse">
                            <thead>

                                <tr className="bg-gray-100">
                                    <th className="min-w-8 border border-gray-300 border-r-gray-100 sticky left-0 z-10 bg-gray-100"></th>
                                    <th className="min-w-6 border border-gray-300 sticky left-0 z-10 bg-gray-100"></th>
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
                                            <tr key={`${dia}-${tempo}`} className="h-6">

                                                <td className={`border border-gray-300 bg-gray-50 sticky left-0 z-10 text-center ${idx === 0 ? 'bg-gray-100' : ''}`}>
                                                    <div className="text-[10px] font-bold text-gray-700">{dia}</div>
                                                </td>
                                                <td className="border border-gray-300 bg-yellow-50 sticky left-0 z-10 text-center">
                                                    <div className="text-[9px] text-gray-500">{tempo}º</div>
                                                </td>

                                                {TurmasTarde.map((turma) => {
                                                    const slotKey = `${turma.id}-${dia}-${tempo}`;
                                                    const aula = gradeHoraria[slotKey];

                                                    return (
                                                        <td key={slotKey} className="border border-gray-300 p-0 relative group h-4 w-35">
                                                            {aula ? (
                                                                <div className={`flex h-full w-full items-center justify-between px-2`}>
                                                                    <div className="flex gap-2 items-center">
                                                                        <div className="flex items-start">
                                                                            <span className={`text-[8px] p-1 rounded-sm font-bold uppercase ${aula.cor}`}>{aula.disciplina}</span>
                                                                        </div>
                                                                        <div className="text-[9px] truncate text-gray-600">
                                                                            {aula.tipoCarencia !== 'NENHUMA' ? (
                                                                                <span className="text-red-600 font-semibold italic">
                                                                                    {aula.substitutoNome ? `Sub: ${aula.substitutoNome}` : 'CARÊNCIA'}
                                                                                </span>
                                                                            ) : aula.professorNome}
                                                                        </div>
                                                                    </div>

                                                                    <button
                                                                        onClick={() => openModal(slotKey)}
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1">
                                                                        <ChevronDown size={12} className="text-gray-400 hover:text-blue-600" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex justify-end mr-2">
                                                                    <button
                                                                        onClick={() => openModal(slotKey)} className="cursor-pointer p-1">
                                                                        <ChevronDown size={12} className="text-gray-400 hover:text-blue-600" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}


                                        <tr className="h-2 bg-gray-100">
                                            <td className="border border-gray-300 sticky left-0 z-10 bg-gray-100"></td>
                                            <td className="border border-gray-300 sticky left-0 z-10 bg-gray-100"></td>
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
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        {/* Header */}
                        <div className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Configurar Aula</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-4">
                            {/* Disciplina */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Disciplina</label>
                                <select
                                    className="w-full border rounded-md p-2 text-sm cursor-pointer"
                                    value={formData.disciplina}
                                    onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="LPOR">Língua Portuguesa</option>
                                    <option value="MAT">Matemática</option>
                                    <option value="HIST">História</option>
                                </select>
                            </div>

                            {/* Status da Vaga */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Status da Vaga</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['NENHUMA', 'TEMPORARIA', 'REAL'].map((tipo) => (
                                        <button
                                            key={tipo}
                                            onClick={() => setFormData({ ...formData, tipoCarencia: tipo as any })}
                                            className={`cursor-pointer text-[10px] py-2 rounded border font-bold ${formData.tipoCarencia === tipo
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-500 border-gray-200'
                                                }`}
                                        >
                                            {tipo === 'NENHUMA' ? 'OCUPADA' : tipo}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Campos Condicionais */}
                            {formData.tipoCarencia === 'NENHUMA' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Professor Titular</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-md p-2 text-sm cursor-pointer"
                                        placeholder="Nome do professor..."
                                        value={formData.professorNome}
                                        onChange={(e) => setFormData({ ...formData, professorNome: e.target.value })}
                                    />
                                </div>
                            )}

                            {formData.tipoCarencia === 'TEMPORARIA' && (
                                <div className="bg-orange-50 p-3 rounded-md border border-orange-200 space-y-3">
                                    <p className="text-[10px] text-orange-700 font-bold uppercase italic">Afastamento Temporário</p>
                                    <div>
                                        <label className="block text-xs font-medium text-orange-800 mb-1">Professor Substituto (Opcional)</label>
                                        <input
                                            type="text"
                                            className="w-full border-orange-200 rounded-md p-2 text-sm focus:ring-orange-500"
                                            placeholder="Nome do substituto se houver..."
                                            value={formData.substitutoNome}
                                            onChange={(e) => setFormData({ ...formData, substitutoNome: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.tipoCarencia === 'REAL' && (
                                <div className="bg-red-50 p-3 rounded-md border border-red-200 text-center">
                                    <p className="text-xs text-red-700 font-bold uppercase">Atenção: Carência Real</p>
                                    <p className="text-[10px] text-red-600">Esta vaga será marcada como sem profissional no sistema.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-4 py-3 border-t flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-md"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSalvar}
                                className="px-4 py-2 cursor-pointer text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                            >
                                Salvar Alocação
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}