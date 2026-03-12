# Epic: Transformação em SaaS - Usina de Cortes Virais

**ID:** EPIC-001
**Status:** READY
**Priority:** P0 (Critical)
**Estimated Duration:** 10-14 semanas
**Total Estimated Effort:** ~550-700 story points

---

## Epic Overview

### Objetivo

Transformar o kit de desenvolvimento "Usina de Cortes Virais" em um SaaS comercializável com sistema de monetização por minuto de processamento de vídeo.

### Business Case

| Métrica | Valor |
|----------|-------|
| Investimento | R$ 145k-185k |
| Receita mensal alvo (250 usuários) | R$ 7.500 |
| Break-even | ~10 meses |
| ROI (2 anos, 500 usuários) | ~1.6x |

---

## Scope

### IN (O que será implementado)

1. **Autenticação e Autorização**
   - Sistema de registro/login (email + password)
   - JWT-based authentication
   - Password hashing (bcrypt)
   - Rate limiting por usuário

2. **Database Layer**
   - PostgreSQL (Supabase)
   - 8 tabelas principais (users, credits, jobs, clips, etc.)
   - RLS policies para multi-tenancy
   - Índices otimizados

3. **Sistema de Billing por Minuto**
   - Stripe integration
   - Compra de créditos
   - Tracking de uso em tempo real
   - Faturas e histórico de pagamentos
   - Rate limiting por créditos

4. **Frontend Moderno**
   - Next.js 14 com TypeScript
   - Design system (Atomic Design)
   - Responsivo (mobile-first)
   - Acessibilidade (WCAG AA)

5. **Queue System**
   - Bull + Redis para processamento assíncrono
   - Workers multi-core
   - Tries automáticos

6. **Dashboard Usuário**
   - Visão de créditos disponíveis
   - Histórico de processamentos
   - Download de clipes anteriores
   - Configurações de perfil

7. **DevOps e Deploy**
   - Docker containers
   - CI/CD via GitHub Actions
   - Deploy em Railway/Vercel
   - Monitoring (Sentry)
   - Logging estruturado

8. **Testes**
   - Unit tests (Jest + RTL)
   - Integration tests
   - E2E tests (Playwright)
   - 80%+ coverage target

### OUT (O que NÃO será implementado neste Epic)

1. Mobile app nativo (React Native/Flutter)
2. Webhooks para plataformas (YouTube/TikTok API)
3. Templates de legenda/caption
4. Editor avançado de vídeo (timeline, cortes manuais)
5. Análises de engagement prediction
6. API pública para desenvolvedores
7. Sistema de afiliados
8. Plano Enterprise/Team
9. SSO (Google/Microsoft)
10. Internacionalização (apenas PT-BR inicialmente)

---

## Sprints

### Sprint 1: Foundation (2 semanas)

**Objetivo:** Base arquitetural para SaaS

| Story ID | Story Title | Points | Status |
|-----------|-------------|--------|--------|
| EPIC-001.1 | Setup Next.js 14 com TypeScript | 8 | 📋 Draft |
| EPIC-001.2 | Criar projeto Supabase e migrations | 13 | 📋 Draft |
| EPIC-001.3 | Implementar JWT authentication | 8 | 📋 Draft |
| EPIC-001.4 | Setup middleware (auth, rate limit, security) | 8 | 📋 Draft |
| EPIC-001.5 | Dockerizar aplicação | 5 | 📋 Draft |
| EPIC-001.6 | Setup CI/CD (GitHub Actions) | 5 | 📋 Draft |

**Total Sprint 1:** 47 points

### Sprint 2: Core Features (3 semanas)

**Objetivo:** Funcionalidades principais do MVP

| Story ID | Story Title | Points | Status |
|-----------|-------------|--------|--------|
| EPIC-001.7 | UI de registro e login | 8 | 📋 Draft |
| EPIC-001.8 | Implementar CRUD de usuários | 8 | 📋 Draft |
| EPIC-001.9 | Sistema de créditos (saldo, histórico) | 8 | 📋 Draft |
| EPIC-001.10 | Upload de vídeo com autenticação | 8 | 📋 Draft |
| EPIC-001.11 | Implementar fila de processamento (Bull) | 8 | 📋 Draft |
| EPIC-001.12 | Worker de processamento assíncrono | 8 | 📋 Draft |
| EPIC-001.13 | Tracking de uso em tempo real | 5 | 📋 Draft |
| EPIC-001.14 | Histórico de jobs e clips | 5 | 📋 Draft |

**Total Sprint 2:** 66 points

### Sprint 3: Billing (2.5 semanas)

**Objetivo:** Sistema de monetização por minuto

| Story ID | Story Title | Points | Status |
|-----------|-------------|--------|--------|
| EPIC-001.15 | Stripe integration (checkout) | 8 | 📋 Draft |
| EPIC-001.16 | Sistema de compra de créditos | 8 | 📋 Draft |
| EPIC-001.17 | Geração de invoices | 5 | 📋 Draft |
| EPIC-001.18 | Webhooks do Stripe | 5 | 📋 Draft |
| EPIC-001.19 | Rate limiting por créditos | 5 | 📋 Draft |
| EPIC-001.20 | Dashboard de billing | 8 | 📋 Draft |

**Total Sprint 3:** 39 points

### Sprint 4: Frontend Rewrite (4 semanas)

**Objetivo:** Frontend moderno com design system

