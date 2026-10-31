# GoldAds 🪙📊

> Plataforma inteligente de gestão de tráfego pago (Meta Ads) integrada ao controle de estoque em tempo real para e-commerces.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql)
![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple?style=for-the-badge)

---

## 🎯 Sobre o Projeto

O **GoldAds** resolve um dos maiores problemas de lojistas e gestores de tráfego: **anunciar produtos que estão com estoque baixo ou zerado**. 

Ao cruzar os dados de campanhas do **Meta Ads** com o estoque físico da loja, a plataforma identifica gargalos operacionais, previne queima de verba em produtos esgotados e sugere estratégias automáticas de kits e upsell para desovar itens estagnados.

---

## ✨ Funcionalidades Principais

- 📈 **Dashboard Executivo & KPIs:** Visão consolidada de Faturamento, Investimento em Anúncios, ROAS Geral e Gráficos históricos (Receita vs. Gasto em Ads).
- 🚨 **Detector de Ruptura Imobiliária:** Alertas prioritários na tela inicial destacando produtos com baixo estoque que ainda possuem campanhas ativas consumindo verba.
- 📦 **Gestão de Estoque Completa (CRUD):** 
  - Cadastro manual de novos produtos (Nome, SKU, Preço de Venda, Custo e Estoque Inicial).
  - Edição ágil de quantidade diretamente nas linhas da tabela.
  - Estimativa de dias restantes antes do esgotamento com base no volume de vendas.
- 💡 **Motor de Insights & Kits:** Algoritmo que cruza o produto campeão de vendas (menor CPA) com itens de alto capital congelado, recomendando combinações de kits e order bumps.
- 🔗 **Conexão Oficial com Meta Ads:** Fluxo nativo OAuth 2.0 com Facebook para autorização de conta e seleção da Conta de Anúncios (*Ad Account*) correspondente.
- 🔐 **Autenticação Segura:** Registro e login criptografados via NextAuth (Auth.js v5) e `bcryptjs`.
- 🎨 **Interface Dark/Gold:** Design moderno e responsivo com foco em elegância e legibilidade de dados.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend & Fullstack:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Turbopack) & [React 19](https://react.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Visualização de Dados:** [Recharts](https://recharts.org/)
- **ORM & Banco de Dados:** [Prisma ORM v7](https://www.prisma.io/) com driver adapter PostgreSQL ([Supabase](https://supabase.com/))
- **Autenticação:** [NextAuth.js v5](https://authjs.dev/)
- **Deploy & Hospedagem:** [Vercel](https://vercel.com/)

---

## 🚀 Como Executar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/guxt4x/gold-seller.git
cd gold-seller
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados (Supabase / PostgreSQL)
DATABASE_URL="postgresql://usuario:senha@host:6543/postgres?pgbouncer=true"

# Autenticação (NextAuth)
AUTH_SECRET="sua-chave-secreta-aqui"

# Integração Meta Ads (Facebook Developers)
NEXT_PUBLIC_FACEBOOK_CLIENT_ID="1361586715477884"
FACEBOOK_CLIENT_SECRET="seu-facebook-client-secret"
```

### 4. Gerar o Cliente do Banco de Dados
```bash
npx prisma generate
```

### 5. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📁 Estrutura de Pastas

```text
├── prisma/
│   └── schema.prisma         # Modelagem do banco (User, Product, Campaign, AdMetric)
├── public/                   # Identidade visual, logos e assets estáticos
├── src/
│   ├── app/
│   │   ├── (auth)/           # Rotas públicas (login, register, onboarding)
│   │   ├── api/
│   │   │   ├── auth/         # Endpoints do NextAuth
│   │   │   └── meta/         # Callback OAuth e listagem de Ad Accounts
│   │   ├── dashboard/        # Painel autenticado (Visão Geral, Campanhas, Estoque, Insights, Configurações)
│   │   └── actions/          # Server Actions para mutação de dados e inventário
│   ├── components/           # Componentes modulares de UI, layout e gráficos
│   ├── lib/                  # Inicialização singleton do Prisma e utilitários
│   └── auth.ts               # Configuração do NextAuth v5
└── package.json
```

---

## 🗺️ Roadmap de Atualizações (Versão 2.0)

- [ ] **Sincronização Automática com Meta:** Rotina automatizada de ingestão diária de métricas de anúncios via Meta Graph API.
- [ ] **Integração Shopify:** Sincronização automática do catálogo de produtos e níveis de estoque via Shopify Admin API.
- [ ] **Planos & Assinaturas:** Checkout e gerenciamento de planos PRO com Stripe Billing & Webhooks.

---

## 📄 Licença

Este projeto é de uso privado e confidencial. Todos os direitos reservados.
