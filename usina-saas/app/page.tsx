import Link from "next/link";

const plans = [
  {
    id: "starter",
    name: "Starter",
    minutes: 30,
    pricePerMin: 0.10,
    highlight: false,
    description: "Para criadores que estão começando",
    perks: [
      "30 minutos de vídeo/mês",
      "Transcrição automática",
      "Legendas com IA",
      "Descrições para TikTok, Reels e YouTube",
      "Download em MP4",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    minutes: 100,
    pricePerMin: 0.08,
    highlight: true,
    description: "Para criadores ativos e agências",
    perks: [
      "100 minutos de vídeo/mês",
      "Tudo do Starter",
      "2 jobs simultâneos",
      "Prioridade na fila",
      "Suporte por e-mail",
    ],
  },
  {
    id: "business",
    name: "Business",
    minutes: 500,
    pricePerMin: 0.05,
    highlight: false,
    description: "Para times e alto volume",
    perks: [
      "500 minutos de vídeo/mês",
      "Tudo do Pro",
      "5 jobs simultâneos",
      "SLA garantido",
      "Suporte prioritário",
    ],
  },
];

const steps = [
  {
    num: "01",
    title: "Sobe o vídeo",
    desc: "Envie qualquer vídeo longo — aula, podcast, entrevista, palestra.",
    icon: "⬆️",
  },
  {
    num: "02",
    title: "IA corta e transcreve",
    desc: "Nossa IA identifica os momentos virais, transcreve e cria as legendas automaticamente.",
    icon: "🤖",
  },
  {
    num: "03",
    title: "Baixa os clipes",
    desc: "Receba os clipes prontos com descrições otimizadas para cada rede social.",
    icon: "✂️",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-zinc-800/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-[#ff6b6b]">Usina de Cortes</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link
              href="/register"
              className="text-sm bg-[#ff6b6b] hover:bg-[#ff5252] text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-block text-xs font-semibold bg-[#ff6b6b]/10 text-[#ff6b6b] border border-[#ff6b6b]/20 rounded-full px-4 py-1.5 mb-2">
            IA para criadores de conteúdo
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Transforme vídeos longos em{" "}
            <span className="text-[#ff6b6b]">clipes virais</span>{" "}
            com IA
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Suba seu vídeo. A IA corta, transcreve e gera as descrições para TikTok, Reels e YouTube — tudo em minutos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-[#ff6b6b] hover:bg-[#ff5252] text-white px-8 py-4 rounded-xl font-semibold text-base transition-colors"
            >
              Criar conta grátis →
            </Link>
            <a
              href="#pricing"
              className="w-full sm:w-auto border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white px-8 py-4 rounded-xl font-semibold text-base transition-colors"
            >
              Ver preços
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-[#12121a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">Como funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="bg-[#1a1a26] border border-zinc-800 rounded-2xl p-8 space-y-4">
                <div className="text-4xl">{step.icon}</div>
                <span className="text-3xl font-black text-[#ff6b6b]/30 block">{step.num}</span>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl font-bold">Preço por minuto de vídeo</h2>
            <p className="text-zinc-400">Escolha quantos minutos precisa. Sem surpresas na fatura.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-8 space-y-6 flex flex-col ${
                  plan.highlight
                    ? "border-[#ff6b6b]/50 bg-[#ff6b6b]/5"
                    : "border-zinc-800 bg-[#12121a]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff6b6b] text-white text-xs font-bold px-4 py-1 rounded-full">
                    Mais popular
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.minutes}</span>
                    <span className="text-zinc-400 text-sm">min/mês</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    R$ {plan.pricePerMin.toFixed(2).replace(".", ",")} por minuto extra
                  </p>
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className="text-[#ff6b6b] mt-0.5 shrink-0">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? "bg-[#ff6b6b] hover:bg-[#ff5252] text-white"
                      : "border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white"
                  }`}
                >
                  Começar com {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-20 bg-[#12121a] border-t border-zinc-800">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Pronto para viralizar?</h2>
          <p className="text-zinc-400">Crie sua conta, escolha seus minutos e comece a cortar agora.</p>
          <Link
            href="/register"
            className="inline-block bg-[#ff6b6b] hover:bg-[#ff5252] text-white px-10 py-4 rounded-xl font-semibold text-base transition-colors"
          >
            Criar conta grátis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-xs text-zinc-600">
        © 2025 Usina de Cortes Virais. Todos os direitos reservados.
      </footer>
    </div>
  );
}
