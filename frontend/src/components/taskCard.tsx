import { Badge } from 'lucide-react';

interface Task {
    id: string;
    servidor: string;
    matricula: string;
    entrada: string;
    saida: string;
    tipo: string;
    priority: string;
    status: string;
    description: string;
    createdAt: string;
    userID?: string;
}

interface TaskCardProps {
    task: Task;
    isOwned?: boolean;
    onAssumirTarefa: (id: string) => void; // Corrigido o nome e a sintaxe
}

export function TaskCard({ task, isOwned = false, onAssumirTarefa }: TaskCardProps) {

    const getBadgeColor = (tipo: Task['tipo']) => {
        switch (tipo) {
            case 'Movimentacao':
                return 'bg-red-100 text-red-700';
            case 'Admissao':
                return 'bg-green-100 text-green-700';
            case 'RCH':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };



    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 hover:scale-102">
            <div className="space-y-4">
                {/* Header com Nome e Matrícula */}
                <div>
                    <h3 className="text-lg font-semibold text-movi-dark mb-1">
                        {task.servidor} - <span className='text-sm text-gray-500'>{task.matricula}</span>
                    </h3>
                </div>

                {/* Badge com tipo */}
                <div className="flex justify-start">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(task.tipo)}`}>
                        <Badge size={14} />
                        {task.tipo}
                    </span>
                </div>

                {/* Unidades */}
                <div className="grid grid-rows-2 gap-4 py-3 border-t border-gray-200">
                    <div>
                        <p className="text-xs font-semibold text-movi-blue mb-1">
                            UNIDADE DE SAÍDA
                        </p>
                        <p className="text-sm text-gray-700">{task.saida}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-movi-cyan mb-1">
                            UNIDADE DE ENTRADA
                        </p>
                        <p className="text-sm text-gray-700">{task.entrada}</p>
                    </div>
                </div>

                {/* Botões de Ação */}
                {!isOwned ? (
                    <div className="pt-3 border-t border-gray-200">

                        <button
                            onClick={() => onAssumirTarefa(task.id)}
                            className="w-full bg-movi-blue text-white font-medium py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 active:scale-95 hover:cursor-pointer"
                        >
                            Assumir Tarefa
                        </button>

                    </div>
                ) : ""}
            </div>
        </div>
    )
};