import { useState } from 'react'

export default function Carrinho({ itens, aoFechar }) {
    const [cep, setCep] = useState('')
    const [frete, setFrete] = useState(null)

    const totalProdutos = itens.reduce((acc, item) => acc + item.preco, 0)

    const calcularFrete = () => {
        if (cep.length < 8) {
            alert('Digite um CEP válido!')
            return
        }
        const valorSimulado = Math.random() * (25 - 10) + 10
        setFrete(valorSimulado)
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20" onClick={aoFechar}></div>

            <div className="modalDireito relative">
                <div className="carrinhoHeader">
                    <h2 className="tituloMinimal text-xs tracking-[0.2em] font-bold">MINHA SACOLA</h2>
                    <button onClick={aoFechar} className="hover:opacity-50 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                <div className="carrinhoItens">
                    {itens.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <p className="text-sm tracking-widest uppercase">Sua sacola está vazia</p>
                            <button onClick={aoFechar} className="mt-4 text-[10px] underline">Começar a Comprar</button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {itens.map((item, index) => (
                                <div key={index} className="flex gap-4 group">
                                    <div className="w-20 h-24 bg-cinzaLimpo overflow-hidden">
                                        <img
                                            src={item.imageurl || item.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200'}
                                            alt={item.nome}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold uppercase text-[10px] tracking-widest">{item.nome}</h4>
                                        <p className="text-sm mt-1">R$ {item.preco}</p>
                                        <p className="text-[9px] opacity-40 uppercase mt-1">TAMANHO: {item.tamanho}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {itens.length > 0 && (
                    <div className="carrinhoFooter">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] uppercase tracking-widest opacity-60">Subtotal</span>
                            <span className="text-lg font-bold">R$ {totalProdutos.toFixed(2)}</span>
                        </div>

                        <div className="mt-4 p-4 bg-cinzaLimpo rounded mb-6">
                            <h4 className="text-[9px] font-bold uppercase mb-2 tracking-widest">Simular Frete</h4>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="CEP"
                                    className="flex-1 bg-white border border-bordaSuave p-2 text-[10px] outline-none"
                                    value={cep}
                                    onChange={(e) => setCep(e.target.value)}
                                />
                                <button onClick={calcularFrete} className="btnMinimal px-4 py-2">Calcular</button>
                            </div>
                            {frete && (
                                <p className="mt-2 text-[10px] text-rosaPetite">Frete: R$ {frete.toFixed(2)}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <button className="btnMinimal w-full py-4 bg-black text-white text-[11px]">
                                FINALIZAR COMPRA
                            </button>
                            <button onClick={aoFechar} className="w-full py-4 text-[10px] tracking-widest uppercase border border-bordaSuave hover:bg-cinzaLimpo">
                                CONTINUAR COMPRANDO
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
