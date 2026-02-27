import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login({ aoSucesso }) {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [mensagem, setMensagem] = useState('')
    const [carregando, setCarregando] = useState(false)

    const lidarComLogin = async (e) => {
        e.preventDefault()
        try {
            setCarregando(true)
            setMensagem('')
            const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
            if (error) throw error
            if (aoSucesso) aoSucesso()
        } catch (error) {
            setMensagem('Erro: ' + error.message)
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="efeitoVidro p-8 max-w-md mx-auto mt-10">
            <h2 className="tituloMinimal text-2xl mb-6 text-center uppercase tracking-widest">LOGIN</h2>
            <form onSubmit={lidarComLogin} className="space-y-4">
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
                    <label className="block text-xs uppercase tracking-widest mb-1">Senha</label>
                    <input
                        type="password"
                        className="w-full bg-white/10 border border-white/20 p-2 rounded outline-none"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                <button disabled={carregando} className="btnMinimal w-full mt-4 bg-black text-white">
                    {carregando ? 'ENTRANDO...' : 'ENTRAR'}
                </button>
                {mensagem && <p className="text-center text-[10px] uppercase tracking-widest mt-4 text-rosaPetite">{mensagem}</p>}
            </form>
        </div>
    )
}
