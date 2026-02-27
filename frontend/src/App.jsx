import { useState, useEffect } from 'react'
import './index.css'
import { supabase } from './supabaseClient'
import Login from './components/Login'
import Cadastro from './components/Cadastro'
import Carrinho from './components/Carrinho'

function App() {
  const [produtos, setProdutos] = useState([])
  const [estaCarregando, setEstaCarregando] = useState(true)
  const [sessao, setSessao] = useState(null)
  const [telaAtual, setTelaAtual] = useState('home')
  const [carrinho, setCarrinho] = useState([])
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false)
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState({})
  const [categoriaAtiva, setCategoriaAtiva] = useState('Ver Tudo')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session)
    })

    buscarProdutos()

    return () => subscription.unsubscribe()
  }, [])

  const buscarProdutos = async () => {
    try {
      const { data, error } = await supabase.from('produtos').select('*')
      if (error) throw error
      setProdutos(data || [])
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setEstaCarregando(false)
    }
  }

  const adicionarAoCarrinho = (produtoModelo) => {
    const tamanho = tamanhoSelecionado[produtoModelo.nome] || produtoModelo.tamanho
    const itemFinal = { ...produtoModelo, tamanho }
    setCarrinho([...carrinho, itemFinal])
    setMostrarCarrinho(true)
  }

  const handleSelecaoTamanho = (nomeModelo, tamanho) => {
    setTamanhoSelecionado(prev => ({ ...prev, [nomeModelo]: tamanho }))
  }

  const produtosFiltrados = produtos.filter(p =>
    categoriaAtiva === 'Ver Tudo' || p.categoria === categoriaAtiva || (categoriaAtiva === 'Outlet' && p.preco < 100)
  )

  const produtosPorModelo = produtosFiltrados.reduce((acc, produto) => {
    if (!acc.find(p => p.nome === produto.nome)) {
      acc.push(produto)
    }
    return acc
  }, [])

  const renderizarConteudo = () => {
    if (telaAtual === 'login') return <Login aoSucesso={() => setTelaAtual('home')} />
    if (telaAtual === 'cadastro') return <Cadastro aoSucesso={() => setTelaAtual('login')} />

    return (
      <div className="gridProdutos">
        {estaCarregando ? (
          <div className="col-span-full text-center py-20 uppercase tracking-widest text-xs opacity-50">Carregando coleção...</div>
        ) : produtosPorModelo.length === 0 ? (
          <div className="col-span-full text-center p-20 bg-cinzaLimpo">
            <p className="uppercase tracking-widest text-sm">Nenhum item encontrado nesta categoria.</p>
          </div>
        ) : (
          produtosPorModelo.map((produto) => (
            <div key={produto.id} className="cardProdutoClean">
              <div className="imgContainer">
                <img
                  src={produto.imageurl || produto.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop'}
                  alt={produto.nome}
                />
              </div>
              <div className="mt-4">
                <h3 className="text-[10px] uppercase font-bold tracking-widest text-textoCorpo">{produto.nome}</h3>
                <p className="font-bold text-sm mt-1">R$ {produto.preco}</p>

                <div className="seletorTamanho">
                  {['PP', 'P'].map(t => (
                    <div
                      key={t}
                      onClick={() => handleSelecaoTamanho(produto.nome, t)}
                      className={`radioTamanho ${(tamanhoSelecionado[produto.nome] || produto.tamanho) === t ? 'ativo' : ''}`}
                    >
                      {t}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="btnMinimal w-full mt-4"
                >
                  Adicionar à Sacola
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="bannerTopo">
        SUMMER OUTLET: Até 60% off + Frete Grátis
      </div>

      <nav className="headerPatBo">
        <div className="navLinks">
          <button onClick={() => { setTelaAtual('home'); setCategoriaAtiva('Ver Tudo'); }}>VER TUDO</button>
          <button onClick={() => document.getElementById('campanha').scrollIntoView()}>CAMPANHAS</button>
        </div>

        <h1
          className="logoCentral cursor-pointer"
          onClick={() => { setTelaAtual('home'); setCategoriaAtiva('Ver Tudo'); }}
        >
          petiteclub
        </h1>

        <div className="userIcons">
          {sessao ? (
            <button onClick={() => supabase.auth.signOut()} title="Sair">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </button>
          ) : (
            <button onClick={() => setTelaAtual('login')} title="Login">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </button>
          )}
          <button title="Buscar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </button>
          <button title="Favoritos">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.046 3 5.5L12 21l7-7Z" /></svg>
          </button>
          <div className="relative cursor-pointer" onClick={() => setMostrarCarrinho(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            {carrinho.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-black text-white px-1 rounded-full text-[8px] font-bold">
                {carrinho.length}
              </span>
            )}
          </div>
        </div>
      </nav>

      {telaAtual === 'home' && (
        <>
          <section id="campanha" className="heroSection">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000&auto=format&fit=crop"
              alt="Coleção petiteclub"
            />
            <div className="heroContent">
              <h2 className="tituloMinimal text-6xl mb-6 tracking-[0.4em]">petiteclub</h2>
              <p className="uppercase tracking-[0.8em] text-[10px] font-light">Moda cuidada para quem veste PP & P</p>
              <button
                onClick={() => document.getElementById('vitrine').scrollIntoView()}
                className="mt-10 px-12 py-4 border border-white bg-transparent hover:bg-white hover:text-black transition uppercase text-[10px] tracking-[0.3em]"
              >
                VER COLEÇÃO
              </button>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-6 py-20 text-center">
            <p className="tituloMinimal text-xs text-rosaPetite mb-8">Nossa Curadoria</p>
            <h3 className="text-4xl font-light leading-tight">
              O <strong>petiteclub</strong> é o destino final para o caimento perfeito.
              Selecionamos peças que abraçam biotipos menores com o luxo e a atitude que eles merecem.
            </h3>
          </section>

          <section className="max-w-6xl mx-auto px-6 py-20">
            <h4 className="tituloMinimal text-[10px] mb-12 opacity-50">Destaques da Temporada</h4>
            <div className="gridAnuncios">
              <div className="anuncioItem">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop" alt="Vestidos Petite" />
                <div className="anuncioTexto">
                  <p className="text-[10px] uppercase tracking-widest">Nova Coleção</p>
                  <h5 className="text-lg font-bold">VESTIDOS</h5>
                </div>
              </div>
              <div className="anuncioItem">
                <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop" alt="Looks Petite" />
                <div className="anuncioTexto">
                  <p className="text-[10px] uppercase tracking-widest">Essenciais PP</p>
                  <h5 className="text-lg font-bold">LOOKS DO DIA</h5>
                </div>
              </div>
              <div className="anuncioItem">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000" alt="Moda Feminina PP" />
                <div className="anuncioTexto">
                  <p className="text-[10px] uppercase tracking-widest">Caimento Perfeito</p>
                  <h5 className="text-lg font-bold">FEITO PRA VOCÊ</h5>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <div id="vitrine" className={telaAtual === 'home' ? "layoutMain" : "max-w-6xl mx-auto p-20"}>
        {telaAtual === 'home' && (
          <aside className="sidebar">
            <h3>BRAND CATALOG</h3>
            <ul className="space-y-4">
              <li
                className={`cursor-pointer transition-all ${categoriaAtiva === 'Ver Tudo' ? 'font-bold border-b border-black pb-1' : 'opacity-70'}`}
                onClick={() => setCategoriaAtiva('Ver Tudo')}
              >
                Ver Tudo
              </li>
              {['Vestidos', 'Blusas & Tops', 'Calças', 'Shorts & Saias', 'Casacos'].map(cat => (
                <li
                  key={cat}
                  className={`cursor-pointer transition-all ${categoriaAtiva === cat ? 'font-bold' : 'opacity-70 hover:opacity-100'}`}
                  onClick={() => setCategoriaAtiva(cat)}
                >
                  {cat}
                </li>
              ))}
              <li
                className={`text-rosaPetite mt-10 cursor-pointer ${categoriaAtiva === 'Outlet' ? 'font-bold underline' : 'opacity-70 hover:opacity-100'}`}
                onClick={() => setCategoriaAtiva('Outlet')}
              >
                SALE %
              </li>
            </ul>
          </aside>
        )}

        <section>
          <div className="flex justify-between items-center mb-16">
            <h2 className="tituloMinimal text-[10px] opacity-40">{categoriaAtiva.toUpperCase()}</h2>
            <span className="text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:opacity-50 transition-opacity">Filtrar ↡</span>
          </div>
          {renderizarConteudo()}
        </section>
      </div>

      {telaAtual === 'home' && (
        <section className="secaoBrand">
          <div className="secaoBrandConteudo">
            <h2 className="tituloMinimal" style={{ fontSize: '0.65rem', color: 'var(--rosaPetite)', letterSpacing: '0.5em', marginBottom: '10px' }}>THE BRAND</h2>
            <p style={{ fontSize: '2.2rem', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.4, fontFamily: 'Cormorant Garamond, serif', margin: 0 }}>
              "Moda feita para abraçar quem você é — do caimento ao acabamento."
            </p>
            <p style={{ fontSize: '1rem', opacity: 0.7, lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
              O petiteclub existe para quem nunca encontrou a peça certa. Somos uma curadoria exclusiva de moda PP e P,
              onde cada peça é escolhida pelo caimento, pela qualidade e pelo estilo. Sem adaptações, sem ajustes — só o perfeito.
            </p>
            <p style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '10px', opacity: 0.5 }}>Lifestyle Curated in Brasil</p>
          </div>
        </section>
      )}

      <a href="https://wa.me/5562999776464" target="_blank" className="contatoWhatsApp" title="Fale Conosco no WhatsApp">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      <footer className="py-20 bg-white border-t border-bordaSuave">
        <div className="max-w-6xl mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-12 text-[10px] tracking-widest uppercase opacity-60">
          <div>
            <h4 className="font-bold mb-6 text-black">AJUDA</h4>
            <ul className="space-y-3">
              <li>Minha Conta</li>
              <li>Trocas e Devoluções</li>
              <li>Envio e Prazos</li>
              <li>Fale Conosco</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-black">CURADORIA</h4>
            <ul className="space-y-3">
              <li>Novidades</li>
              <li>Best Sellers</li>
              <li>Guia de Tamanhos</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-black">LEGAL</h4>
            <ul className="space-y-3">
              <li>Privacidade</li>
              <li>Termos de Uso</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-black">SOCIAL</h4>
            <p className="mb-4">@PETITECLUB.CC</p>
            <p>petiteclub &copy; 2026 - GOIÂNIA, BRASIL</p>
          </div>
        </div>
      </footer>

      {mostrarCarrinho && (
        <Carrinho
          itens={carrinho}
          aoFechar={() => setMostrarCarrinho(false)}
        />
      )}
    </div>
  )
}

export default App
