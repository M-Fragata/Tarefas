const PERIODOS = ['1º', '2º', '3º', '4º', '5º', '6º'];
const DIAS_SEMANA = ['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA'];

interface TimetableCardSkeletonProps {
    turno: 'Manhã' | 'Tarde' | 'Turno';
}

export function TimetableCardSkeleton({ turno }: TimetableCardSkeletonProps) {
    return (
        <div className="w-full overflow-x-auto bg-slate-100 rounded-lg shadow-sm p-4">
            <table className="w-full border-collapse table-fixed">
                <thead>
                    <tr>
                        <td rowSpan={2} className="border border-slate-200 bg-slate-200 p-3 text-center font-bold text-sm w-20">
                            <div className="h-4 bg-slate-300 rounded mb-2"></div>
                            <div className="h-3 bg-slate-300 rounded mx-auto w-10"></div>
                        </td>
                        <td colSpan={DIAS_SEMANA.length} className="border border-slate-200 p-2">
                            <div className="h-12 bg-slate-300 rounded-md w-full" />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={DIAS_SEMANA.length} className="border border-slate-200 p-3 text-center font-bold text-white text-lg bg-slate-300">
                            {turno.toUpperCase()}
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-slate-200 bg-slate-200 p-2 text-center font-bold text-xs uppercase italic text-slate-500">Tempos</td>
                        {DIAS_SEMANA.map((dia) => (
                            <td key={dia} className="border border-slate-200 bg-slate-200 p-2 text-center font-bold text-xs text-slate-500">
                                <div className="h-3 bg-slate-300 rounded mx-auto w-14"></div>
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {PERIODOS.map((periodo) => (
                        <tr key={periodo}>
                            <td className="border border-slate-200 bg-slate-200 p-2 text-center font-bold text-sm">
                                <div className="h-4 bg-slate-300 rounded mx-auto w-8"></div>
                            </td>
                            {DIAS_SEMANA.map((dia) => (
                                <td key={`${dia}-${periodo}`} className="border border-slate-200 p-1">
                                    <div className="h-10 bg-slate-200 rounded-md" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
