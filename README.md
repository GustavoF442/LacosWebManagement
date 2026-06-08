# Laço's — Painel Administrativo

Interface web para administração do app **Laço's - Minha Saúde Feminina**.

Gerenciamento de conteúdos educativos, configurações do site/app, visualização de usuárias cadastradas e relatórios com dados anonimizados.

---

## Stack

Next.js 14 · TypeScript · TailwindCSS · Supabase · Shadcn/ui · Recharts

---

## Rodando localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo de ambiente
cp .env.local.example .env.local
# Preencher com URL e Anon Key do seu projeto Supabase

# 3. Rodar
npm run dev
```

Acessar em `http://localhost:3000/admin/login`

---

## Banco de dados

O painel consome as mesmas tabelas do app mobile (`usuarias`, `conteudos`, `ciclos_menstruais`, `sintomas`, `lembretes`) e adiciona:

- Coluna `is_admin` (boolean) na tabela `usuarias` — define quem pode acessar o painel
- Tabela `configuracoes_site` — armazena textos institucionais, contatos e link do APK

Para conceder acesso admin:

```sql
UPDATE usuarias SET is_admin = true WHERE email = 'email-do-admin@exemplo.com';
```

---

## Segurança

O acesso é protegido em 3 camadas independentes:

1. **Middleware** — valida JWT do Supabase Auth em toda requisição `/admin/*`
2. **Layout (server-side)** — verifica `is_admin` no banco antes de renderizar qualquer conteúdo
3. **RLS no Supabase** — políticas no nível do banco impedem acesso mesmo que as camadas anteriores falhem

Credenciais ficam em `.env.local` (gitignored). Apenas a Anon Key pública é usada no client — nenhuma chave privada é exposta.

---

## Funcionalidades

| Rota | Descrição |
|------|-----------|
| `/admin` | Dashboard com totais e listagem recente |
| `/admin/conteudos` | CRUD de conteúdos educativos, filtro por categoria |
| `/admin/conteudos/novo` | Criar novo conteúdo |
| `/admin/conteudos/[id]` | Editar conteúdo existente |
| `/admin/site` | Textos do site, página Sobre, contatos, rede de apoio, link APK |
| `/admin/usuarias` | Lista de usuárias cadastradas (somente leitura) |
| `/admin/relatorios` | Gráficos: faixa etária, fase da vida, conteúdos por categoria |

---

## Estrutura do projeto

```
src/
├── app/
│   └── admin/
│       ├── login/            Tela de login
│       ├── conteudos/        Gestão de conteúdos
│       ├── site/             Configurações do site
│       ├── usuarias/         Visualização de usuárias
│       └── relatorios/       Relatórios e gráficos
├── components/
│   ├── admin/                Sidebar, header, stat-card, form
│   └── ui/                   Componentes base (shadcn/ui)
├── lib/
│   └── supabase/             Clients (browser, server, middleware)
├── types/                    Interfaces e constantes
└── middleware.ts             Proteção de rotas
```

---

## Observações

- Este painel é exclusivo para administração. Não replica funcionalidades do app mobile.
- Dados de ciclos e sintomas são visualizados apenas de forma agregada/anonimizada nos relatórios.
- O app mobile continua funcionando normalmente — o painel não interfere nas tabelas existentes.
