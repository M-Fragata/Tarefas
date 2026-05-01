import { useState, useEffect } from 'react';
import { Link } from "react-router";

import { Menu, X, LogOut, LayoutDashboard, ClipboardList, Users, History, FileUp, FileText, Settings } from 'lucide-react';

import { StatusCard } from "../components/StatusCard"
import { TaskCard } from '../components/taskCard';

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

export function TaskPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [myTasks, setMyTasks] = useState<Task[]>([])

    const [showMyTasks, setShowMyTasks] = useState<boolean>(false)

    function MenuItem({ icon, text, isOpen, active = false }: any) {
        return (
            <div
                className={`
        flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all
        ${active ? 'bg-white/20 text-white shadow-inner' : 'hover:bg-white/10 text-white/70 hover:text-white'}
      `}
            >
                {icon}
                {isOpen && <span className="font-medium whitespace-nowrap">{text}</span>}
            </div>
        );
    }

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


    useEffect(() => {
        handleGetTasks()
        handleMyTasks()
    }, [])
    /*
        const TaskCard = ({ task, isOwned = false }: { task: Task; isOwned?: boolean }) => (
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
                <div className="space-y-4">
                    {// Header com Nome e Matrícula } 
                    <div>
                        <h3 className="text-lg font-semibold text-movi-dark mb-1">
                            {task.servidor} - <span className='text-sm text-gray-500'>{task.matricula}</span>
                        </h3>
                    </div>
    
                    {// Badge com tipo }
                    <div className="flex justify-start">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(task.tipo)}`}>
                            <Badge size={14} />
                            {task.tipo}
                        </span>
                    </div>
    
    /                Unidades }
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
    
                    {// Botões de Ação}
                    <div className="pt-3 border-t border-gray-200">
                        {!isOwned ? (
                            <button
                                onClick={() => handleAssumirTarefa(task.id)}
                                className="w-full bg-movi-blue text-white font-medium py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 active:scale-95"
                            >
                                Assumir Tarefa
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    className="flex-1 flex items-center justify-center gap-2 bg-movi-cyan text-white font-medium py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 active:scale-95"
                                    title="Gerar memorando com auxílio de IA"
                                >
                                    <Wand2 size={18} />
                                    <span className="hidden sm:inline">Memorando (IA)</span>
                                </button>
                                <button
                                    className="flex-1 flex items-center justify-center gap-2 bg-movi-blue text-white font-medium py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 active:scale-95"
                                    title="Sincronizar dados com e-Cidade"
                                >
                                    <RefreshCw size={18} />
                                    <span className="hidden sm:inline">e-Cidade</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    */
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    function handleLogout() {
        localStorage.removeItem("@educ:user");
        localStorage.removeItem("@educ:token");
        window.location.href = "/";
    }

    return (
        <div className="min-h-screen bg-movi-paper flex">
            {/* SIDEBAR */}
            <aside className={`bg-movi-blue text-white transition-all duration-300 shadow-xl flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Header da Sidebar */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                    {isSidebarOpen && <span className="text-xl font-bold tracking-wider">MoviAI</span>}
                    <button onClick={toggleSidebar} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Itens do Menu */}
                <nav className="flex-1 mt-6 px-4 space-y-2">
                    <a href="/">
                        <MenuItem icon={<LayoutDashboard size={20} />} text="Dashboard" isOpen={isSidebarOpen} />
                    </a>
                    <MenuItem icon={<ClipboardList size={20} />} text="Tarefas" isOpen={isSidebarOpen} active />
                    <a href="/carencias">
                        <MenuItem icon={<Users size={20} />} text="Carências" isOpen={isSidebarOpen} />
                    </a>
                    <MenuItem icon={<History size={20} />} text="Movimentações" isOpen={isSidebarOpen} />
                    <MenuItem icon={<FileUp size={20} />} text="Importar Planilha" isOpen={isSidebarOpen} />
                    <MenuItem icon={<FileText size={20} />} text="Memorandos IA" isOpen={isSidebarOpen} />
                </nav>

                {/* Rodapé da Sidebar */}
                <div className="p-4 border-t border-white/10 space-y-2">
                    <MenuItem icon={<Settings size={20} />} text="Configurações" isOpen={isSidebarOpen} />
                    <button
                        className="w-full flex items-center gap-4 p-3 hover:bg-movi-error/20 text-movi-error rounded-lg transition-all group"
                        onClick={() => {
                            handleLogout();
                        }}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Sair</span>}
                    </button>
                </div>
            </aside>

            {/* CONTEÚDO PRINCIPAL */}
            <main className="flex-1 p-8">
                {/* Cabeçalho com Cards de Resumo */}
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-movi-dark mb-6">Central de Movimentações</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div onClick={() => setShowMyTasks(false)} className="cursor-pointer">
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
                    /* Seção Minhas Tarefas */
                    <section className="animate-in fade-in duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-2xl font-bold text-movi-dark">Minhas Tarefas</h3>
                            <span className="bg-movi-blue text-white text-xs px-2 py-1 rounded-full">
                                {myTasks.length}
                            </span>
                        </div>

                        {myTasks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myTasks.map((task) => (
                                    <>
                                        <Link key={task.id} to={`/tarefas/${task.id}`}>
                                            <TaskCard key={task.id} task={task} isOwned={true} onAssumirTarefa={handleAssumirTarefa}
                                            />
                                        </Link >
                                    </>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 text-lg">Você ainda não assumiu nenhuma tarefa.</p>
                                <p className="text-sm text-slate-300">Vá em "Tarefas Disponíveis" para começar.</p>
                            </div>
                        )}
                    </section>
                ) : (
                    /* Seção Tarefas Disponíveis */
                    <section className="animate-in fade-in duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-2xl font-bold text-movi-dark">Tarefas Disponíveis</h3>
                            <span className="bg-movi-cyan text-white text-xs px-2 py-1 rounded-full">
                                {tasks.length}
                            </span>
                        </div>

                        {tasks.length > 0 ? (

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tasks.map((task) => (

                                    <TaskCard key={task.id} task={task} isOwned={false} onAssumirTarefa={handleAssumirTarefa}
                                    />

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



            </main>
        </div >
    );
}