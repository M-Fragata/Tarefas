import { useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard, ClipboardList, Users, History, FileUp, FileText, Settings, Plus, Trash2 } from 'lucide-react';
import { TimetableCard } from '../components/TimetableCard';

const DISCIPLINAS = ['Português', 'Matemática', 'História', 'Ciências', 'Geografia', 'Artes', 'Inglês', 'Ed. Física'];

export function CarenciasPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [disciplinaAtiva, setDisciplinaAtiva] = useState('Português');
  
  // Estado para controlar quantos pares de grades existem
  const [grades, setGrades] = useState([{ id: 1 }]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Adiciona um novo par de Manhã/Tarde
  const adicionarGrade = () => {
    setGrades([...grades, { id: Date.now() }]);
  };

  // Remove um par específico
  const removerGrade = (id: number) => {
    if (grades.length > 1) {
      setGrades(grades.filter(g => g.id !== id));
    }
  };

  function handleLogout() {
    localStorage.removeItem("@educ:user");
    localStorage.removeItem("@educ:token");
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-movi-paper flex">
      {/* SIDEBAR (Mantida conforme seu código) */}
      <aside className={`bg-movi-blue text-white transition-all duration-300 shadow-xl flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          {isSidebarOpen && <span className="text-xl font-bold tracking-wider">MoviAI</span>}
          <button onClick={toggleSidebar} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <MenuItem icon={<LayoutDashboard size={20} />} text="Dashboard" isOpen={isSidebarOpen} />
          <a href="/tarefas">
              <MenuItem icon={<ClipboardList size={20} />} text="Tarefas" isOpen={isSidebarOpen} />
          </a>
          <MenuItem icon={<Users size={20} />} text="Carências" isOpen={isSidebarOpen} active />
          <MenuItem icon={<History size={20} />} text="Movimentações" isOpen={isSidebarOpen} />
          <MenuItem icon={<FileUp size={20} />} text="Importar Planilha" isOpen={isSidebarOpen} />
          <MenuItem icon={<FileText size={20} />} text="Memorandos IA" isOpen={isSidebarOpen} />
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <MenuItem icon={<Settings size={20} />} text="Configurações" isOpen={isSidebarOpen} />
          <button className="w-full flex items-center gap-4 p-3 hover:bg-movi-error/20 text-movi-error rounded-lg transition-all" onClick={handleLogout}>
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-hidden">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-movi-dark mb-2">Carências</h2>
            <p className="text-gray-600">Gerencie as carências de docentes por disciplina</p>
          </div>
        </header>

        {/* Abas de Disciplinas */}
        <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-wrap gap-0 border-b-2 border-gray-200">
            {DISCIPLINAS.map((disciplina) => (
              <button
                key={disciplina}
                onClick={() => setDisciplinaAtiva(disciplina)}
                className={`px-4 py-3 font-semibold text-sm transition-all ${
                  disciplinaAtiva === disciplina
                    ? 'text-white bg-movi-blue border-b-4 border-movi-blue'
                    : 'text-gray-700 hover:text-movi-blue hover:bg-gray-50'
                }`}
              >
                {disciplina}
              </button>
            ))}
          </div>
        </div>

{/* ÁREA DAS GRADES */}
<div className="space-y-12 w-full">
  {grades.map((grade) => (
    <div key={grade.id} className="relative group w-full">
      {/* Botão de remover (ajustado para ficar dentro do limite visual) */}
      {grades.length > 1 && (
        <button 
          onClick={() => removerGrade(grade.id)}
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <Trash2 size={16} />
        </button>
      )}
      
      {/* 
          ESTA DIV É A CHAVE: 
          - overflow-x-auto: cria o scroll interno
          - w-full: limita a largura ao container pai (main)
      */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 overflow-x-auto">
        <div className="flex flex-row gap-6 min-w-min"> 
          {/* 
            min-w-min: garante que os filhos mantenham seu tamanho 
            mínimo sem esmagar, forçando o scroll na div acima.
          */}
          
          <div className="min-w-[500px] flex-1">
            <TimetableCard turno="Manhã" disciplina={disciplinaAtiva} />
          </div>

          <div className="min-w-[500px] flex-1">
            <TimetableCard turno="Tarde" disciplina={disciplinaAtiva} />
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

        {/* BOTÃO PARA GERAR MAIS */}
        <div className="mt-12 flex justify-center">
          <button 
            onClick={adicionarGrade}
            className="flex items-center gap-2 bg-movi-blue hover:bg-movi-cyan text-white px-8 py-4 rounded-full font-bold shadow-xl transition-all transform hover:scale-105"
          >
            <Plus size={24} />
            ADICIONAR NOVO QUADRO (MANHÃ/TARDE)
          </button>
        </div>
      </main>
    </div>
  );
}

function MenuItem({ icon, text, isOpen, active = false }: any) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${active ? 'bg-white/20 text-white shadow-inner' : 'hover:bg-white/10 text-white/70 hover:text-white'}`}>
      {icon}
      {isOpen && <span className="font-medium whitespace-nowrap">{text}</span>}
    </div>
  );
}