import { useState, useEffect } from 'react';
import { Link } from "react-router";

import { ClipboardList, Sparkles, X, Send, Copy, Check } from 'lucide-react';

import { StatusCard } from "../components/StatusCard"
import { TaskCard } from '../components/taskCard';

interface Task {
    id: string;
    servidor: string;
    matricula: string;
    entrada: string;
    emailEntrada: string;
    saida: string;
    emailSaida: string;
    cargo: string;
    funcao: string;
    cargaHoraria: string;
    inicio: string;
    expedicao: string;
    tipo: string;
    priority: string;
    status: string;
    description: string;
    createdAt: string;
    userID?: string;
    isMemorando?: boolean;
}

// Tipo para controlar as abas internas de Minhas Tarefas
type ActiveTab = 'todas' | 'memorandos' | 'encaminhamentos';

export function TaskPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [myTasks, setMyTasks] = useState<Task[]>([]);

    const [showMyTasks, setShowMyTasks] = useState<boolean>(true);
    // Controla qual sub-aba está ativa dentro de Minhas Tarefas
    const [currentTab, setCurrentTab] = useState<ActiveTab>('todas');

    const [copiedTab, setCopiedTab] = useState<string | null>(null);

    // Filtragem inteligente baseada na aba selecionada
    const filteredMyTasks = myTasks.filter(task => {
        if (currentTab === 'memorandos') {
            return task.isMemorando === true;
        }
        if (currentTab === 'encaminhamentos') {
            return task.isMemorando === false;
        }
        // Aba 'todas' mostra absolutamente tudo em formato de card
        return true;
    });

    async function handleGetTasks() {
        try {
            const tokenRaw = localStorage.getItem("@educ:token")
            if (!tokenRaw) return window.location.href = "/"
            const token = JSON.parse(tokenRaw)

            const response = await fetch("http://localhost:3333/tasks", {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            const data = await response.json()
            setTasks(data)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleMyTasks() {
        const tokenRaw = localStorage.getItem("@educ:token")
        const userRaw = localStorage.getItem("@educ:user")

        if (!userRaw || !tokenRaw) return window.location.href = "/"

        const token = JSON.parse(tokenRaw)
        const user = JSON.parse(userRaw)

        try {
            const response = await fetch(`http://localhost:3333/tasks/${user.id}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            const data = await response.json()
            setMyTasks(data)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleAssumirTarefa(id: string) {
        const tokenRaw = localStorage.getItem("@educ:token")
        const userRaw = localStorage.getItem("@educ:user")

        if (!userRaw || !tokenRaw) return window.location.href = "/"

        const token = JSON.parse(tokenRaw)
        const user = JSON.parse(userRaw)

        try {
            const response = await fetch(`http://localhost:3333/tasks/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao assumir tarefa");
            }

            await handleMyTasks();
            await handleGetTasks();
        } catch (error) {
            console.log(error)
        }
    }

    // Copia a tabela baseando-se no ID passado (memorandos ou encaminhamentos)
    function handleCopyTable(tableId: string) {
        const table = document.getElementById(tableId);
        if (!table) return;

        const range = document.createRange();
        range.selectNode(table);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);

        try {
            document.execCommand('copy');
            setCopiedTab(tableId);
            setTimeout(() => setCopiedTab(null), 2000);
        } catch (err) {
            console.error('Erro ao copiar tabela', err);
        }
        window.getSelection()?.removeAllRanges();
    }

    const [isAiInputVisible, setIsAiInputVisible] = useState(false);
    const [userMessage, setUserMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    async function handleGenerateFromAi() {
        if (!userMessage.trim()) return;

        setIsProcessing(true);
        try {
            const tokenRaw = localStorage.getItem("@educ:token");
            const token = JSON.parse(tokenRaw || "");

            const response = await fetch("http://localhost:3333/tasks/memorando", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userMessage })
            });

            if (response.ok) {
                setUserMessage("");
                setIsAiInputVisible(false);
                handleGetTasks()
                handleMyTasks()
            }
        } catch (error) {
            console.error("Erro ao processar com IA:", error);
            alert("Erro ao processar o texto do e-mail.");
        } finally {
            setIsProcessing(false);
        }
    }

    useEffect(() => {
        handleGetTasks()
        handleMyTasks()
    }, [])

    return (
        <>
            {/* Cabeçalho com Cards de Resumo */}
            <header className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-movi-dark">Central de Movimentações</h2>

                    <button
                        onClick={() => setIsAiInputVisible(!isAiInputVisible)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isAiInputVisible
                            ? "bg-slate-200 text-slate-600"
                            : "bg-movi-blue text-white shadow-md hover:bg-opacity-90"
                            }`}
                    >
                        {isAiInputVisible ? <X size={18} /> : <Sparkles size={18} />}
                        {isAiInputVisible ? "Cancelar" : "Nova tarefa com IA"}
                    </button>
                </div>

                {/* Área de Input da IA */}
                {isAiInputVisible && (
                    <div className="mb-8 bg-white p-6 rounded-xl border-2 border-movi-blue shadow-lg animate-in slide-in-from-top duration-300">
                        <label className="block text-movi-dark font-semibold mb-2">
                            Cole o texto do e-mail recebido abaixo:
                        </label>
                        <textarea
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            placeholder="Ex: Gostaria de solicitar a movimentação do servidor Matheus Fragata da E.M. Marquês de Maricá para a E.M. Carlos Manoel..."
                            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-movi-blue outline-none resize-none text-slate-600"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleGenerateFromAi}
                                disabled={isProcessing || !userMessage}
                                className="flex items-center gap-2 bg-movi-cyan text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <Send size={18} />
                                )}
                                {isProcessing ? "Processando..." : "Gerar Tarefas"}
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div onClick={() => { setShowMyTasks(false); setCurrentTab('todas'); }} className="cursor-pointer">
                        <StatusCard
                            title="Tarefas Disponíveis"
                            value={tasks.length.toString()}
                            icon={<ClipboardList />}
                            color="movi-blue"
                            description="Aguardando atribuição"
                            active={!showMyTasks}
                        />
                    </div>
                    <div onClick={() => setShowMyTasks(true)} className="cursor-pointer">
                        <StatusCard
                            title="Minhas Tarefas"
                            value={myTasks.length.toString()}
                            icon={<ClipboardList />}
                            color="movi-cyan"
                            description="Tarefas que você está gerenciando"
                            active={showMyTasks}
                        />
                    </div>
                </div>
            </header>

            {/* Alternância de Visualização baseada no estado showMyTasks */}
            {showMyTasks ? (
                /* Seção Interna de Minhas Tarefas */
                <section className="animate-in fade-in duration-500">
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
                        <button
                            className={`text-xl font-bold cursor-pointer px-4 py-2 rounded-t-lg transition-all ${currentTab === 'todas'
                                ? "border-b-4 border-movi-blue text-movi-blue"
                                : "text-slate-400 hover:text-movi-dark"}`}
                            onClick={() => setCurrentTab('todas')}
                        >
                            Minhas Tarefas <span className="bg-movi-blue text-white text-xs font-bold px-2 py-1 rounded-full"> {myTasks.length} </span>
                        </button>
                        <button
                            className={`text-xl font-bold cursor-pointer px-4 py-2 rounded-t-lg transition-all ${currentTab === 'memorandos'
                                ? "border-b-4 border-movi-blue text-movi-blue"
                                : "text-slate-400 hover:text-movi-dark"}`}
                            onClick={() => setCurrentTab('memorandos')}
                        >
                            Memorandos <span className="bg-movi-blue text-white text-xs font-bold px-2 py-1 rounded-full"> {myTasks.filter((task: any) => task.isMemorando).length} </span>
                        </button>
                        <button
                            className={`text-xl font-bold cursor-pointer px-4 py-2 rounded-t-lg transition-all ${currentTab === 'encaminhamentos'
                                ? "border-b-4 border-movi-blue text-movi-blue"
                                : "text-slate-400 hover:text-movi-dark"}`}
                            onClick={() => setCurrentTab('encaminhamentos')}
                        >
                            Encaminhamentos <span className="bg-movi-blue text-white text-xs font-bold px-2 py-1 rounded-full"> {myTasks.filter((task: any) => !task.isMemorando).length} </span>
                        </button>
                    </div>

                    {/* RENDERIZAÇÃO BASEADA NA SUB-ABA ATIVA */}
                    {currentTab === 'memorandos' && (
                        /* TABELA DE MEMORANDOS (isMemorando: true) */
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 animate-in fade-in duration-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-movi-dark">Planilha de Controle de Memorandos</h3>
                                {filteredMyTasks.length > 0 && (
                                    <div className="flex gap-2">
                                        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-emerald-500 text-white hover:bg-opacity-90 transition-all cursor-pointer`} onClick={() => alert("Função de envio de e-mails ainda não implementada")}>
                                            Enviar Emails
                                        </button>
                                        <button
                                            onClick={() => handleCopyTable('memorandos-table')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${copiedTab === 'memorandos-table' ? "bg-green-600 text-white" : "bg-emerald-500 text-white hover:bg-opacity-90"
                                                }`}
                                        >
                                            {copiedTab === 'memorandos-table' ? <Check size={16} /> : <Copy size={16} />}
                                            {copiedTab === 'memorandos-table' ? "Copiado!" : "Copiar Memorandos"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {filteredMyTasks.length > 0 ? (
                                <div className="overflow-x-auto border rounded-lg">
                                    <table id="memorandos-table" className="w-full text-sm text-left text-slate-600">
                                        <thead className="text-xs uppercase bg-slate-50 text-slate-700 border-b">
                                            <tr>

                                                <th className="px-4 py-3 font-bold">Expedição</th>
                                                <th className="px-4 py-3 font-bold">Início</th>
                                                <th className="px-4 py-3 font-bold">Matrícula</th>
                                                <th className="px-4 py-3 font-bold">Servidor</th>
                                                <th className="px-4 py-3 font-bold">Cargo</th>
                                                <th className="px-4 py-3 font-bold">Situação</th>
                                                <th className="px-4 py-3 font-bold">Cod Lotação</th>
                                                <th className="px-4 py-3 font-bold">Destino</th>
                                                <th className="px-4 py-3 font-bold">Carga Horária</th>
                                                <th className="px-4 py-3 font-bold">Turno</th>
                                                <th className="px-4 py-3 font-bold">Observação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMyTasks.map((task) => (
                                                <tr key={task.id} className="bg-white border-b hover:bg-slate-50">
                                                    <td className="px-4 py-3 text-slate-900 whitespace-nowrap">{task.expedicao}</td>
                                                    <td className="px-4 py-3">{task.inicio}</td>
                                                    <td className="px-4 py-3">{task.matricula}</td>
                                                    <td className="px-4 py-3">{task.servidor}</td>
                                                    <td className="px-4 py-3">{task.cargo}</td>
                                                    <td className="px-4 py-3">

                                                    </td>
                                                    <td className="px-4 py-3">

                                                    </td>
                                                    <td className="px-4 py-3">{task.entrada}</td>

                                                    <td className="px-4 py-3">{task.cargaHoraria}</td>
                                                    <td className="px-4 py-3">A Combinar</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    Nenhum memorando sob sua gestão no momento.
                                </div>
                            )}
                        </div>
                    )}

                    {currentTab === 'encaminhamentos' && (
                        /* TABELA DE ENCAMINHAMENTOS (isMemorando: false) */
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 animate-in fade-in duration-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-movi-dark">Planilha de Controle de Encaminhamentos</h3>
                                {filteredMyTasks.length > 0 && (
                                    <button
                                        onClick={() => handleCopyTable('encaminhamentos-table')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${copiedTab === 'encaminhamentos-table' ? "bg-green-600 text-white" : "bg-emerald-500 text-white hover:bg-opacity-90"
                                            }`}
                                    >
                                        {copiedTab === 'encaminhamentos-table' ? <Check size={16} /> : <Copy size={16} />}
                                        {copiedTab === 'encaminhamentos-table' ? "Copiado!" : "Copiar Encaminhamentos"}
                                    </button>
                                )}
                            </div>

                            {filteredMyTasks.length > 0 ? (
                                <div className="overflow-x-auto border rounded-lg">
                                    <table id="encaminhamentos-table" className="w-full text-sm text-left text-slate-600">
                                        <thead className="text-xs uppercase bg-slate-50 text-slate-700 border-b">
                                            <tr>
                                                <th className="px-4 py-3 font-bold">Servidor</th>
                                                <th className="px-4 py-3 font-bold">Matrícula</th>
                                                <th className="px-4 py-3 font-bold">Cargo</th>
                                                <th className="px-4 py-3 font-bold">Função</th>
                                                <th className="px-4 py-3 font-bold">Carga Horária</th>
                                                <th className="px-4 py-3 font-bold">Unidade de Atuação</th>
                                                <th className="px-4 py-3 font-bold">Início</th>
                                                <th className="px-4 py-3 font-bold">Expedição</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMyTasks.map((task) => (
                                                <tr key={task.id} className="bg-white border-b hover:bg-slate-50">
                                                    <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{task.servidor}</td>
                                                    <td className="px-4 py-3">{task.matricula}</td>
                                                    <td className="px-4 py-3">{task.cargo}</td>
                                                    <td className="px-4 py-3">{task.funcao}</td>
                                                    <td className="px-4 py-3">{task.cargaHoraria}</td>
                                                    <td className="px-4 py-3">{task.entrada}</td> {/* Como ele já trabalha lá, a entrada é a unidade atual */}
                                                    <td className="px-4 py-3">{task.inicio}</td>
                                                    <td className="px-4 py-3">{task.expedicao}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    Nenhum encaminhamento sob sua gestão no momento.
                                </div>
                            )}
                        </div>
                    )}

                    {currentTab === 'todas' && (
                        /* VISUALIZAÇÃO GERAL EM CARDS (Mostra tudo para gerenciamento rápido) */
                        filteredMyTasks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredMyTasks.map((task) => (
                                    <Link key={task.id} to={`/tarefas/${task.id}`}>
                                        <TaskCard task={task} isOwned={true} onAssumirTarefa={handleAssumirTarefa} />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 text-lg">Você ainda não assumiu nenhuma tarefa.</p>
                            </div>
                        )
                    )}
                </section>
            ) : (
                /* Seção Tarefas Disponíveis (Mantida intacta) */
                <section className="animate-in fade-in duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <button className="text-2xl font-bold text-movi-dark cursor-pointer hover:bg-movi-cyan hover:text-white px-4 py-2 rounded-lg" onClick={() => setShowMyTasks(false)}>
                            Tarefas Disponíveis
                        </button>
                        <span className="bg-movi-cyan text-white text-xs px-2 py-1 rounded-full">
                            {tasks.length}
                        </span>
                    </div>

                    {tasks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tasks.map((task) => (
                                <TaskCard key={task.id} task={task} isOwned={false} onAssumirTarefa={handleAssumirTarefa} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 text-lg">Nenhuma tarefa disponível no momento.</p>
                            <p className="text-sm text-slate-300">O sistema está atualizado com o e-Cidade.</p>
                        </div>
                    )}
                </section>
            )}
        </>
    );
}