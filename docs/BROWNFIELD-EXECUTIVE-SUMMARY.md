# Brownfield Discovery - Resumo Executivo

**Data:** 2026-03-12
**Projeto:** Usina de Cortes Virais
**Status:** ✅ COMPLETO

---

## 📊 O que foi analisado

### Documentos Criados (10 fases)

| # | Documento | Agente | Linhas | Status |
|---|-----------|---------|-------|--------|
| 1 | system-architecture.md | @architect | 464 | ✅ Já existia |
| 2 | DB-AUDIT.md | @data-engineer | ~450 | ✅ Criado |
| 3 | frontend-spec.md | @ux-design-expert | ~600 | ✅ Criado |
| 4 | technical-debt-DRAFT.md | @architect | ~500 | ✅ Criado |
| 5 | db-specialist-review.md | @data-engineer | ~400 | ✅ Criado |
| 6 | ux-specialist-review.md | @ux-design-expert | ~500 | ✅ Criado |
| 7 | qa-review.md | @qa | ~400 | ✅ Criado |
| 8 | technical-debt-assessment.md | @architect | ~650 | ✅ Criado |
| 9 | TECHNICAL-DEBT-REPORT.md | @analyst | ~550 | ✅ Criado |
| 10 | EPIC-001.md | @pm | ~250 | ✅ Criado |

**Total:** ~4.764 linhas de documentação técnica

---

## 🔴 Estado Atual do Projeto

### O que TEM (funcional)
- ✅ Upload de vídeo (drag & drop)
- ✅ Transcrição Whisper (98%+ precisão)
- ✅ Seleção de momentos virais (Claude Sonnet 4)
- ✅ Cortes automáticos (3-15 clips, 15-60s)
- ✅ Progresso em tempo real (SSE)
- ✅ Preview/download de clipes
- ✅ Descrições para TikTok/Instagram/YouTube

### O que FALTA para SAAS (crítico)
- ❌ **Autenticação** - Sem login, registro, JWT
- ❌ **Banco de dados** - Usa apenas file system
- ❌ **Billing por minuto** - Sem Stripe, sem créditos
- ❌ **Multi-tenancy** - Sem isolamento de usuários
- ❌ **Dashboard** - Sem painel de usuário ou admin
- ❌ **Tracking de uso** - Sem métricas por usuário
- ❌ **Sistema de fila** - Sem Bull/Redis
- ❌ **Frontend moderno** - Vanilla JS, sem componentes
- ❌ **Testes** - Zero coverage
- ❌ **CI/CD** - Sem pipeline de deploy
- ❌ **Monitoramento** - Sem Sentry/observabilidade

---

## 💰 Modelo de Monetização (Proposto)

### Por Minuto de Processamento

| Plano | Preço/min | Créditos incluídos | Público-alvo |
|-------|-----------|-----------------|---------------|
| Starter | R$ 0,10 | 30 min (R$ 3,00) | Usuários casuais |
| Pro | R$ 0,08 | 100 min (R$ 8,00) | Criadores de conteúdo |
| Business | R$ 0,05 | 500 min (R$ 25,00) | Agências/empresas |

### Exemplo de Custo por Usuário

Vídeo de 10 minutos:
- **Processamento:** 10 min × R$ 0,08 = R$ 0,80
- **APIs ( Whisper + Claude):** ~R$ 0,25
- **Custo total estimado:** ~R$ 1,05 por vídeo

---

## 📈 Roadmap de Implementação

### Sprint 1: Foundation (2 semanas)

**Objetivo:** Base arquitetural para SaaS

| Tarefa | Estimativa | Prioridade |
|---------|-----------|-----------|
| Setup Next.js 14 + TS | 2 dias | 🔴 P0 |
| Criar projeto Supabase | 1 dia | 🔴 P0 |
| Migrations core (users, credits, plans) | 2 dias | 🔴 P0 |
| Implementar JWT authentication | 2 dias | 🔴 P0 |
| Middleware (auth, rate limit, security) | 1 dia | 🔴 P0 |
| Dockerizar aplicação | 1 dia | 🟡 P1 |

**Total:** 9 dias (2 semanas)

### Sprint 2: Core Features (3 semanas)

**Objetivo:** Funcionalidades principais do MVP

| Tarefa | Estimativa | Prioridade |
|---------|-----------|-----------|
| UI de registro/login | 3 dias | 🔴 P0 |
| Dashboard básico (créditos, menu) | 2 dias | 🔴 P0 |
| Upload com auth | 2 dias | 🔴 P0 |
| Implementar fila Bull | 2 dias | 🔴 P0 |
| Worker de processamento | 2 dias | 🔴 P0 |
| Sistema de créditos | 2 dias | 🟡 P1 |
| Tracking de uso em tempo real | 2 dias | 🟡 P1 |
| Histórico de jobs | 1 semana | 🟡 P1 |

**Total:** 17 dias (3 semanas)

### Sprint 3: Billing (2.5 semanas)

**Objetivo:** Sistema de monetização por minuto

| Tarefa | Estimativa | Prioridade |
|---------|-----------|-----------|
| Stripe integration (checkout) | 3 dias | 🔴 P0 |
| Compra de créditos | 3 dias | 🔴 P0 |
| Geração de invoices | 2 dias | 🟡 P1 |
| Webhooks do Stripe | 1 dia | 🟡 P1 |
| Dashboard de billing | 3 dias | 🟡 P1 |
| Rate limiting por créditos | 2 dias | 🟡 P1 |

