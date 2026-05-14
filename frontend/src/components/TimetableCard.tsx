import { useState, useEffect } from 'react';
import { z } from 'zod'
import { TimetableCardSkeleton } from './TimetableCardSkeleton';

interface UnidadesProps {
    id: number;
    nome: string;
    createdAt: string;
}

interface TimetableCardProps {
    turno: 'Manhã' | 'Tarde';
    disciplina: string;
    unidades: UnidadesProps[];
    defaultUnidadeNome?: string;
    gradeData?: Record<string, string>;
}

const PERIODOS = ['1º', '2º', '3º', '4º', '5º', '6º'];
const DIAS_SEMANA = ['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA'];
const DISCIPLINA_ABREV: Record<string, { principal: string; secundaria: string }> = {
    'Português': { principal: 'LP', secundaria: 'PT' },
    'Matemática': { principal: 'MAT', secundaria: 'GEOM' },
    'História': { principal: 'HIST', secundaria: '' },
    'Ciências': { principal: 'CIÊ', secundaria: '' },
    'Geografia': { principal: 'GEOG', secundaria: '' },
    'Artes': { principal: 'ARTES', secundaria: '' },
    'Inglês': { principal: 'INGLÊS', secundaria: '' },
    'Ed. Física': { principal: 'ED. FÍSICA', secundaria: '' },
};


