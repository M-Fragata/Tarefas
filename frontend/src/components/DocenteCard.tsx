import { Users } from "lucide-react"

interface DocenteCardProps {
    totais: Record<string, number>;
}

export function DocenteCard({ totais }: DocenteCardProps) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-movi-cyan">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-movi-cyan/10 rounded-lg text-movi-cyan">
                    <Users size={20} />
                </div>
                <h3 className="font-bold text-slate-700">Necessidade por Disciplina</h3>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {Object.entries(totais).length > 0 ? (
                    Object.entries(totais).map(([disciplina, quantidade]) => (
                        <div key={disciplina} className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                            <span className="text-sm text-slate-500">{disciplina}</span>
                            <span className="text-sm font-bold text-slate-800 bg-slate-100 px-2 rounded">
                                {quantidade}h
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-slate-400">Nenhuma carência registrada.</p>
                )}
            </div>
        </div>
    );
}