**Total:** 14 dias (2.5 semanas)

### Sprint 4: Frontend Rewrite (4 semanas)

**Objetivo:** Frontend moderno com design system

| Tarefa | Estimativa | Prioridade |
|---------|-----------|-----------|
| Setup Tailwind + design tokens | 2 dias | 🔴 P0 |
| Componentes Atoms (8) | 1 semana | 🔴 P0 |
| Componentes Molecules (6) | 4 dias | 🟡 P1 |
| Componentes Organisms (5) | 3 dias | 🟡 P1 |
| Templates e Pages | 2 dias | 🟡 P1 |
| Migrar lógica de processamento | 1 semana | 🟡 P1 |
| Estados de loading/erro | 3 dias | 🟡 P1 |

**Total:** 28 dias (4 semanas)

### Sprint 5: Polish & QA (2.5 semanas)

**Objetivo:** Produção ready

| Tarefa | Estimativa | Prioridade |
|---------|-----------|-----------|
| Testes unit (80% coverage) | 5 dias | 🔴 P0 |
| Testes de integração | 3 dias | 🔴 P0 |
| Testes E2E (Playwright) | 3 dias | 🔴 P0 |
| Configurar Sentry | 1 dia | 🟡 P1 |
| Performance tuning | 2 dias | 🟡 P1 |
| Security audit & hardening | 3 dias | 🟡 P1 |
| Accessibility (WCAG AA) | 2 dias | 🟡 P1 |
| Responsive finalização | 2 dias | 🟡 P1 |

**Total:** 18 dias (2.5 semanas)

---

## 🎯 Stack Tecnológica Definitiva

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express (atual) → migration gradual para NestJS
- **Auth:** JWT (jsonwebtoken)
- **Database:** Supabase (PostgreSQL + RLS)
- **Queue:** Bull + Redis
- **Storage:** Cloudflare R2 (S3-compatible)
- **Monitoring:** Sentry
- **APIs Externas:** OpenAI Whisper, Anthropic Claude Sonnet 4

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Design System:** Atomic Design
- **Testing:** Jest + React Testing Library + Playwright

### DevOps
- **Container:** Docker
- **CI/CD:** GitHub Actions
- **Deploy:** Railway (inicial) → Vercel/Railway (escala)
- **Infra:** Redis (fila), Sentry (monitoring)

---

## 🚀 Próximos Passos

### Imediato (Esta semana)

1. [ ] **Validar budget** - Confirmar R$ 145k-185k disponível
2. [ ] **Selecionar stack** - Supabase vs PostgreSQL direto
3. [ ] **Contratar equipe** - 2-3 desenvolvedores full-stack
4. [ ] **Criar repositório privado** - GitHub para código SaaS
5. [ ] **Setup ambiente de dev** - GitHub organizations, Supabase
6. [ ] **Criar projeto Next.js** - `npx create-next-app@latest`
7. [ ] **Definir pricing final** - Validar R$ 0,10/min (Starter)

### Curto Prazo (Próximas 2 semanas)

1. [ ] **Criar conta Supabase** - Free tier para MVP
2. [ ] **Criar conta Stripe** - Test mode para desenvolvimento
3. [ ] **Setup CI/CD** - GitHub Actions + Railway deploy
4. [ ] **Criar epic de stories detalhadas** - Via @sm *draft
5. [ ] **Onboarding do time** - Contexto do projeto + guias

---

## 📁 Estrutura de Arquivos Final

```
usina-cortes/
├── .aiox-core/              # Framework AIOS (instalado)
├── .aiox/                 # Framework AIOS runtime
├── .claude/               # Configuração Claude Code
├── docs/
│   ├── brownfield-discovery.md        # Tracking do processo
│   ├── system-architecture.md         # Arquitetura atual
│   ├── DB-AUDIT.md                  # Assessment database
│   ├── frontend-spec.md               # Especificação frontend
│   ├── technical-debt-DRAFT.md        # Débito técnico rascunho
│   ├── db-specialist-review.md       # Revisão DB
│   ├── ux-specialist-review.md        # Revisão UX
│   ├── qa-review.md                  # Revisão QA
│   ├── technical-debt-assessment.md # Assessment final
│   ├── TECHNICAL-DEBT-REPORT.md    # Relatório executivo
│   └── epics/
│       └── EPIC-001.md               # Epic principal
├── server.js               # Backend atual (legacy)
├── public/
│   └── index.html         # Frontend atual (legacy)
└── package.json             # Dependências atuais
```

---

## ✅ Brownfield Discovery Status

**Estado:** ✅ **COMPLETO E APROVADO**

O projeto foi analisado completamente, o débito técnico está mapeado, e o plano para transformar em SaaS comercializável está documentado.

**Próximo Agente:** @sm (*draft) → Criar as 36 stories detalhadas para o EPIC-001

**Investimento Estimado:** R$ 145k-185k (10-14 semanas)
**ROI Projetado:** 2 anos com 500 usuários ativos

---

**Documento Criado:** 2026-03-12
**Por:** @architect (Aria) + Equipe AIOS (Phase 1-10)
