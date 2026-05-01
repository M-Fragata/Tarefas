import React from 'react';
import { useState } from 'react';

interface TimetableCardProps {
    turno: 'Manhã' | 'Tarde';
    disciplina: string;
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

const UNIDADES_ESCOLARES = [
    "E.M. GUARATIBA",
    "E.M. JOAQUIM EUGÊNIO DOS SANTOS",
    "E.M. CARLOS MAGNO LEGIENTIN MACIEL",
    "CEIM ELIMAR DA ROCHA SILVEIRA",
    "E.M. PROFESSORA ODETE ROSA DA SILVA"
];

export function TimetableCard({ turno, disciplina }: TimetableCardProps) {
    const [unidade, setUnidade] = useState('');
    const abrev = DISCIPLINA_ABREV[disciplina] || { principal: 'DIS', secundaria: 'DIS' };
    const turnoColor = turno === 'Manhã' ? 'bg-orange-400' : 'bg-blue-400';

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const valor = e.target.value.toUpperCase();
        if (valor && !UNIDADES_ESCOLARES.includes(valor)) {
            setUnidade('');
            alert("Por favor, selecione uma Unidade Escolar válida da lista.");
        }
    };

    return (
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow-md p-4">
            <table className="w-full border-collapse border-2 border-black table-fixed">
                <thead>
                    {/* LINHA 1: NOME DA UNIDADE ESCOLAR */}
                    <tr>
                        <td 
                            rowSpan={2} // Faz a abreviação ocupar as duas primeiras linhas
                            className="border-2 border-black bg-pink-300 p-3 text-center font-bold text-sm w-20"
                        >
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
                                list={`unidades-${turno}`} // ID único para não conflitar manhã/tarde
                                value={unidade}
                                onChange={(e) => setUnidade(e.target.value.toUpperCase())}
                                onBlur={handleBlur}
                                placeholder="SELECIONE A UNIDADE ESCOLAR"
                                className="w-full p-2 font-bold text-lg outline-none focus:bg-slate-50 uppercase text-center"
                            />
                            <datalist id={`unidades-${turno}`}>
                                {UNIDADES_ESCOLARES.map(u => (
                                    <option key={u} value={u} />
                                ))}
                            </datalist>
                        </td>
                    </tr>

                    


                    {/* LINHA 2: TURNO */}
                    <tr>
                        <td
                            colSpan={DIAS_SEMANA.length}
                            className={`${turnoColor} border-2 border-black p-3 text-center font-bold text-white text-lg`}
                        >
                            {turno.toUpperCase()}
                        </td>
                    </tr>

                    {/* LINHA 3: CABEÇALHO DOS DIAS */}
                    <tr>
                        <td className="border-2 border-black bg-gray-100 p-2 text-center font-bold text-xs uppercase italic text-gray-500">
                            Tempos
                        </td>
                        {DIAS_SEMANA.map((dia) => (
                            <td
                                key={dia}
                                className="border-2 border-black bg-gray-50 p-2 text-center font-bold text-xs"
                            >
                                {dia}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {PERIODOS.map((periodo) => (
                        <tr key={periodo}>
                            <td className="border-2 border-black bg-gray-100 p-2 text-center font-bold text-sm">
                                {periodo}
                            </td>
                            {DIAS_SEMANA.map((dia) => (
                                <td
                                    key={`${periodo}-${dia}`}
                                    className="border-2 border-black p-4 h-12 hover:bg-gray-50 transition-colors"
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}