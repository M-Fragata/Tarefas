import { useState } from 'react';
import { Outlet, Link, useLocation } from "react-router";
import { 
    Menu, X, LogOut, LayoutDashboard, ClipboardList, 
    Users, History, FileUp, FileText, Settings 
} from 'lucide-react';

export function LayoutPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    function handleLogout() {
        localStorage.removeItem("@educ:user");
        localStorage.removeItem("@educ:token");
        window.location.href = "/";
    }

    // Sub-componente para os itens do menu
    function MenuItem({ icon, text, to, active }: { icon: any, text: string, to: string, active: boolean }) {
        return (
            <Link to={to}>
                <div className={`
                    flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all
                    ${active ? 'bg-white/20 text-white shadow-inner' : 'hover:bg-white/10 text-white/70 hover:text-white'}
                `}>
                    {icon}
                    {isSidebarOpen && <span className="font-medium whitespace-nowrap">{text}</span>}
                </div>
            </Link>
        );
    }

    return (
        <div className="min-h-screen  flex min-w-0">
            {/* SIDEBAR REUTILIZÁVEL */}
            <aside className={`bg-movi-blue text-white transition-all duration-300 shadow-xl flex flex-col sticky top-0 h-screen ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                    {isSidebarOpen && <span className="text-xl font-bold tracking-wider">MoviAI</span>}
                    <button onClick={toggleSidebar} className="p-1 hover:bg-white/10 rounded-lg transition-colors hover:cursor-pointer">
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <nav className="flex-1 mt-6 px-4 space-y-2">
                    <MenuItem 
                        icon={<LayoutDashboard size={20} />} 
                        text="Dashboard" 
                        to="/" 
                        active={location.pathname === "/"} 
                    />
                    <MenuItem 
                        icon={<ClipboardList size={20} />} 
                        text="Tarefas" 
                        to="/tarefas" 
                        active={location.pathname.includes("/tarefas")} 
                    />
                    <MenuItem 
                        icon={<Users size={20} />} 
                        text="Quadros" 
                        to="/quadro/:id" 
                        active={location.pathname.includes("/quadro/")} 
                    />
                    <MenuItem 
                        icon={<History size={20} />} 
                        text="Movimentações" 
                        to="/movimentacoes" 
                        active={false} 
                    />
                    <MenuItem icon={<FileUp size={20} />} text="Importar" to="/importar" active={false} />
                    <MenuItem icon={<FileText size={20} />} text="Memorandos" to="/memorandos" active={false} />
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <MenuItem icon={<Settings size={20} />} text="Configurações" to="/settings" active={false} />
                    <button
                        className="w-full flex items-center gap-4 p-3 hover:bg-movi-error/20 text-movi-error rounded-lg transition-all group"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Sair</span>}
                    </button>
                </div>
            </aside>

            {/* ÁREA DE CONTEÚDO (Onde as páginas aparecem) */}
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-8 bg-movi-paper">
                    <Outlet />
                </main>
                
                {/* FOOTER PADRÃO */}
                <footer className="p-3 bg-white border-t border-gray-100 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} SEMED Maricá. Todos os direitos reservados.
                </footer>
            </div>
        </div>
    );
}