| Story ID | Story Title | Points | Status |
|-----------|-------------|--------|--------|
| EPIC-001.21 | Setup Tailwind CSS com design tokens | 5 | 📋 Draft |
| EPIC-001.22 | Criar componentes Atoms (Button, Input, etc.) | 8 | 📋 Draft |
| EPIC-001.23 | Criar componentes Molecules (DropZone, Card) | 8 | 📋 Draft |
| EPIC-001.24 | Criar componentes Organisms (Dashboard, JobView) | 8 | 📋 Draft |
| EPIC-001.25 | Criar Templates e Pages | 8 | 📋 Draft |
| EPIC-001.26 | Migrar lógica de processamento para UI | 5 | 📋 Draft |
| EPIC-001.27 | Implementar estado de loading | 3 | 📋 Draft |
| EPIC-001.28 | Implementar estados de erro/empty | 3 | 📋 Draft |

**Total Sprint 4:** 56 points

### Sprint 5: Polish & QA (2.5 semanas)

**Objetivo:** Produção ready

| Story ID | Story Title | Points | Status |
|-----------|-------------|--------|--------|
| EPIC-001.29 | Testes unit (Jest + RTL) | 8 | 📋 Draft |
| EPIC-001.30 | Testes de integração | 5 | 📋 Draft |
| EPIC-001.31 | Testes E2E (Playwright) | 8 | 📋 Draft |
| EPIC-001.32 | Configurar Sentry (monitoramento) | 3 | 📋 Draft |
| EPIC-001.33 | Performance tuning (cache, indexes) | 5 | 📋 Draft |
| EPIC-001.34 | Security audit e hardening | 5 | 📋 Draft |
| EPIC-001.35 | Accessibility audit (WCAG AA) | 5 | 📋 Draft |
| EPIC-001.36 | Responsive design finalização | 3 | 📋 Draft |

**Total Sprint 5:** 42 points

---

## Epic Summary

| Métrica | Valor |
|----------|-------|
| Total Stories | 36 |
| Total Story Points | 250 |
| Sprints | 5 |
| Estimativa | 10-14 semanas (2.5-3.5 meses) |
| Equipe recomendada | 2-3 desenvolvedores full-stack |
| Custo estimado | R$ 145k-185k |

---

## Dependencies

### Externas

| Dependência | Fornecedor | Status |
|-----------|-----------|--------|
| Supabase | supabase.com | 🔴 BLOCKER - precisa setup |
| Stripe | stripe.com | 🔴 BLOCKER - conta test precisa |
| Redis | redis.io | 🟠 HIGH - fila precisa |

### Internas

| Story | Depende de |
|-------|-------------|
| EPIC-001.7 (Login UI) | EPIC-001.3 (Auth) |
| EPIC-001.11 (Queue) | EPIC-001.2 (Database) |
| EPIC-001.15 (Stripe) | EPIC-001.2 (Database) |
| Todas as stories | EPIC-001.1 (Setup Next.js) |

---

## Risk Register

| ID | Risco | Probabilidade | Impacto | Plano de Mitigação |
|----|--------|-------------|----------|-------------------|
| R-001 | Estimativa subestimada | Alta | Alto | Buffer de 20% em budget |
| R-002 | API costs superam receita | Média | Alto | Monitoramento real-time de custos |
| R-003 | Churn alto no início | Alta | Alto | Onboarding otimizado + crédito gratuito inicial |
| R-004 | Competidores lançam similar | Média | Alto | Diferencial: IA + mercado BR |
| R-005 | Performance não escala | Média | Alto | Load testing antes de launch |
| R-006 | UX confusa reduz conversão | Baixa | Médio | Usability testing em beta |

---

## Definition of Done

O Epic será considerado **DONE** quando:

1. [ ] Todas as 36 stories estiverem em status Done
2. [ ] Testes passando com 80%+ coverage
3. [ ] Deploy em produção executado com sucesso
4. [ ] Monitoring (Sentry) configurado e operacional
5. [ ] Documentação de usuário (help docs) completa
6. [ ] Pricing final definido e testado
7. [ ] Beta com 50-100 usuários completado
8. [ ] Feedback loop iterado 3+ vezes

---

## Acceptance Criteria

### Funcionais

- [ ] Usuários podem registrar e fazer login
- [ ] Usuários podem comprar créditos (Stripe)
- [ ] Usuários podem processar vídeos com tracking de custo
- [ ] Usuários podem ver histórico e re-download clips
- [ ] Sistema de rate limiting funciona por créditos

### Não-Funcionais

- [ ] Uptime 99%+ (monitoring)
- [ ] Tempo de resposta <2s (P99)
- [ ] Custo por processamento <R$ 0,15/min
- [ ] 80%+ test coverage
- [ ] WCAG AA compliance

---

## Epic Links

### Documentos Relacionados

- `docs/system-architecture.md` - Arquitetura atual
- `docs/DB-AUDIT.md` - Especificação de database
- `docs/frontend-spec.md` - Especificação de frontend
- `docs/technical-debt-DRAFT.md` - Débito técnico inicial
- `docs/technical-debt-assessment.md` - Assessment final
- `docs/TECHNICAL-DEBT-REPORT.md` - Relatório executivo
- `docs/qa-review.md` - Review de qualidade

### Story Files

Após criação das stories (via @sm), serão listadas aqui com links:
- `docs/stories/EPIC-001.1.story.md`
- `docs/stories/EPIC-001.2.story.md`
- (... 36 stories no total)

---

**Epic Status:** READY para desenvolvimento
**Next Step:** @sm criar as 36 stories baseadas neste Epic

---

**Epic Created By:** @pm (Morgan)
**Date:** 2026-03-12
