import { useState } from "react";

export function LoginPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleLogin() {
        try {

            const response = await fetch("http://localhost:3333/users/login", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    email, password
                })
            })

            if (!response.ok) alert("Erro no front")
            const data = await response.json()

            localStorage.setItem("@educ:user", JSON.stringify(data.userWithoutPassword))
            localStorage.setItem("@educ:token", JSON.stringify(data.token))

            window.location.href="/"
        } catch (error) {
            console.log(error)
            alert("Erro no back")
        }
    }

    return (
        <div className="min-h-screen bg-movi-white flex flex-col md:flex-row">
            {/* Seção Branding - Topo (20% mobile) / Esquerda (50% desktop) */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-movi-blue via-movi-cyan to-movi-blue flex flex-col items-center justify-center p-8 md:p-12 min-h-[20vh] md:min-h-screen">
                <div className="text-center space-y-6 w-full max-w-md">
                    {/* Logo/Título Principal */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-movi-white rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-10 h-10 md:w-12 md:h-12 text-movi-blue" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5M10.5 1.5v8m0 0L6 5.75m4.5 3.75L15.5 1.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-movi-white font-primary">
                            SEMED
                        </h1>
                        <p className="text-lg md:text-2xl text-blue-100 font-semibold">
                            Secretaria Municipal de Educação
                        </p>
                    </div>

                    {/* Descrição */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 md:p-6">
                        <p className="text-movi-white text-sm md:text-base leading-relaxed">
                            Portal de Gestão de Movimentação e Recursos Humanos
                        </p>
                        <p className="text-blue-100 text-xs md:text-sm mt-3">
                            Prefeitura de Maricá - Rio de Janeiro
                        </p>
                    </div>

                    {/* Badges de Informação */}
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
                            <p className="text-blue-100 text-xs md:text-sm">Segurança</p>
                            <p className="text-movi-white text-xs md:text-sm font-semibold">SSL Certificado</p>
                        </div>
                        <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
                            <p className="text-blue-100 text-xs md:text-sm">Suporte</p>
                            <p className="text-movi-white text-xs md:text-sm font-semibold">24/7 Disponível</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção Formulário - Rodapé (80% mobile) / Direita (50% desktop) */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-movi-paper md:bg-white min-h-[80vh] md:min-h-screen">
                <div className="w-full max-w-md space-y-8">
                    {/* Título do Formulário */}
                    <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-movi-dark-text">
                            Bem-vindo
                        </h2>
                        <p className="text-movi-dark-text text-opacity-70">
                            Acesse sua conta para continuar
                        </p>
                    </div>

                    {/* Formulário de Login */}
                    <form className="space-y-6">
                        {/* Campo Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-movi-dark-text">
                                E-mail Institucional
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-movi-cyan focus:border-transparent outline-none transition-all duration-200 text-movi-dark-text placeholder-slate-400"
                                placeholder="nome.sobrenome@marica.rj.gov.br"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Campo Senha */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-semibold text-movi-dark-text">
                                    Senha
                                </label>
                                <a href="#" className="text-xs text-movi-blue hover:text-movi-cyan transition-colors">
                                    Esqueceu sua senha?
                                </a>
                            </div>
                            <input
                                type="password"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-movi-cyan focus:border-transparent outline-none transition-all duration-200 text-movi-dark-text placeholder-slate-400"
                                placeholder="••••••••"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Checkbox Lembrar */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 text-movi-blue bg-white border-slate-300 rounded focus:ring-2 focus:ring-movi-cyan cursor-pointer"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-movi-dark-text cursor-pointer">
                                Manter-me conectado
                            </label>
                        </div>

                        {/* Botão Entrar */}
                        <button
                            type="button"
                            className="w-full bg-gradient-to-r from-movi-blue to-movi-cyan hover:from-movi-cyan hover:to-movi-blue text-movi-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                            onClick={() => handleLogin()}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1" />
                            </svg>
                            Entrar no Sistema
                        </button>
                    </form>

                    {/* Rodapé do Formulário */}
                    <div className="pt-6 border-t border-slate-200 text-center space-y-2">
                        <p className="text-sm text-movi-dark-text text-opacity-60">
                            Primeira vez aqui? <a href="/signup">Crie sua conta</a>
                        </p>
                    </div>

                    {/* Links Footer */}
                    <div className="flex items-center justify-center gap-4 text-xs text-movi-dark-text text-opacity-60">
                        <a href="#" className="hover:text-movi-blue transition-colors">Privacidade</a>
                        <span>•</span>
                        <a href="#" className="hover:text-movi-blue transition-colors">Termos</a>
                        <span>•</span>
                        <a href="#" className="hover:text-movi-blue transition-colors">Suporte</a>
                    </div>
                </div>
            </div>
        </div>
    );
}