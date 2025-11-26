# 🏥 BTVacina - Sistema de Controle de Vacinação do BTG

Sistema Full Stack desenvolvido para gerenciamento de cartões de vacinação, permitindo cadastro de pacientes, controle de doses e histórico vacinal.

## 🌐 Demonstração Online (Live Demo)

O projeto está hospedado e funcional nos links abaixo:

- **Frontend (Aplicação):** https://sistema-de-vacina.vercel.app
- **Backend (API Swagger):** https://sistemadevacina.onrender.com

> **Nota sobre o Banco de Dados:** Como o backend está hospedado no plano gratuito do **Render** usando SQLite, o banco de dados pode ser resetado automaticamente se o servidor entrar em modo de hibernação por inatividade.

---

## ☁️ Arquitetura de Deploy

Para colocar a aplicação em produção, foi utilizada uma arquitetura de microsserviços separada:

1.  **Frontend (Vercel):** O React foi buildado via Vite e hospedado na Vercel, aproveitando a rede global de CDN para entrega rápida de arquivos estáticos.
2.  **Backend (Render + Docker):** A API .NET foi containerizada usando **Docker**. O Render orquestra esse container Linux, expondo a API para a internet.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **.NET 9** (Web API)
- **Entity Framework Core** (ORM)
- **SQLite** (Banco de dados relacional)
- **Docker** (Containerização para Deploy)
- **Swagger/OpenAPI** (Documentação da API)

### Frontend
- **React 18** + **Vite**
- **Axios** (Integração API)
- **CSS3 Moderno** (Variáveis, Flexbox, Grid)

---

## 🏃‍♂️ Como Rodar Localmente

### Pré-requisitos
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)

### 1. Backend (API)
Acesse a pasta da API e execute:

    cd VaccinationApi
    dotnet run

_O Backend rodará em http://localhost:5136._

### 2. Frontend (Web)
Em um **novo terminal**, acesse a pasta do cliente:

    cd vaccination-client
    npm install
    npm run dev

_O Frontend rodará em http://localhost:5173._

---

## 🧪 Funcionalidades Principais

1.  **Gerador de Dados (Setup):** Cria automaticamente 10 pacientes com histórico de vacinação cronológico.
2.  **Reset de Administrador:** Permite limpar o banco de dados mediante senha (1234).
3.  **Controle de Doses:** Validação visual e lógica de doses aplicadas.
4.  **Anti-Duplicidade:** Impede criação de vacinas duplicadas e valida CPFs únicos.

---

## 📂 Estrutura do Projeto

- **/VaccinationApi**: Código fonte do Backend C#.
- **/vaccination-client**: Código fonte do Frontend React.
- **Dockerfile**: Configuração da imagem para o Render.

---

**Desenvolvido por Isabella Rosseto**
"
