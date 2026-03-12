# Usina de Cortes Virais - AI Video Clip Generator

**Transforme vídeos longos em clipes virais otimizados para TikTok, Instagram Reels e YouTube Shorts**

---

## 🎯 O Que É

A **Usina de Cortes Virais** é uma aplicação web inteligente que usa IA para identificar e cortar automaticamente os melhores momentos de vídeos longos para conteúdo de curta duração.

**Como Funciona:**
1. Upload seu vídeo (MP4, MOV, MKV)
2. IA transcreve o conteúdo (OpenAI Whisper)
3. IA identifica momentos virais (Anthropic Claude Sonnet)
4. Cortes automáticos de 3-15 clipes (15-60s cada)
5. Baixe pronto para postar

**Tempo de Processamento:** 3-5 minutos para vídeo de 10 minutos

---

## ✨ Recursos

### Recursos Core (Todos os Tiers)

- ✅ **Upload Arrastar e Soltar** - Interface intuitiva
- ✅ **Transcrição Automática** - Whisper AI (98%+ precisão)
- ✅ **Seleção de Momentos Virais** - Claude Sonnet (4.0+)
- ✅ **Cortes Automáticos** - FFmpeg local (rápido, sem custo)
- ✅ **Múltiplas Descrições** - TikTok, Instagram, YouTube
- ✅ **Progresso em Tempo Real** - SSE (Server-Sent Events)
- ✅ **Preview de Clipes** - Formato 9:16 (vertical)
- ✅ **Download Direto** - MP4 pronto para postar
- ✅ **Cópia de Descrições** - One-click para clipboard

### Recursos Premium (Tier 2+)

- 🔄 **Autenticação de Downloads** - Segurança de dados
- 🧪 **Validação Completa de Input** - Segurança contra arquivos maliciosos
- 💾 **Metadata Persistence** - Clipes salvos com timestamps
- 📊 **Audit Logging** - Rastreamento de processamentos
- 🔒 **Backup Automatizado** - Proteção contra perda de dados
- ⚡ **Rate Limiting** - Proteção contra abuso
- 🧪 **Testes Unitários** - Garantia de qualidade

### Recursos Enterprise (Tier 3)

- 📦 **"Download All" ZIP** - Baixar todos os clipes de uma vez
- 👁 **Preview de Vídeo** - Ver antes de processar
- ⏹ **Cancelamento de Processamento** - Parar a qualquer momento
- ♿ **Acessibilidade Completa** - WCAG AA compliant
- ⌨ **Keyboard Shortcuts** - Eficiência para power users
- 🐳 **Docker Multi-Plataforma** - Deploy em qualquer OS
- ❓ **Help Tooltips + FAQ** - Documentação completa

---

## 🚀 Demonstração

### Vídeo de Demonstração

[Link para vídeo de demo - Opcional]

### Screenshots

![Screenshot 1: Upload](screenshots/upload.png)
![Screenshot 2: Processing](screenshots/processing.png)
![Screenshot 3: Clips Ready](screenshots/clips.png)

---

## 💰 Pricing

### Tier 1: Starter

**Preço:** $49 - $99

**Inclui:**
- ✅ Código fonte completo
- ✅ Funcionalidade core
- ✅ Documentação técnica (8 documentos)
- ✅ Guia de instalação
- ✅ Suporte por e-mail (7 dias)

**Setup:** 2-3 horas
**Ideal Para:** Criadores individuais, hobbyistas

---

### Tier 2: Professional

**Preço:** $199 - $499

**Inclui TUDO do Tier 1 +:**
- ✅ Autenticação de downloads
- ✅ Testes unitários
- ✅ Validação completa de input
- ✅ Metadata persistence
- ✅ Backup automatizado (S3)
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Dockerfile para deploy
- ✅ Documentação completa
- ✅ Suporte por e-mail (30 dias)

**Setup:** 1-2 dias
**Ideal Para:** Agências, pequenos negócios

