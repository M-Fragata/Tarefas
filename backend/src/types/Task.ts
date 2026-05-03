export interface Task {
    id: string;
    servidor: string;
    matricula: number;
    entrada: string;
    emailEntrada: string;
    saida: string | null;
    isTotal: Boolean | null;
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
}