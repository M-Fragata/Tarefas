import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Wand2,
    RefreshCw,
    Calendar,
    FileText,
    Hash,
    MapPin,
    Clock,
    Copy
} from 'lucide-react';

interface Task {
    id: string;
    servidor: string;
    matricula: number;
    entrada: string;
    emailEntrada: string;
    copiaPara: string[] | null;
    saida: string | null;
    isTotal: boolean | null;
    emailSaida: string | null;
    cargo: string;
    funcao: string;
    cargaHoraria: string;
    inicio: string;
    expedicao: string;
    tipo: string;
    priority: string;
    status: string;
    enviado: boolean;
    description: string | null;
    createdAt: Date;
    isMemorando: boolean;
    number: number | null;
    user: {
        name: string;
    };
    tasklogs: Array<{
        id: string;
        action: string;
        createdAt: string;
    }>;
}

export function TaskDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [memorandoNumber, setMemorandoNumber] = useState<number | "">("")
    const [encaminhamentoNumber, setEncaminhamentoNumber] = useState<number | "">("")


    async function loadTaskData() {
        try {
            const tokenRaw = localStorage.getItem("@educ:token");
            if (!tokenRaw) return;
            const token = JSON.parse(tokenRaw);

            const response = await fetch(`http://localhost:3333/tasks/details/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            console.log(data)
            setTask(data);
        } catch (error) {
            console.error("Erro ao carregar detalhes:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTaskData();
    }, [id]);

    async function handleMemorando() {
        try {

            const tokenRaw = localStorage.getItem("@educ:token");
            if (!tokenRaw) return;
            const token = JSON.parse(tokenRaw);

            if (!memorandoNumber || !encaminhamentoNumber) return alert("Favor informar número de memorando e encaminhamento!")

            const response = await fetch("http://localhost:3333/tasks/email", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ dados: [task], memorandoNumber, encaminhamentoNumber })
            })

            if (!response.ok) return console.log(response)

            alert("Email enviado com sucesso!")

        } catch (error) {
            console.log(error)
        }
    }

    async function handleEcidade() {

        const tokenRaw = localStorage.getItem("@educ:token");
        if (!tokenRaw) return;
        const token = JSON.parse(tokenRaw);

        try {

            const response = await fetch("http://localhost:3333/ecidade", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({task})
            })

            console.log(response)

        } catch (error) {
            console.log(error)
        }
    }

    if (loading) return <div className="flex justify-center p-10 text-movi-blue">Carregando detalhes da demanda...</div>;
    if (!task) return <div className="p-10 text-center">Tarefa não encontrada.</div>;

    return (
        /* Aumentei para max-w-7xl para aproveitar melhor telas UltraWide */
        <div className="max-w-7xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Botão Voltar */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-movi-blue mb-6 transition-colors font-medium cursor-pointer"
            >
                <ArrowLeft size={20} />
                Voltar para tarefas
            </button>

            {/* Grid Principal: 3 colunas em telas grandes (lg) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* COLUNA DA ESQUERDA (Ocupa 2/3) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Card de Informações da Tarefa */}
                    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <div className="flex flex-col mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-bold text-movi-cyan uppercase tracking-widest">Processo de Movimentação</span>
                                    <h1 className="text-3xl font-bold text-movi-dark mt-1">{task.servidor}</h1>
                                </div>
                                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase">
                                    {task.status}
                                </span>
                            </div>
                            <div>
                                {task.cargo}
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-slate-50 rounded-xl text-movi-blue"><Hash size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">Matrícula</p>
                                    <p className="font-semibold text-gray-700 text-lg">{task.matricula}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-slate-50 rounded-xl text-movi-blue"><Calendar size={20} /></div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">Abertura da Demanda</p>
                                    <p className="font-semibold text-gray-700 text-lg">
                                        {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <hr className="my-8 border-slate-100" />
                        <div className="mb-4 border-b border-slate-100 pb-4">
                            <p className="text-sm text-movi-dark flex items-center gap-2">
                                <Copy size={20} className="text-movi-cyan" /> {task.copiaPara?.join(', ') || 'Nenhum e-mail de cópia informado'}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                                <MapPin size={16} /> Fluxo de Unidades - <span>{task.cargaHoraria}</span>
                            </h3>
                            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-center border border-slate-100">
                                <div className="flex-1 text-center md:text-left">
                                    <p className="text-[10px] font-black text-movi-blue uppercase mb-1">Unidade de Saída</p>
                                    <p className="text-base font-bold text-gray-700">{task.saida}</p>
                                </div>
                                <div className="text-slate-300 transform md:rotate-0 rotate-90">
                                    <ArrowLeft className="rotate-180" size={24} />
                                </div>
                                <div className="flex-1 text-center md:text-right">
                                    <p className="text-[10px] font-black text-movi-cyan uppercase mb-1">Unidade de Entrada</p>
                                    <p className="text-base font-bold text-gray-700">{task.entrada}</p>
                                </div>
                            </div>
                            <div>Obs: {task.description}</div>
                        </div>
                    </section>

                    {/* Timeline de Histórico (Agora dentro da coluna da esquerda) */}
                    <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <h3 className="text-lg font-bold text-movi-dark mb-8 flex items-center gap-2">
                            <Clock size={20} className="text-movi-blue" /> Histórico da Demanda
                        </h3>
                        <div className="space-y-8 border-l-2 border-slate-100 ml-4 pl-8">
                            {task.tasklogs && task.tasklogs.length > 0 ? (
                                task.tasklogs.map((log: any) => (
                                    <div key={log.id} className="relative">
                                        <div className="absolute -left-[39px] top-1 w-5 h-5 bg-movi-blue rounded-full border-4 border-white shadow-sm"></div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase">
                                            {new Date(log.createdAt).toLocaleString('pt-BR')}
                                        </p>
                                        <p className="text-gray-700 mt-1 font-medium leading-relaxed">{log.action}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">Nenhum registro de atividade até o momento.</p>
                            )}
                        </div>
                    </section>
                </div> {/* <--- FECHAMENTO DA COLUNA DA ESQUERDA */}


                {/* COLUNA DA DIREITA (Ações e Sidebar - Ocupa 1/3) */}
                <aside className="space-y-6 lg:sticky lg:top-6">

                    {/* Card de IA */}
                    <section className="bg-movi-dark text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wand2 size={80} />
                        </div>

                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
                            <Wand2 size={22} className="text-movi-cyan" /> Assistente MoviAI
                        </h3>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed relative z-10">
                            Analisei os dados desta movimentação. Posso gerar o memorando oficial para a prefeitura agora mesmo.
                        </p>

                        {/* Inputs de Numeração */}
                        <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                                    Próximo Nº Memorando
                                </label>
                                <input
                                    type="number"
                                    value={memorandoNumber}
                                    onChange={(e) => setMemorandoNumber(Number(e.target.value))}
                                    placeholder="Ex: 150"
                                    className="w-full bg-movi-dark border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-movi-cyan outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                                    Próximo Nº Encaminhamento
                                </label>
                                <input
                                    type="number"
                                    value={encaminhamentoNumber}
                                    onChange={(e) => setEncaminhamentoNumber(Number(e.target.value))}
                                    placeholder="Ex: 42"
                                    className="w-full bg-movi-dark border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-movi-cyan outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <button
                                onClick={() => handleMemorando()}
                                className="w-full bg-movi-cyan hover:brightness-110 text-movi-dark font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
                                <FileText size={20} />
                                GERAR MEMORANDO
                            </button>

                            <button
                                onClick={() => handleEcidade()}
                                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10">
                                <RefreshCw size={18} className="text-movi-cyan" />
                                Sincronizar e-Cidade
                            </button>
                        </div>
                    </section>

                    {/* Card de Responsável */}
                    <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase mb-5 tracking-widest">Responsável Técnico</h4>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-movi-blue to-movi-dark rounded-2xl flex items-center justify-center text-white font-bold shadow-inner">
                                {task.user?.name?.substring(0, 2).toUpperCase() || "MA"}
                            </div>
                            <div>
                                <p className="text-base font-bold text-gray-800">{task.user?.name || "Funcionário"}</p>
                                <p className="text-xs font-medium text-movi-blue">Analista de TI - SEMED</p>
                            </div>
                        </div>
                    </section>

                </aside>

            </div>
        </div>
    );
}