export function TimetableCard({ turno, disciplina, unidades, defaultUnidadeNome, gradeData }: TimetableCardProps) {
    const [unidadeNome, setUnidadeNome] = useState('');
    const [loading, setLoading] = useState(true)
    // Estado para as turmas: a chave será "dia-periodo" (ex: "SEGUNDA-1º")
    const [grade, setGrade] = useState<Record<string, string>>({});

    const abrev = DISCIPLINA_ABREV[disciplina] || { principal: 'DIS', secundaria: 'DIS' };
    const turnoColor = turno === 'Manhã' ? 'bg-orange-400' : 'bg-blue-400';
    const datalistId = `unidades-${disciplina.replace(/\s+/g, '-').replace(/\./g, '').toLowerCase()}-${turno.replace(/\s+/g, '-').toLowerCase()}`;

    const normalizeName = (name: string) => name.trim().toLowerCase();

    // Encontra o objeto da unidade selecionada para pegar o ID numérico
    const unidadeSelecionada = unidades.find(u => normalizeName(u.nome) === normalizeName(unidadeNome));

    const salvarCarencia = async (dia: string, periodo: string, turma: number) => {

        const bodySchema = z.object({
            escolaId: z.number(),
            disciplina: z.string(),
            turno: z.string(),
            diaSemana: z.number(),
            horarioTempo: z.number(),
            turma: z.number().min(100),
        })

        if (!turma) return

        if (!unidadeSelecionada) {
            alert("Informe a unidade escolar")
            return
        }

        const body = {
            escolaId: unidadeSelecionada.id,
            disciplina,
            turno,
            diaSemana: DIAS_SEMANA.indexOf(dia) + 1, // 1 a 5
            horarioTempo: PERIODOS.indexOf(periodo) + 1, // 1 a 6
            turma,
        }

        bodySchema.parse(body)

        try {
            await fetch('http://localhost:3333/carencias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            console.log(`Salvo: ${dia} ${periodo} - ${turma}`);
            handleGetCarencias(unidadeNome)
        } catch (error) {
            console.error("Erro ao salvar carência:", error);
        }
    };

    async function handleGetCarencias(unidadeAtual?: string) {
        const selectedUnit = unidadeAtual ? normalizeName(unidadeAtual) : normalizeName(unidadeNome);

        try {
            const response = await fetch("http://localhost:3333/carencias", {
                method: "GET",
                headers: { "Content-type": "application/json" }
            })

            const data = await response.json()

            const carenciasFiltradas = data.filter((carencia: any) => carencia.disciplina === disciplina && carencia.turno === turno);
            if (carenciasFiltradas.length === 0) {
                setGrade({});
                return;
            }

            let escolaObjeto = selectedUnit
                ? unidades.find(u => normalizeName(u.nome) === selectedUnit)
                : undefined;

            if (!escolaObjeto) {
                const primeiraCarencia = carenciasFiltradas[0];
                escolaObjeto = unidades.find(u => u.id === primeiraCarencia.escolaId);
                if (escolaObjeto) {
                    setUnidadeNome(escolaObjeto.nome);
                }
            }

            if (!escolaObjeto) {
                setGrade({});
                return;
            }

            const novaGrade: Record<string, string> = {};
            carenciasFiltradas.forEach((carencia: any) => {
                if (carencia.escolaId === escolaObjeto?.id) {
                    const diaNome = DIAS_SEMANA[carencia.diaSemana - 1];
                    const periodoNome = PERIODOS[carencia.horarioTempo - 1];
                    if (diaNome && periodoNome) {
                        novaGrade[`${diaNome}-${periodoNome}`] = carencia.turma.toString();
                    }
                }
            });

            setGrade(novaGrade);

        } catch (error) {
            console.log(error)
            setGrade({})
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }

    useEffect(() => {
        if (gradeData && Object.keys(gradeData).length > 0) {
            setGrade(gradeData)
        } else {
            setGrade({})
        }

        setUnidadeNome(defaultUnidadeNome ?? '')

        if (!gradeData && defaultUnidadeNome) {
            handleGetCarencias(defaultUnidadeNome)
        }

        setTimeout(() => {
            setLoading(false)
        }, 1000)

    }, [disciplina, turno, unidades, defaultUnidadeNome, gradeData])

    useEffect(() => {
        if (unidadeNome) {
            handleGetCarencias(unidadeNome)
        } else {
            setGrade({})
        }

        setTimeout(() => {
            setLoading(false)
        }, 1000)

    }, [unidadeNome, disciplina, turno, unidades])

    return (
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow-md p-4">
            {loading ? ((
                Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="relative group w-full">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 overflow-x-auto">
                            <div className="flex flex-row gap-6 min-w-min">
                                <div className="min-w-[500px] flex-1">
                                    <TimetableCardSkeleton turno="Turno" />
                                </div>

                            </div>
                        </div>
                    </div>
                ))
            )) : (
                <table className="w-full border-collapse border-2 border-black table-fixed">
                    <thead>
                        <tr>
                            <td rowSpan={2} className="border-2 border-black bg-pink-300 p-3 text-center font-bold text-sm w-20">
                                <div>{abrev.principal}</div>
                                {abrev.secundaria && (
                                    <>
                                        <div className="text-xs font-normal">E</div>
                                        <div>{abrev.secundaria}</div>
                                    </>
                                )}
                            </td>
                            <td colSpan={DIAS_SEMANA.length} className="border-2 border-black p-0">
                                <input
                                    list={datalistId}
                                    value={unidadeNome}
                                    onChange={(e) => setUnidadeNome(e.target.value)}
                                    onInput={(e) => setUnidadeNome(e.currentTarget.value)}
                                    placeholder="SELECIONE A UNIDADE ESCOLAR"
                                    className="w-full p-2 font-bold text-lg outline-none focus:bg-slate-50 uppercase text-center"
                                />
                                <datalist id={datalistId}>
                                    {unidades.map(u => (
                                        <option key={u.id.toString()} value={u.nome} />
                                    ))}
                                </datalist>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={DIAS_SEMANA.length} className={`${turnoColor} border-2 border-black p-3 text-center font-bold text-white text-lg`}>
                                {turno.toUpperCase()}
                            </td>
                        </tr>
                        <tr>
                            <td className="border-2 border-black bg-gray-100 p-2 text-center font-bold text-xs uppercase italic text-gray-500">Tempos</td>
                            {DIAS_SEMANA.map((dia) => (
                                <td key={dia} className="border-2 border-black bg-gray-50 p-2 text-center font-bold text-xs">{dia}</td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {PERIODOS.map((periodo) => (
                            <tr key={periodo}>
                                <td className="border-2 border-black bg-gray-100 p-2 text-center font-bold text-sm">{periodo}</td>
                                {DIAS_SEMANA.map((dia) => {
                                    const key = `${dia}-${periodo}`;
                                    return (
                                        <td key={key} className="border-2 border-black p-0 h-12 hover:bg-gray-50 transition-colors">
                                            <input
                                                type="text"
                                                value={grade[key] || ''}
                                                onChange={(e) => setGrade({ ...grade, [key]: e.target.value.toUpperCase() })}
                                                onBlur={(e) => salvarCarencia(dia, periodo, Number(e.target.value))}
                                                className="w-full h-full text-center font-bold text-sm outline-none bg-transparent"
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}