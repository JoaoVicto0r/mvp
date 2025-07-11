# CulinaryCalc Dashboard

Sistema completo para gestão de receitas, insumos e custos culinários com painel administrativo integrado.

## 🚀 Funcionalidades

### Para Usuários
- **Gestão de Receitas**: Criação, edição e cálculo automático de custos
- **Controle de Insumos**: Gerenciamento de estoque com alertas
- **Análise Financeira**: Relatórios de custos, margem de lucro e performance
- **Fornecedores**: Cadastro e gestão de fornecedores
- **Suporte**: Sistema de tickets integrado

### Para Administradores
- **Dashboard Administrativo**: Visão completa do sistema
- **Gerenciamento de Usuários**: Ativar/desativar, alterar permissões
- **Suporte Técnico**: Responder tickets de suporte
- **Logs de Atividade**: Monitoramento completo das ações
- **Relatórios Globais**: Estatísticas de todo o sistema

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Banco de Dados**: Neon PostgreSQL
- **Autenticação**: JWT com cookies seguros
- **UI**: shadcn/ui, Radix UI, Lucide Icons

## 📋 Pré-requisitos

- Node.js 18+ 
- NPM ou Yarn
- Conta no Neon Database (gratuita)

## ⚙️ Instalação e Configuração

### 1. Clone o repositório
\`\`\`bash
git clone <seu-repositorio>
cd culinary-calc
\`\`\`

### 2. Instale as dependências
\`\`\`bash
npm install
\`\`\`

### 3. Configure o banco de dados Neon

1. **Criar conta no Neon**:
   - Acesse https://neon.tech
   - Crie uma conta gratuita
   - Crie um novo projeto

2. **Obter string de conexão**:
   - No dashboard do Neon, vá em "Connection Details"
   - Copie a string de conexão PostgreSQL

3. **Configurar variáveis de ambiente**:
   Crie um arquivo \`.env.local\` na raiz do projeto:
   \`\`\`env
   DATABASE_URL="postgresql://seu-usuario:sua-senha@ep-exemplo.us-east-2.aws.neon.tech/neondb?sslmode=require"
   JWT_SECRET="seu-jwt-secret-super-seguro-mude-isso-em-producao"
   NODE_ENV="development"
   \`\`\`

### 4. Executar scripts do banco de dados

Execute os scripts SQL na seguinte ordem no console SQL do Neon:

1. \`scripts/001-initial-schema.sql\` - Schema inicial
2. \`scripts/002-seed-data.sql\` - Dados iniciais
3. \`scripts/003-admin-features.sql\` - Funcionalidades admin
4. \`scripts/004-activity-logs.sql\` - Sistema de logs
5. \`scripts/005-insert-example-data.sql\` - Dados de exemplo

### 5. Executar o projeto
\`\`\`bash
npm run dev
\`\`\`

O sistema estará disponível em: http://localhost:3000

## 👥 Usuários Padrão

### Administrador
- **Email**: admin@culinarycalc.com
- **Senha**: admin123
- **Acesso**: Painel completo + área administrativa

### Usuário Teste
Registre-se normalmente pelo sistema ou crie via SQL.

## 📁 Estrutura do Projeto

\`\`\`
culinary-calc/
├── app/                    # Páginas e API routes
│   ├── admin/             # Painel administrativo
│   ├── api/               # API endpoints
│   ├── cadastro/          # Páginas de cadastro
│   ├── dashboard/         # Dashboard principal
│   ├── financeiro/        # Módulo financeiro
│   ├── insumos/          # Gestão de insumos
│   ├── login/            # Autenticação
│   ├── receitas/         # Gestão de receitas
│   └── suporte/          # Sistema de suporte
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn)
│   ├── admin-layout.tsx  # Layout administrativo
│   ├── admin-sidebar.tsx # Sidebar admin
│   ├── dashboard-layout.tsx # Layout padrão
│   └── sidebar.tsx       # Sidebar padrão
├── hooks/                # React hooks customizados
├── lib/                  # Utilitários e serviços
│   ├── admin.ts          # Serviços administrativos
│   ├── auth.ts           # Serviços de autenticação
│   ├── database.ts       # Conexão e tipos do banco
│   └── utils.ts          # Utilitários gerais
├── scripts/              # Scripts SQL
└── middleware.ts         # Middleware de autenticação
\`\`\`

## 🔐 Sistema de Autenticação

### Segurança Implementada
- **Senhas**: Hash bcrypt com salt rounds 12
- **JWT**: Tokens seguros com expiração de 7 dias
- **Cookies**: HTTPOnly, Secure, SameSite
- **Middleware**: Proteção de rotas automática
- **Roles**: Sistema de permissões (user/admin)

### Rotas Protegidas
- \`/dashboard/*\` - Usuários autenticados
- \`/admin/*\` - Apenas administradores
- \`/api/*\` - APIs protegidas por token

## 📊 Funcionalidades Administrativas

### Dashboard Admin (\`/admin\`)
- Estatísticas gerais do sistema
- Métricas de usuários ativos
- Status de tickets de suporte
- Visão geral de conteúdo

### Gerenciamento de Usuários (\`/admin/users\`)
- Listar todos os usuários
- Ativar/desativar contas
- Alterar permissões (user ↔ admin)
- Busca e filtros

### Sistema de Suporte (\`/admin/support\`)
- Visualizar todos os tickets
- Responder e alterar status
- Filtros por prioridade/status
- Histórico completo

### Logs de Atividade (\`/admin/activity\`)
- Monitoramento de ações
- Logs automáticos de eventos
- Rastreamento por usuário
- Detalhes técnicos

## 🔄 Fluxo de Desenvolvimento

### Para adicionar novas funcionalidades:

1. **Banco de Dados**: Criar migrations em \`scripts/\`
2. **Tipos**: Atualizar interfaces em \`lib/database.ts\`
3. **API**: Criar endpoints em \`app/api/\`
4. **Frontend**: Desenvolver páginas/componentes
5. **Middleware**: Configurar proteções se necessário

### Estrutura de API
\`\`\`
/api/
├── auth/              # Autenticação
├── admin/             # Endpoints administrativos
├── recipes/           # Gestão de receitas
├── ingredients/       # Gestão de insumos
├── suppliers/         # Gestão de fornecedores
└── support/           # Sistema de suporte
\`\`\`

## 🚀 Deploy em Produção

### Configurações necessárias:
1. **Banco**: Usar Neon em produção
2. **JWT_SECRET**: Chave forte e única
3. **NODE_ENV**: "production"
4. **Cookies**: Secure=true para HTTPS

### Plataformas recomendadas:
- **Vercel** (recomendado para Next.js)
- **Netlify**
- **Railway**

## 🤝 Suporte e Contribuição

Para dúvidas ou sugestões:
1. Use o sistema de tickets interno (\`/suporte\`)
2. Consulte a documentação no código
3. Verifique os logs de erro no console

## 📝 Licença

Este projeto é privado e proprietário.
\`\`\`

Este README deve ser colocado na raiz do projeto para orientar a instalação e uso completo do sistema.
