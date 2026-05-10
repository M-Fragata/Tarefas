import { useState, useEffect } from "react";

import { StatusCard } from "../components/StatusCard"

import {
    ClipboardList, AlertCircle, History, FileText
} from 'lucide-react';

export function MainPage() {

    const [data, setData] = useState({})

    async function handleGetCarencias() {
        try {
            const response = await fetch("http://localhost:3333/carencias", {
                headers: { "Content-type": "application/json" }
            })

            const data = await response.json()

            const disciplinas = data.reduce((acc: any, curr: any) => {
                const { disciplina } = curr;
                acc[disciplina] = (acc[disciplina] || 0) + 1;
                return acc;
            }, {});

            setData(disciplinas);


        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetCarencias()
    }, [])

    return (
        <>
            {/* Cabeçalho da Página */}
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-movi-dark">Visão Geral</h2>
                <p className="text-slate-500">Bem-vindo ao painel de controle da SEMED.</p>
            </header>
            <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(data).map(([nome, total]) => (
                        <StatusCard
                            key={nome}
                            title={nome}
                            value={String(total)}
                            icon={<ClipboardList />}
                            color="movi-blue"
                            description="Tempos em carência"
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
