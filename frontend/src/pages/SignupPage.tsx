import { useActionState, useState } from 'react';
import { z } from 'zod';

// Schema de validação com Zod
const signupSchema = z.object({
    fullName: z.string()
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(100, 'Nome não pode exceder 100 caracteres'),
    email: z
        .email('Email inválido'),
    password: z.string()
        .min(8, 'Senha deve ter no mínimo 8 caracteres')
        .max(20, 'Senha não pode exceder 20 caracteres'),
    confirmPassword: z.string()
})


export function SignUpPage() {
    const [state, formAction, isPending] = useActionState(HandleSignup, {
        message: null,
        payload: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Server Action para criar conta
    async function HandleSignup(_: any, formData: FormData) {

        const payload = {
            fullName: formData.get('fullName') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string
        };

        try {

            // Validar com Zod
            const signup = signupSchema.parse(payload)

            if (signup.password !== signup.confirmPassword) {
                return { message: "Senhas diferentes", payload }
            }

            const response = await fetch("http://localhost:3333/users",{
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(signup)
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                return { 
                    message: data.message || data.error || "Erro ao cadastrar, tente novamente em alguns segundos!", 
                    payload 
                }
            }
            
            alert("Cadastro realizado com sucesso!")
            window.location.href = "/"
            return { message: null, payload: null }
        } catch (error) {
            if (error instanceof z.ZodError) {
                return { message: error.issues[0].message, payload }
            }

            return { message: "Erro ao cadastrar, tente novamente em alguns segundos!", payload }
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

                    {/* Benefícios */}
                    <div className="space-y-3">
                        <p className="text-movi-white font-semibold text-sm md:text-base">Por que se cadastrar?</p>
                        <div className="space-y-2 text-left text-blue-100 text-xs md:text-sm">
                            <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-movi-success" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Acesso seguro a seus dados</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-movi-success" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Gerenciar sua carreira</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-movi-success" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Acompanhar movimentações</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção Formulário - Rodapé (80% mobile) / Direita (50% desktop) */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-movi-paper md:bg-white min-h-[80vh] md:min-h-screen">
                <div className="w-full max-w-md space-y-6">
                    {/* Título do Formulário */}
                    <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-movi-dark-text">
                            Criar Conta
                        </h2>
                        <p className="text-movi-dark-text text-opacity-70 text-sm">
                            Preencha os dados para se registrar no sistema
                        </p>
                    </div>

                    {/* Mensagem de Sucesso/Erro */}
                    {state.message && (
                        <div className={`p-4 rounded-lg text-sm font-medium ${state.message.includes('sucesso')
                            ? 'bg-movi-success bg-opacity-10 text-movi-success border border-movi-success border-opacity-30'
                            : 'bg-movi-error bg-opacity-10 text-movi-error border border-movi-error border-opacity-30'
                            }`}>
                            {state.message}
                        </div>
                    )}

                    {/* Formulário */}
                    <form action={formAction} className="space-y-5">
                        {/* Campo Nome Completo */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-movi-dark-text">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-movi-cyan focus:border-transparent outline-none transition-all duration-200 text-movi-dark-text placeholder-slate-400 `}
                                placeholder="João da Silva Santos"
                                required
                                defaultValue={state.payload?.fullName}
                            />
                        </div>

                        {/* Campo Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-movi-dark-text">
                                Email Institucional
                            </label>
                            <input
                                type="email"
                                name="email"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-movi-cyan focus:border-transparent outline-none transition-all duration-200 text-movi-dark-text placeholder-slate-400 `}
                                placeholder="joao.silva@marica.rj.gov.br"
                                required
                                defaultValue={state.payload?.email}
                            />
                        </div>

                        {/* Campo Senha */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-movi-dark-text">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-movi-cyan focus:border-transparent outline-none transition-all duration-200 text-movi-dark-text placeholder-slate-400 pr-10 `}
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                    defaultValue={state.payload?.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-movi-dark-text text-opacity-50 hover:text-opacity-70 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" fillRule="evenodd" />
                                            <path d="M15.171 13.591l1.33 1.33a10.003 10.003 0 01-13.921-1.209 9.867 9.867 0 012.441-2.261l1.263 1.263a4 4 0 005.45 5.45z" clipRule="evenodd" fillRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-movi-dark-text text-opacity-60 mt-1">
                                Mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número
                            </p>
                        </div>

                        {/* Campo Confirmar Senha */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-movi-dark-text">
                                Confirmar Senha
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-movi-cyan focus:border-transparent outline-none transition-all duration-200 text-movi-dark-text placeholder-slate-400 pr-10 `}
                                    placeholder="Confirme sua senha"
                                    required
                                    defaultValue={state.payload?.confirmPassword}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3.5 text-movi-dark-text text-opacity-50 hover:text-opacity-70 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" fillRule="evenodd" />
                                            <path d="M15.171 13.591l1.33 1.33a10.003 10.003 0 01-13.921-1.209 9.867 9.867 0 012.441-2.261l1.263 1.263a4 4 0 005.45 5.45z" clipRule="evenodd" fillRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Checkbox Termos */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 text-movi-blue bg-white border-slate-300 rounded focus:ring-2 focus:ring-movi-cyan cursor-pointer mt-0.5"
                                required
                            />
                            <label htmlFor="terms" className="text-xs text-movi-dark-text cursor-pointer">
                                Concordo com os <a href="#" className="text-movi-blue hover:text-movi-cyan font-semibold">Termos de Serviço</a> e <a href="#" className="text-movi-blue hover:text-movi-cyan font-semibold">Política de Privacidade</a>
                            </label>
                        </div>

                        {/* Botão Criar Conta */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-gradient-to-r from-movi-blue to-movi-cyan hover:from-movi-cyan hover:to-movi-blue text-movi-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Criando conta...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Criar Conta
                                </>
                            )}
                        </button>
                    </form>

                    {/* Rodapé */}
                    <div className="pt-6 border-t border-slate-200 text-center space-y-3">
                        <p className="text-sm text-movi-dark-text">
                            Já tem conta?{' '}
                            <a href="/" className="text-movi-blue hover:text-movi-cyan font-semibold transition-colors">
                                Faça login
                            </a>
                        </p>
                        <p className="text-xs text-movi-dark-text text-opacity-50">
                            Precisa de ajuda? <a href="#" className="text-movi-blue hover:text-movi-cyan font-semibold">Contate o suporte</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}