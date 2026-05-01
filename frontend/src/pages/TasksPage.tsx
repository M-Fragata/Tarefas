import { useState, useEffect } from 'react';
import { Link } from "react-router";

import { ClipboardList, } from 'lucide-react';

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

    return (
        <>
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
        </>
    );
}