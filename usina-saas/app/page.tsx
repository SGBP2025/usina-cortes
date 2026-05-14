import Link from "next/link";

const PACKS = [
  {
    id: "pack_30",
    label: "Starter",
    minutes: 30,
    price: 19.9,
    highlight: false,
    perMinute: "R$0,66/min",
    description: "Ideal para começar",
    equivalent: "≈ 1 episódio de podcast ou palestra",
    perks: [
      "Processa vídeos com até 30 min de duração",
      "Cortes automáticos com IA",
      "Transcrição + legendas inclusas",
      "Descrições prontas por rede",
      "Download em MP4",
    ],
  },
  {
    id: "pack_100",
    label: "Pro",
    minutes: 100,
    price: 49.9,
    highlight: true,
    perMinute: "R$0,50/min",
    description: "Para criadores ativos",
    equivalent: "≈ 3 a 4 episódios ou aulas",
    perks: [
      "Processa vídeos com até 100 min de duração",
      "Tudo do Starter",
      "Economia de 25% por minuto",
      "Prioridade na fila",
      "Suporte por e-mail",
    ],
  },
  {
    id: "pack_300",
    label: "Business",
    minutes: 300,
    price: 119.9,
    highlight: false,
    perMinute: "R$0,40/min",
    description: "Para agências e alto volume",
    equivalent: "≈ uma semana de conteúdo",
    perks: [
      "Processa vídeos com até 300 min de duração",
      "Tudo do Pro",
      "Melhor custo por minuto",
      "Processamento simultâneo",
      "Suporte prioritário",
    ],
  },
];