---

### Tier 3: Enterprise

**Preço:** $799 - $1,999

**Inclui TUDO do Tier 2 +:**
- ✅ "Download All" ZIP
- ✅ Preview de vídeo antes do upload
- ✅ Cancelamento de processamento
- ✅ Modal de preview completo
- ✅ Acessibilidade completa (WCAG AA)
- ✅ Keyboard shortcuts
- ✅ Help tooltips + FAQ
- ✅ Cross-platform deploy (Docker)
- ✅ Roadmap completo
- ✅ Guia de customização
- ✅ Suporte premium (90 dias)
- ✅ 1 hora de consultoria técnica

**Setup:** 2-3 dias
**Ideal Para:** Empresas, startups

---

## 📦 O Que Você Recebe

### Para Todos os Tiers

1. **Código Fonte Completo**
   - Backend: `server.js` (345 linhas)
   - Frontend: `public/index.html` (463 linhas)
   - Package: `package.json` + `package-lock.json`

2. **Documentação Técnica Completa**
   - System Architecture
   - Database Schema & Audit
   - Frontend Specification
   - Technical Debt Assessment
   - Executive Report
   - (8 documentos, 400+ linhas totais)

3. **Guia de Instalação**
   - Como instalar Node.js
   - Como instalar FFmpeg (Windows, Mac, Linux)
   - Como obter API keys (OpenAI, Anthropic)
   - Como configurar `.env`

4. **Suporte por E-mail**
   - Tier 1: 7 dias
   - Tier 2: 30 dias
   - Tier 3: 90 dias premium

### Para Tier 2+

5. **Dockerfile** + Deploy scripts
6. **Test Suite** (Jest/Mocha)
7. **Backup Script** (Automatizado)

### Para Tier 3

8. **Features Premium** (Download All, Preview, etc.)
9. **Guia de Customização**
10. **1 Hora de Consultoria Técnica**

---

## 🔧 Requisitos Técnicos

### Mínimos (Todos os Tiers)

| Requisito | Versão Mínima | Onde Obter |
|------------|----------------|-------------|
| **Node.js** | 18+ | https://nodejs.org |
| **NPM** | 9+ | Instalado com Node.js |
| **FFmpeg** | 4.0+ | https://ffmpeg.org/download.html |
| **OS** | Windows/Mac/Linux | - |
| **Disk** | 500MB+ | - |
| **RAM** | 2GB+ | - |

### Opcionais (Tier 2+)

| Requisito | Onde Obter |
|------------|-------------|
| **Docker** | https://docker.com |
| **AWS S3** (backup) | https://aws.amazon.com/s3 |
| **PostgreSQL** (opcional) | https://postgresql.org |

---

## 🛠️ Guia de Instalação Rápida

### 1. Clone/Download

```bash
# Via Git
git clone <repository-url>
cd usina-cortes

# Ou download ZIP e extrair
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Environment

```bash
# Copiar template
cp .env.example .env

# Editar com suas API keys
nano .env
```

### 4. Iniciar

```bash
# Windows
npm start

# Mac/Linux
node server.js

# Ou com Docker (Tier 2+)
docker-compose up
```

### 5. Acessar

Abra no navegador: `http://localhost:3737`

---

## 📚 Documentação

### Documentos Técnicos Incluídos

1. **system-architecture.md** - Arquitetura completa do sistema
2. **SCHEMA.md** - Modelo de dados (file-based)
3. **DB-AUDIT.md** - Assessment de segurança e performance
4. **frontend-spec.md** - Especificação de UX/UI
5. **technical-debt-assessment.md** - Dívida técnica consolidada
6. **TECHNICAL-DEBT-REPORT.md** - Relatório executivo

### Guias de Usuário

- **Guia de Instalação** (incluído acima)
- **Guia de Primeiros Passos**
- **Troubleshooting Comum**

---

## 🆘 Suporte

