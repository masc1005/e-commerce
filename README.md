# E-Commerce API

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql&logoColor=white)
![Express](https://img.shields.io/badge/Express-4+-000000?logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

API REST para sistema de e-commerce desenvolvida com Node.js, TypeScript, Express e PostgreSQL.

## 🛠️ Tecnologias

- **Runtime**: Node.js 20+
- **Linguagem**: TypeScript 5+
- **Framework**: Express.js
- **Banco de Dados**: PostgreSQL 16+ com Drizzle ORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Validação**: Zod
- **Documentação**: Swagger/OpenAPI
- **Testes**: Vitest
- **Containerização**: Docker & Docker Compose

## 📋 Pré-requisitos

### Para uso com Docker (recomendado)

- [Docker](https://docs.docker.com/get-docker/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+

### Para desenvolvimento local

- [Node.js](https://nodejs.org/) 20+
- [PostgreSQL](https://www.postgresql.org/download/) 16+
- npm ou yarn

## ⚙️ Configuração Inicial

### 1. Clonar o repositório

```bash
git clone <repository-url>
cd e-commerce
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

### 3. Editar o arquivo `.env` (apenas desenvolvimento local)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/loomi
SERVER_PORT=3000
JWT_SECRET=seu_secret_aqui_muito_seguro

# Credenciais do admin padrão (opcional)
ADMIN_EMAIL=admin@loomi.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin Loomi
```

> ⚠️ **Para Docker**: Não é necessário configurar `.env`, o `docker-compose.yml` já está configurado.

## 🚀 Início Rápido

### Opção 1: Com Docker (Recomendado)

```bash
docker compose up --build
```

A API estará disponível em `http://localhost:3000`

**Credenciais admin padrão:**

- Email: `admin@loomi.com`
- Senha: `admin123`

### Opção 2: Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install

# 2. Gerar e executar migrations
npm run db:generate
npm run db:migrate

# 3. Criar admin padrão
npm run db:seed

# 4. Iniciar servidor
npm run dev
```

## 📚 Documentação da API

Após iniciar a aplicação, acesse o Swagger UI:

```
http://localhost:3000/api-docs
```

---

## 🔌 Endpoints da API

### Autenticação

| Método | Endpoint       | Descrição                     | Auth |
| ------ | -------------- | ----------------------------- | ---- |
| POST   | `/users`       | Signup público (cria cliente) | ❌   |
| POST   | `/users/login` | Login                         | ❌   |

### Usuários

| Método | Endpoint     | Descrição             | Auth     |
| ------ | ------------ | --------------------- | -------- |
| GET    | `/users`     | Listar usuários       | ✅ Admin |
| GET    | `/users/:id` | Buscar usuário por ID | ✅ Admin |
| PUT    | `/users/:id` | Atualizar usuário     | ✅ Admin |
| DELETE | `/users/:id` | Deletar usuário       | ✅ Admin |

### Clientes

| Método | Endpoint            | Descrição                             | Auth      |
| ------ | ------------------- | ------------------------------------- | --------- |
| POST   | `/clients`          | Criar cliente (gera senha automática) | ✅ Admin  |
| GET    | `/clients`          | Listar clientes                       | ✅ Admin  |
| GET    | `/clients/:id`      | Buscar cliente por ID                 | ✅        |
| PUT    | `/clients/:id`      | Atualizar cliente                     | ✅        |
| DELETE | `/clients/:id`      | Desativar cliente (soft delete)       | ✅        |
| PATCH  | `/clients/password` | Atualizar senha                       | ✅ Client |

### Produtos

| Método | Endpoint        | Descrição                     | Auth     |
| ------ | --------------- | ----------------------------- | -------- |
| POST   | `/products`     | Criar produto                 | ✅ Admin |
| GET    | `/products`     | Listar produtos (com filtros) | ✅       |
| GET    | `/products/:id` | Buscar produto por ID         | ✅       |
| PUT    | `/products/:id` | Atualizar produto             | ✅ Admin |
| DELETE | `/products/:id` | Deletar produto               | ✅ Admin |

**Filtros disponíveis em `/products`:**

| Parâmetro  | Tipo   | Descrição                         |
| ---------- | ------ | --------------------------------- |
| `name`     | string | Busca por nome (case-insensitive) |
| `minPrice` | number | Preço mínimo                      |
| `maxPrice` | number | Preço máximo                      |
| `page`     | number | Página (paginação)                |
| `limit`    | number | Itens por página                  |

### Pedidos (Orders)

| Método | Endpoint             | Descrição                    | Auth     |
| ------ | -------------------- | ---------------------------- | -------- |
| POST   | `/orders`            | Criar pedido                 | ✅       |
| GET    | `/orders`            | Listar pedidos (com filtros) | ✅       |
| GET    | `/orders/:id`        | Buscar pedido por ID         | ✅       |
| PATCH  | `/orders/:id/status` | Atualizar status do pedido   | ✅ Admin |
| DELETE | `/orders/:id`        | Deletar pedido               | ✅ Admin |
| GET    | `/orders/report`     | Gerar relatório CSV          | ✅ Admin |

**Filtros disponíveis em `/orders`:**

| Parâmetro   | Tipo   | Descrição                 |
| ----------- | ------ | ------------------------- |
| `clientId`  | UUID   | Filtrar por cliente       |
| `startDate` | date   | Data inicial (YYYY-MM-DD) |
| `endDate`   | date   | Data final (YYYY-MM-DD)   |
| `page`      | number | Página (paginação)        |
| `limit`     | number | Itens por página          |

**Status de Pedido:**

```
pending → processing → shipped → delivered
```

### Itens do Pedido (Order Items)

| Método | Endpoint           | Descrição                | Auth |
| ------ | ------------------ | ------------------------ | ---- |
| POST   | `/order-items`     | Adicionar item ao pedido | ✅   |
| GET    | `/order-items`     | Listar itens             | ✅   |
| GET    | `/order-items/:id` | Buscar item por ID       | ✅   |
| PUT    | `/order-items/:id` | Atualizar quantidade     | ✅   |
| DELETE | `/order-items/:id` | Remover item do pedido   | ✅   |

---

## 📝 Exemplos de Uso

### 1. Login

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@loomi.com",
    "password": "admin123"
  }'
```

### 2. Criar Cliente (Admin)

```bash
curl -X POST http://localhost:3000/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "contact": "11999999999",
    "address": "Rua ABC, 123"
  }'

# Resposta inclui senha gerada automaticamente
```

### 3. Listar Produtos com Filtros

```bash
curl -X GET "http://localhost:3000/products?name=agua&minPrice=5&maxPrice=50&page=1&limit=10" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 4. Criar Pedido

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "items": [
      { "productId": "uuid-produto", "quantity": 2 }
    ]
  }'
```

### 5. Listar Pedidos com Filtros

```bash
curl -X GET "http://localhost:3000/orders?startDate=2025-01-01&endDate=2025-12-31&page=1&limit=10" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 6. Gerar Relatório CSV

```bash
curl -X GET "http://localhost:3000/orders/report?startDate=2025-01-01&endDate=2025-12-31" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -o relatorio.csv
```

---

## 🔐 Segurança

### Criação de Usuários

- **Signup público**: Qualquer pessoa pode criar conta como `client`
- **Criação de admin**: Apenas admins autenticados podem criar outros admins
- **Criação de clients pelo admin**: Gera senha automática e retorna na resposta

### Autenticação

Todas as rotas (exceto signup e login) requerem token JWT:

```
Authorization: Bearer <token>
```

### Reativação de Clientes

Quando um cliente é desativado (soft delete) e tenta-se criar um novo cliente com o mesmo email, o sistema automaticamente reativa o cliente existente com os novos dados.

---

## 📦 Scripts Disponíveis

| Script                  | Descrição                               |
| ----------------------- | --------------------------------------- |
| `npm run dev`           | Inicia servidor em modo desenvolvimento |
| `npm run build`         | Compila TypeScript para JavaScript      |
| `npm start`             | Inicia servidor compilado               |
| `npm test`              | Executa testes                          |
| `npm run test:watch`    | Testes em modo watch                    |
| `npm run test:coverage` | Gera relatório de cobertura             |
| `npm run lint`          | Verifica erros de linting               |
| `npm run lint:fix`      | Corrige erros automaticamente           |
| `npm run format`        | Formata código com Prettier             |
| `npm run db:generate`   | Gera migrations do Drizzle              |
| `npm run db:migrate`    | Aplica migrations no banco              |
| `npm run db:seed`       | Cria admin padrão                       |
| `npm run db:studio`     | Abre Drizzle Studio                     |

---

## 🏗️ Estrutura do Projeto

```
src/
├── config/          # Configurações (banco de dados, etc)
├── controllers/     # Controladores HTTP
├── middlewares/     # Middlewares (auth, validação)
├── repositories/    # Camada de acesso a dados
├── routes/          # Definição de rotas
├── use-cases/       # Lógica de negócio
├── types/           # TypeScript types e DTOs
├── validators/      # Schemas de validação (Zod)
├── scripts/         # Scripts utilitários (seed, etc)
└── docs/            # Documentação Swagger (YAML)
```

---

## 🐳 Docker

### Comandos Úteis

```bash
# Iniciar containers
docker compose up -d

# Ver logs
docker compose logs -f app

# Parar containers
docker compose down

# Rebuild completo
docker compose up --build --force-recreate

# Limpar volumes (CUIDADO: apaga dados do banco)
docker compose down -v
```

### Fluxo de Inicialização

1. Container PostgreSQL inicia e cria database `loomi`
2. Healthcheck aguarda banco estar pronto
3. Container da aplicação inicia
4. Executa migrations (`npm run db:migrate`)
5. Cria admin padrão (`npm run db:seed`)
6. Inicia servidor Express

---

## 🤖 Uso de IA no Projeto

Este projeto foi desenvolvido com auxílio de ferramentas de Inteligência Artificial para aumentar a produtividade e qualidade do código.

### Ferramentas Utilizadas

| Ferramenta             | Uso                                            |
| ---------------------- | ---------------------------------------------- |
| **Claude Opus - Antigravity** | Pair programming, refatoração e debugging      |
| **Google Gemini** | Analise de projeto e plano de desenvolvimento      |

### Práticas Adotadas

- **Code Review com IA**: Revisão de código para identificar bugs, vulnerabilidades e melhorias
- **Geração de Testes**: Criação de casos de teste unitários;
- **Documentação**: Geração e melhoria de documentação técnica (README, Swagger)
- **Refatoração**: Sugestões de clean code e melhores práticas

### Benefícios Observados

- ⚡ **Velocidade**: Desenvolvimento mais rápido com autocompletar inteligente
- 🔍 **Qualidade**: Identificação precoce de bugs e code smells
- 📚 **Aprendizado**: Exposição a diferentes padrões e abordagens
- 📝 **Documentação**: README e Swagger mais completos e padronizados


### Sobre o uso

O uso de IA dentro desse projeto foi constantemente revisado, gostaria de comentar inclusive que foi solicitada a criação de um CRUD completo para a IA, o qual resultou em um código que não seguia os padrões de desenvolvimento adotados.

### Boas Práticas

1. **Sempre revisar** o código gerado por IA antes de commitar
2. **Entender** o código sugerido, não apenas copiar
3. **Testar** todas as funcionalidades geradas
4. **Validar** questões de segurança e performance

---

## 📝 Licença

ISC