const STEPS = [
  {
    num: "01",
    title: "Sobe o vídeo",
    desc: "Podcast, palestra, aula, entrevista — qualquer formato longo serve. Até 200 MB comprimidos no browser.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "IA identifica os momentos virais",
    desc: "A IA transcreve, analisa o contexto e seleciona os trechos com ideias completas — nada cortado pela metade.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Baixa os clipes prontos",
    desc: "MP4 com legendas, prévia inline e descrições otimizadas para TikTok, Reels e Shorts — só copiar e postar.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
];

const FAQ = [
  {
    q: "Os 30 minutos grátis têm prazo para usar?",
    a: "Não. Os minutos ficam na sua conta até serem usados — tanto os grátis quanto os comprados.",
  },
  {
    q: "Que tipos de vídeo funcionam melhor?",
    a: "Palestras, podcasts, aulas e entrevistas têm os melhores resultados — conteúdo com falas contínuas e ideias desenvolvidas. Vídeos musicais ou sem fala não são suportados.",
  },
  {
    q: "Em quanto tempo ficam prontos os clipes?",
    a: "Tipicamente 3–8 minutos para vídeos de até 30 minutos. O progresso aparece em tempo real no dashboard.",
  },
  {
    q: "Quantos clipes saem de um vídeo?",
    a: "A IA decide com base na densidade de ideias. Uma palestra de 14 minutos, por exemplo, gerou 5 clipes de alta qualidade nos nossos testes.",
  },
  {
    q: "Posso usar no celular?",
    a: "Sim, o upload e o download funcionam normalmente no mobile. Para arquivos acima de 200 MB, recomendamos o desktop.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans antialiased">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#0a0a0f]/90 backdrop-blur-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight">
              <span className="text-[#ff6b6b]">Usina</span>
              <span className="text-white"> de Cortes</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Entrar
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-zinc-300 border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-lg transition-colors hidden sm:block"
            >
              Ver preços
            </Link>
            <Link
              href="/register"
              className="text-sm bg-[#ff6b6b] hover:bg-[#ff5252] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff6b6b]/8 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold bg-[#00c896]/10 text-[#00c896] border border-[#00c896]/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c896] animate-pulse" />
            30 minutos de vídeo grátis no cadastro — sem cartão
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
            Seu vídeo longo virou{" "}
            <span className="text-[#ff6b6b]">10 Reels.</span>
            <br />
            Enquanto você dormia.
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Sobe a palestra, o podcast ou a aula. A IA transcreve, encontra os momentos virais e entrega os clipes prontos com legenda — em minutos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-[#ff6b6b] hover:bg-[#ff5252] text-white px-10 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] shadow-lg shadow-[#ff6b6b]/20"
            >
              Começar grátis →
            </Link>
            <a
              href="#pricing"
              className="w-full sm:w-auto border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white px-10 py-4 rounded-xl font-semibold text-base transition-colors"
            >
              Ver pacotes
            </a>
          </div>

          {/* Social proof mini */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-6 text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#00c896]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
              </svg>
              30 min grátis, sem cartão
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#00c896]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
              </svg>
              Sem assinatura mensal
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#00c896]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
              </svg>
              Créditos não expiram
            </span>
          </div>
        </div>
      </section>

      {/* Visual mockup — antes/depois */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#12121a] border border-zinc-800 rounded-2xl p-6 md:p-10">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6 font-semibold">O que acontece com seu vídeo</p>

            {/* Input video bar */}
            <div className="mb-8">
              <p className="text-xs text-zinc-500 mb-2">
                Você envia <span className="text-zinc-400">— o vídeo completo: podcast, palestra, aula, entrevista</span>
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-12 bg-[#1a1a26] rounded-lg border border-zinc-700/50 flex items-center gap-3 px-4">
                  <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  <div className="flex-1">
                    <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-zinc-600 rounded-full" />
                    </div>
                    <p className="text-xs text-zinc-600 mt-1">podcast-ep42.mp4</p>
                  </div>
                  <span className="text-xs text-zinc-400 font-semibold shrink-0">14 min de duração</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-px bg-zinc-800" />
              <div className="flex items-center gap-2 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 rounded-full px-4 py-2">
                <svg className="w-4 h-4 text-[#ff6b6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                <span className="text-xs font-semibold text-[#ff6b6b]">IA processa</span>
              </div>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Output clips */}
            <div>
              <p className="text-xs text-zinc-500 mb-3">Você recebe</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { duration: "2m 18s", label: "Clipe viral #1", tag: "TikTok • Reels" },
                  { duration: "1m 47s", label: "Clipe viral #2", tag: "Shorts" },
                  { duration: "2m 55s", label: "Clipe viral #3", tag: "TikTok • Reels" },
                  { duration: "1m 33s", label: "Clipe viral #4", tag: "Shorts" },
                  { duration: "2m 04s", label: "Clipe viral #5", tag: "TikTok • Reels" },
                ].map((clip, i) => (
                  <div
                    key={i}
                    className="bg-[#1a1a26] border border-zinc-700/50 rounded-xl p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-[#ff6b6b]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{clip.label}</p>
                      <p className="text-xs text-zinc-500">{clip.duration} · {clip.tag}</p>
                    </div>
                  </div>
                ))}
                <div className="bg-[#0a0a0f] border border-zinc-800 border-dashed rounded-xl p-4 flex items-center justify-center">
                  <span className="text-xs text-zinc-600 text-center">+ descrições prontas<br />para cada rede</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-600 mt-6 text-center">
              Exemplo real: palestra de 14 minutos → 5 clipes em ~8 minutos de processamento
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-[#12121a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Como funciona</h2>
            <p className="text-zinc-400">Três passos. Nenhuma edição manual.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="relative bg-[#1a1a26] border border-zinc-800 rounded-2xl p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 flex items-center justify-center text-[#ff6b6b]">
                  {step.icon}
                </div>
                <span className="text-4xl font-black text-[#ff6b6b]/20 block leading-none">{step.num}</span>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">Compre uma vez, use quando quiser</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Sem assinatura. Sem mensalidade. Você compra créditos (minutos de vídeo) e usa no seu ritmo — os créditos não expiram.
            </p>
          </div>

          {/* Free trial banner */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-3 bg-[#00c896]/8 border border-[#00c896]/20 rounded-2xl px-6 py-4">
              <div className="w-10 h-10 rounded-xl bg-[#00c896]/15 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#00c896]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white">30 minutos de upload grátis no cadastro</p>
                <p className="text-xs text-zinc-400">Sobe um vídeo de até 30 min e veja os clipes saindo — sem cartão, sem pagar nada.</p>
              </div>
              <Link href="/register" className="ml-2 text-xs font-bold text-[#00c896] hover:underline whitespace-nowrap shrink-0">
                Criar conta →
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="h-px w-16 bg-zinc-800" />
            <span className="text-xs text-zinc-600 uppercase tracking-widest">Quer mais? Escolha um pacote</span>
            <div className="h-px w-16 bg-zinc-800" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PACKS.map((pack) => (
              <div
                key={pack.id}
                className={`relative rounded-2xl border p-8 space-y-6 flex flex-col transition-all ${
                  pack.highlight
                    ? "border-[#ff6b6b]/50 bg-[#ff6b6b]/5 shadow-lg shadow-[#ff6b6b]/10"
                    : "border-zinc-800 bg-[#12121a]"
                }`}
              >
                {pack.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#ff6b6b] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    Mais popular
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold">{pack.label}</h3>
                  <p className="text-sm text-zinc-500 mt-0.5">{pack.description}</p>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold">
                      R${pack.price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">
                    {pack.minutes} min de upload · <span className="text-zinc-400">{pack.perMinute}</span>
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">{pack.equivalent}</p>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {pack.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <svg className="w-4 h-4 text-[#ff6b6b] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0Z" clipRule="evenodd" />
                      </svg>
                      {perk}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`block text-center py-3.5 rounded-xl font-bold text-sm transition-all ${
                    pack.highlight
                      ? "bg-[#ff6b6b] hover:bg-[#ff5252] text-white shadow-md shadow-[#ff6b6b]/20"
                      : "border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white"
                  }`}
                >
                  Começar com {pack.label}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-zinc-600 mt-8">
            Pagamento via Pix, cartão de crédito ou débito · Processado com segurança pelo Mercado Pago
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 bg-[#12121a]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas frequentes</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <div key={item.q} className="bg-[#1a1a26] border border-zinc-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ff6b6b]/8 blur-[100px] rounded-full" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Para de editar. <span className="text-[#ff6b6b]">Comece a postar.</span>
          </h2>
          <p className="text-zinc-400">
            Crie sua conta e ganhe 30 minutos de vídeo grátis — sem cartão, sem assinatura.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-[#ff6b6b] hover:bg-[#ff5252] text-white px-10 py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] shadow-lg shadow-[#ff6b6b]/20"
            >
              Começar grátis →
            </Link>
            <a
              href="#pricing"
              className="w-full sm:w-auto text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Ver preços primeiro
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold">
            <span className="text-[#ff6b6b]">Usina</span>
            <span className="text-zinc-500"> de Cortes</span>
          </span>
          <div className="flex items-center gap-6 text-xs text-zinc-600">
            <Link href="/login" className="hover:text-zinc-400 transition-colors">Entrar</Link>
            <Link href="/register" className="hover:text-zinc-400 transition-colors">Criar conta</Link>
            <a href="mailto:contato@usinadecortes.com.br" className="hover:text-zinc-400 transition-colors">Contato</a>
          </div>
          <span className="text-xs text-zinc-700">© 2025 Usina de Cortes Virais</span>
        </div>
      </footer>
    </div>
  );
}
