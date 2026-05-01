import { useState } from 'react';
import { 
  ClipboardList, AlertCircle, History, FileText, 
  Menu, X, LogOut, LayoutDashboard, FileUp, Settings, Users 
} from 'lucide-react';

export function MainPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    function handleLogout(){
        localStorage.removeItem("@educ:user")
        localStorage.removeItem("@educ:token")

        window.location.href="/"
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
                    <MenuItem icon={<LayoutDashboard size={20} />} text="Dashboard" isOpen={isSidebarOpen} active />
                    <a href="/tarefas">
                        <MenuItem icon={<ClipboardList size={20} />} text="Tarefas" isOpen={isSidebarOpen} />
                    </a>
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
                    <button className="w-full flex items-center gap-4 p-3 hover:bg-movi-error/20 text-movi-error rounded-lg transition-all group"
                    onClick={() => {handleLogout()}}>
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Sair</span>}
                    </button>
                </div>
            </aside>

            {/* CONTEÚDO PRINCIPAL */}
            <main className="flex-1 p-8">
                {/* Cabeçalho da Página */}
                <header className="mb-8">
                    <h2 className="text-2xl font-bold text-movi-dark">Visão Geral</h2>
                    <p className="text-slate-500">Bem-vindo ao painel de controle da SEMED.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Seus Cards de Resumo */}
                    <StatusCard 
                        title="Pendentes" 
                        value="14" 
                        icon={<ClipboardList />} 
                        color="movi-blue" 
                        description="Aguardando atribuição" 
                    />
                    <StatusCard 
                        title="Erros RPA" 
                        value="03" 
                        icon={<AlertCircle />} 
                        color="movi-error" 
                        description="Falha na sincronização e-Cidade" 
                    />
                    <StatusCard 
                        title="Histórico" 
                        value="128" 
                        icon={<History />} 
                        color="movi-success" 
                        description="Concluídos este mês" 
                    />
                    <StatusCard 
                        title="Drafts IA" 
                        value="09" 
                        icon={<FileText />} 
                        color="movi-dark" 
                        description="Memorandos para revisão" 
                    />
                </div>

                {/* Aqui entrará sua tabela de servidores em breve... */}
            </main>
        </div>
    );
}

/* Sub-componentes para manter o código limpo */

function MenuItem({ icon, text, isOpen, active = false }: any) {
    return (
        <div className={`
            flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all
            ${active ? 'bg-white/20 text-white shadow-inner' : 'hover:bg-white/10 text-white/70 hover:text-white'}
        `}>
            {icon}
            {isOpen && <span className="font-medium whitespace-nowrap">{text}</span>}
        </div>
    );
}

function StatusCard({ title, value, icon, color, description }: any) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border-t-4 border-${color} p-5 hover:shadow-md transition-shadow cursor-pointer`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
                    <h3 className={`text-3xl font-extrabold text-${color} mt-1`}>{value}</h3>
                </div>
                <div className={`p-2 bg-slate-50 rounded-lg text-${color}`}>
                    {icon}
                </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 font-medium">{description}</p>
        </div>
    );
}