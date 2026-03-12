# Usina de Cortes Virais - AI Video Clip Generator

**Kit de Desenvolvimento para Aplicações de Cortes Virais**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/SEU-USUARIO/usina-cortes/blob/master/LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0-brightgreen.svg)](https://nodejs.org/)
[![Type: TypeScript](https://img.shields.io/badge/TypeScript-No-red.svg)](https://www.typescriptlang.org/)

---

## 📋 O Que É

A **Usina de Cortes Virais** é um **kit de desenvolvimento** (não um SaaS pronto) que demonstra integração funcional de:

- **OpenAI Whisper API** - Transcrição de áudio com precisão 98%+
- **Anthropic Claude Sonnet 4** - Seleção de momentos virais
- **FFmpeg** - Processamento local de vídeo (rápido, sem custo)

**⚠️ IMPORTANTE:** Este é **código fonte** para desenvolvimento. Para uso como SaaS comercial, requer implementação de: login, billing, sistema de usuários, dashboard, etc.

---

## 🎯 Casos de Uso

Este projeto é ideal para:

- ✅ **Desenvolvedores Freelance** - Base rápida para clientes
- ✅ **Startups** - Ponto de partida para MVP de cortes virais
- ✅ **Empresas (Internal Tool)** - Instalar para equipe usar internamente
- ✅ **Aprendizado** - Estudar integração AI + FFmpeg
- ✅ **Customização** - Modificar e adicionar features próprias

---

## ✨ Recursos do Kit

### Core Features (Funcional)

- Upload de vídeo (drag & drop + file picker)
- Transcrição automática (OpenAI Whisper)
- Seleção de momentos virais (Claude Sonnet 4)
- Cortes automáticos (3-15 clips, 15-60s cada)
- Múltiplas descrições (TikTok, Instagram, YouTube)
- Progresso em tempo real (Server-Sent Events)
- Preview de clips (9:16 vertical)
- Download de clipes

### Technical Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Video Processing:** FFmpeg (local)
- **AI APIs:** OpenAI Whisper + Anthropic Claude

---

## 🚀 Quick Start

### 1. Clone

```bash
git clone https://github.com/SEU-USUARIO/usina-cortes.git
cd usina-cortes
```

### 2. Instalar

```bash
npm install
```

### 3. Configurar

```bash
cp .env.example .env
# Editar .env com suas API keys
```

### 4. Executar

```bash
npm start
```

### 5. Acessar

Abra: `http://localhost:3737`

---

## 🔧 Requisitos

| Requisito | Versão |
|------------|---------|
| Node.js | 18+ |
| NPM | 9+ |
| FFmpeg | 4.0+ |
| Disk | 500MB+ |

### Opcionais

- Docker Desktop
- PostgreSQL (para multi-tenancy)
- AWS S3 (para backup)

---

## 📚 Documentação

### Pública (Para Compradores)

- [README-SALE.md](README-SALE.md) - README de venda completo
- [SETUP-GUIDE.md](SETUP-GUIDE.md) - Guia de instalação

### Interna (Para Desenvolvimento)

Acesse os documentos internos de assessment:
```bash
# Clone do repositório privado com docs completos
git clone https://github.com/SEU-USUARIO/usina-cortes-internal.git
```

---

## 🗺 Roadmap para SaaS

Para transformar este kit em um **SaaS comercial**, necessário implementar:

### Phase 1: Fundamentos (40h)

- [ ] Sistema de usuários (registro, login, logout)
- [ ] Autenticação (JWT, refresh tokens)
- [ ] Middleware de autorização
- [ ] Recuperação de senha

### Phase 2: Database (30h)

- [ ] Migrar para PostgreSQL/MongoDB
- [ ] Implementar multi-tenancy
- [ ] Migrations sistemáticas
- [ ] Backup/restore

### Phase 3: Billing & Payments (80h)

- [ ] Stripe integration
- [ ] Sistema de planos (Free/Pro/Enterprise)
- [ ] Faturas e invoices
- [ ] Usage tracking (por usuário)
- [ ] Limites de uso (cotas)

### Phase 4: Dashboard (60h)

- [ ] Painel de usuário (history, billing, settings)
- [ ] Painel de admin (usuários, metrics, logs)
- [ ] Analytics e reports
- [ ] Email notifications

### Phase 5: Production (60h)

- [ ] Deploy em cloud (AWS/Google Cloud/Azure)
- [ ] CDN para clipes
- [ ] S3/Cloudflare R2 para storage
- [ ] Load balancing
- [ ] Monitoring (Sentry, DataDog)
- [ ] CI/CD pipeline

**Total Estimado:** 270 horas (~34 dias úteis)

---

## 📊 Status Atual

### O que TEM:

- ✅ Core functionality (upload → AI → clipes)
- ✅ Code limpo e documentado
- ✅ Integração funcional com APIs externas
- ✅ Setup local simples

### O que NÃO TEM (para SaaS):

- ❌ Sistema de usuários
- ❌ Login/autenticação
- ❌ Sistema de pagamentos
- ❌ Dashboard admin
- ❌ Multi-tenancy
- ❌ Database real (usa file system)
- ❌ Sistema de cota de uso
- ❌ Deploy na nuvem
- ❌ Billing/recurrência

---

## 💰 Pricing do Kit (Código Fonte)

| Tier | Preço | O que inclui |
|-------|--------|---------------|
| **Starter** | $49 - $99 | Código + docs básicas |
| **Professional** | $199 - $499 | Código + docs completas + Docker |

---

## 📞 Suporte

Para questões sobre o kit de desenvolvimento:

- **Issues GitHub:** https://github.com/SEU-USUARIO/usina-cortes/issues
- **Email:** seu@email.com

---

## ⚖️ Licença

MIT License - Uso livre, modificação, redistribuição permitida

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📜 Notas Importantes

- Este é um **kit de desenvolvimento**, não um SaaS pronto
- Para uso comercial, necessário implementar billing, login, etc.
- API keys (OpenAI, Anthropic) são responsabilidade do usuário
- O código é fornecido "AS IS" sem garantias

---

**Desenvolvido por:** Seu Nome
**Email:** seu@email.com
**Website:** https://seu-site.com