### Canais de Suporte

| Tier | Email | Slack/Discord | Tempo de Resposta |
|-------|--------|----------------|------------------|
| **Tier 1** | ✅ | ❌ | 24-48 horas |
| **Tier 2** | ✅ | ❌ | 12-24 horas |
| **Tier 3** | ✅ | ✅ | 4-8 horas |

### Contrato de SLA

**Uptime Garantido:**
- Tier 1: Best effort
- Tier 2: 95% uptime
- Tier 3: 99.5% uptime

**Bug Fixes:**
- Tier 1: 30 dias para correção
- Tier 2: 14 dias para correção
- Tier 3: 7 dias para correção (prioridade)

---

## ⚖️ Licença e Termos

### Licença

**MIT License**

Permite:
- ✅ Uso comercial
- ✅ Modificação do código
- ✅ Redistribuição
- ✅ Sublicenciamento

### Termos de Venda

- Código vendido "AS IS" - sem garantias
- Não responsabilidade por perda de dados
- API keys são responsabilidade do comprador
- Suporte limitado ao período especificado

---

## 🤔 Perguntas Frequentes (FAQ)

### Gerais

**Q: Posso usar este código comercialmente?**
A: Sim, MIT license permite uso comercial.

**Q: Posso revender o código?**
A: Sim, com atribuição ao autor original.

**Q: Há limites de uso?**
A: Não há limites técnicos. Limites dependem de suas API keys.

### Técnicas

**Q: Preciso instalar FFmpeg?**
A: Sim, é necessário para processamento de vídeo. Guia incluído.

**Q: Onde consigo obter API keys?**
A: OpenAI: https://platform.openai.com/api-keys
   Anthropic: https://console.anthropic.com/settings/keys

**Q: Funciona em Mac/Linux?**
A: Sim, Node.js é cross-platform. Scripts .bat são Windows-only.

### Pagamento

**Q: Formas de pagamento aceitas?**
A: Cartão de crédito, PayPal, Pix (se aplicável).

**Q: Como recebo o código?**
A: Link de download imediato após pagamento confirmado.

**Q: Refunds disponíveis?**
A: 7 dias para refund se o código não funcionar como descrito.

---

## 📊 Comparativo com Competidores

| Produto | Preço | Subscrição? | Custo Anual |
|---------|--------|--------------|-------------|
| **CapCut** | Grátis / $120/ano | Sim | $120 |
| **Descript** | $120/ano | Sim | $120 |
| **Veed** | $144/ano | Sim | $144 |
| **Usina de Cortes (Tier 2)** | $299 (único) | **NÃO** | **$299** |

**Vantagem:** Pague uma vez, use para sempre.

---

## 🎁 Bônus

### Para Compradores de Tier 2+

- 🎥 Vídeo de demonstração completo
- 📋 Checklist de setup (30 minutos)
- 🔗 Links para tutoriais FFmpeg/Node.js

### Para Compradores de Tier 3

- ✨ Acesso antecipado a futuras features
- 📱 Roadmap de 12 meses
- 🎓 1 hora de consultoria técnica personalizada

---

## 📞 Contato

**Vendedor:** [Seu Nome/Empresa]
**Email:** [seu@email.com]
**Website:** [seu-site.com]
**GitHub:** [seu-repo]

**Suporte:** [suporte@email.com]

---

## 📜 Termos de Uso

Ao comprar este produto, você concorda com:

1. **Licença MIT** - Uso livre, modificação, redistribuição permitida
2. **Código "AS IS"** - Sem garantias expressas ou implícitas
3. **Responsabilidade** - Vendedor não responsável por danos diretos ou indiretos
4. **API Keys** - Comprador responsável por obter e gerenciar suas chaves
5. **Suporte** - Limitado ao período especificado no tier

---

*README de Venda - Gerado por AIOX Brownfield Discovery - Fase 10*
*Data: 2026-03-12*
*Versão: 1.0*
