# Brownfield Discovery - Usina de Cortes Virais

**Data:** 2026-03-12
**Workflow:** 10-Phase Technical Debt Assessment
**Status:** In Progress

---

## Executive Summary

Projeto: Usina de Cortes Virais - AI Video Clip Generator
Objetivo: Transformar kit de desenvolvimento em SaaS comercial com monetização por minuto

---

## Workflow Status

| Fase | Agente | Status | Documento | Data |
|-------|---------|---------|------------|------|
| Phase 1: System Architecture | @architect | ✅ docs/system-architecture.md | 2026-03-12 |
| Phase 2: Database Assessment | @data-engineer | ✅ docs/DB-AUDIT.md | 2026-03-12 |
| Phase 3: Frontend Spec | @ux-design-expert | ✅ docs/frontend-spec.md | 2026-03-12 |
| Phase 4: Technical Debt Draft | @architect | ✅ docs/technical-debt-DRAFT.md | 2026-03-12 |
| Phase 5: DB Specialist Review | @data-engineer | ✅ docs/db-specialist-review.md | 2026-03-12 |
| Phase 6: UX Specialist Review | @ux-design-expert | ✅ docs/ux-specialist-review.md | 2026-03-12 |
| Phase 7: QA Review | @qa | ✅ docs/qa-review.md | 2026-03-12 |
| Phase 8: Technical Debt Assessment | @architect | ✅ docs/technical-debt-assessment.md | 2026-03-12 |
| Phase 9: Executive Report | @analyst | ✅ docs/TECHNICAL-DEBT-REPORT.md | 2026-03-12 |
| Phase 10: Epic + Stories | @pm | ⏳ docs/epics/ | - |

---

## Core Assessment

### Estado Atual do Projeto

**O QUE TEM:**
- ✅ Core functionality (upload → Whisper → Claude → FFmpeg → clips)
- ✅ Express server com upload (Multer)
- ✅ Integração APIs: OpenAI Whisper, Anthropic Claude
- ✅ FFmpeg local para processamento
- ✅ SSE para progresso em tempo real
- ✅ Frontend vanilla HTML/CSS/JS funcional

**O QUE FALTA PARA SAAS:**
- ❌ Sistema de usuários (registro, login, autenticação)
- ❌ Banco de dados real (usa file system)
- ❌ Sistema de billing por minuto
- ❌ Dashboard para usuários
- ❌ Painel admin
- ❌ Multi-tenancy
- ❌ Tracking de uso por usuário
- ❌ Sistema de cota/limite
- ❌ Deploy em cloud
- ❌ CI/CD pipeline

### Stack Atual

```
Backend:
  - Runtime: Node.js (versão não especificada)
  - Framework: Express 4.21.0
  - Upload: Multer 1.4.5-lts.1
  - Config: dotenv 16.4.5

Frontend:
  - Arquitetura: Vanilla JS (sem framework)
  - Arquivo único: public/index.html (463 linhas)
  - Comunicação: SSE para progresso

External APIs:
  - OpenAI Whisper API (transcrição)
  - Anthropic Claude Sonnet 4 (seleção de clipes)

Local Processing:
  - FFmpeg (processamento de vídeo/áudio)
  - FFprobe (metadata)
```

---

## Monetização por Minuto - Requisitos

Para transformar em SaaS "por minuto", necessário implementar:

1. **Billing Infrastructure**
   - Stripe integration para pagamento
   - Sistema de prepaid credits ou pay-as-you-go
   - Tracking de segundos de processamento
   - Faturas e histórico de uso

2. **User Management**
   - Registro/login (JWT ou OAuth)
   - Perfis de usuário
   - Gerenciamento de créditos
   - Histórico de processamentos

3. **Usage Tracking**
   - Métricas por usuário: vídeos processados, segundos usados
   - Limites por plano
   - Real-time counters durante processamento

4. **Architecture Changes**
   - Multi-tenancy (isolar dados por usuário)
   - Database para persistência
   - Queue system para processamento concorrente
   - Storage em cloud (S3/R2) para clipes

---

## Next Steps

1. Criar `docs/DB-AUDIT.md` - Assessment de database inexistente
2. Criar `docs/frontend-spec.md` - Especificação frontend atual
3. Criar `docs/technical-debt-DRAFT.md` - Rascunho de débito técnico
4. Executar revisões especializadas (Phase 5-7)
5. Consolidar em assessment final (Phase 8)
6. Gerar relatório executivo (Phase 9)
7. Criar Epic + Stories (Phase 10)

---

**Documento de Tracking do Brownfield Discovery**
**Última atualização:** 2026-03-12
