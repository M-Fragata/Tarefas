import { StatusCard } from "../components/StatusCard"

import {
    ClipboardList, AlertCircle, History, FileText
} from 'lucide-react';

export function MainPage() {

    return (
        <>
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
        </>
    );
}
