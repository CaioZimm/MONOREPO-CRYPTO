# 🚀 Crypto Platform

![Nexus Banner](https://via.placeholder.com/1200x400.png?text=Nexus+Crypto+Platform)

Crypto Platform é uma plataforma full-stack moderna para acompanhamento e conversão de criptomoedas em tempo real. Projetada com foco em performance, segurança e uma excelente experiência do usuário, a plataforma consome dados ao vivo da CoinGecko API.

---

## ✨ Funcionalidades

- **Autenticação Segura:** Login e cadastro com JWT (JSON Web Tokens) e proteção contra ataques de força bruta (Rate Limiting).
- **Conversão em Tempo Real:** Conversão de moedas fiduciárias (BRL, USD) para as criptomoedas mais populares do mercado.
- **Favoritos:** Salve suas criptomoedas preferidas para acesso rápido.
- **Histórico:** Acompanhe todo o seu histórico de conversões de forma paginada e detalhada.
- **Cache Inteligente:** Utiliza Redis para cachear consultas de preço, garantindo altíssima performance e evitando bloqueios de limite de requisições na API externa.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Vite**
- **Axios** (com interceptors globais)
- **Headless UI / React Icons**

### Backend
- **Node.js & Express.js**
- **PostgreSQL** (Banco de dados relacional)
- **Redis** (Cache de API e Blacklist de Tokens JWT)
- **Sequelize ORM**
- **Zod** (Validação de schemas e dados de entrada)
- **Helmet & Express Rate Limit** (Segurança)
- **Bcrypt & JWT** (Autenticação e Criptografia)

### DevOps & Infraestrutura
- **Docker & Docker Compose** (Containerização completa)

---

## 🏗️ Arquitetura do Backend

O backend segue os princípios da **Clean Architecture** e **SOLID**, com forte separação de responsabilidades:

- **Controllers:** Lidam com requisições e respostas HTTP.
- **Services:** Contêm toda a regra de negócio da aplicação.
- **Repositories:** Interagem diretamente com o banco de dados (Sequelize).
- **Middlewares:** Tratamento global de erros, validação (Zod) e autenticação (JWT/Redis).

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Docker](https://www.docker.com/) e Docker Compose
- [Node.js](https://nodejs.org/) (opcional, para rodar sem Docker)

### 2. Clonando o Repositório
```bash
git clone https://github.com/CaioZimm/MONOREPO-CRYPTO.git
cd MONOREPO-CRYPTO
```

### 3. Configurando as Variáveis de Ambiente
Copie os arquivos de exemplo para configurar seu ambiente local:

No backend:
```bash
cp backend/.env.example backend/.env
```

No frontend:
```bash
cp frontend/.env.example frontend/.env
```

### 4. Rodando com Docker (Recomendado)
Execute o comando abaixo na raiz do projeto. O Docker irá subir os containers para o Backend, Frontend, PostgreSQL e Redis, e rodar as migrations automaticamente.

```bash
docker-compose up --build
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000](http://localhost:8000)

---

## 🔒 Segurança Implementada

- **Senhas Hasheadas:** Bcrypt.js
- **Token Blacklisting:** JWTs invalidados no logout usando Redis.
- **Validação Rigorosa:** Zod para garantir que a API receba apenas os dados esperados.
- **Rate Limiting:** Prevenção contra brute-force attacks (ex: 20 req/15min em rotas de autenticação).
- **Helmet:** Adiciona cabeçalhos de segurança HTTP (XSS, HSTS, etc).

---

## 📄 Licença

Este projeto está sob a licença MIT. Feito para fins de estudo e portfólio.
