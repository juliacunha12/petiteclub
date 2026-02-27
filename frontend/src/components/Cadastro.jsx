import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Cadastro({ aoSucesso }) {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [dataNascimento, setDataNascimento] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [mensagem, setMensagem] = useState('')
    const [carregando, setCarregando] = useState(false)

    const lidarComCadastro = async (e) => {
        e.preventDefault()
        if (senha !== confirmarSenha) {
            setMensagem('As senhas não coincidem!')
            return
        }

        try {
            setCarregando(true)
            setMensagem('')

            const { error } = await supabase.auth.signUp({
                email,
                password: senha,
                options: {
                    data: {
                        nome_completo: nome,
                        data_nascimento: dataNascimento
                    }
                }
            })

            if (error) throw error

            setMensagem('Cadastro realizado! Verifique seu e-mail.')
            if (aoSucesso) aoSucesso()
        } catch (error) {
            setMensagem('Erro: ' + error.message)
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="efeitoVidro p-8 max-w-md mx-auto mt-10">
            <h2 className="tituloMinimal text-2xl mb-6 text-center">JOIN THE CLUB</h2>
            <form onSubmit={lidarComCadastro} className="space-y-4">
                <div>
                    <label className="block text-xs uppercase tracking-widest mb-1">Nome Completo</label>
                    <input
                        type="text"
                        className="w-full bg-white/10 border border-white/20 p-2 rounded outline-none"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-widest mb-1">E-mail</label>
                    <input
                        type="email"
                        className="w-full bg-white/10 border border-white/20 p-2 rounded outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-widest mb-1">Data de Nascimento</label>
                    <input
                        type="date"
                        className="w-full bg-white/10 border border-white/20 p-2 rounded outline-none"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-widest mb-1">Senha</label>
                    <input
                        type="password"
                        className="w-full bg-white/10 border border-white/20 p-2 rounded outline-none"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-widest mb-1">Confirmar Senha</label>
                    <input
                        type="password"
                        className="w-full bg-white/10 border border-white/20 p-2 rounded outline-none"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                    />
                </div>
                <button disabled={carregando} className="btnMinimal w-full mt-4 bg-black text-white">
                    {carregando ? 'PROCESSANDO...' : 'CADASTRAR'}
                </button>
                {mensagem && <p className="text-center text-[10px] uppercase tracking-widest mt-4 text-rosaPetite">{mensagem}</p>}
            </form>
        </div>
    )
}
