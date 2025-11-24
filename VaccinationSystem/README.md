# 🏥 VaxManager - Sistema de Controle de Vacinação

Sistema Full Stack desenvolvido para gerenciamento de cartões de vacinação, permitindo cadastro de pacientes, controle de doses e histórico vacinal.

## 🚀 Tecnologias Utilizadas

### Backend
- **.NET 9** (Web API)
- **Entity Framework Core** (ORM)
- **SQLite** (Banco de dados relacional)
- **Swagger/OpenAPI** (Documentação da API)

### Frontend
- **React 18** + **Vite**
- **Axios** (Integração API)
- **CSS3 Moderno** (Variáveis, Flexbox, Grid)

---

## ⚙️ Pré-requisitos

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18 ou superior)

---

## 🏃‍♂️ Como Rodar o Projeto

### 1. Backend (API)
Acesse a pasta da API e execute:

    cd VaccinationApi
    dotnet run

> O Backend rodará em `http://localhost:5136` (ou porta similar indicada no terminal). O banco de dados `vaccination.db` será criado automaticamente com dados iniciais de vacinas.

### 2. Frontend (Aplicação Web)
Em um **novo terminal**, acesse a pasta do cliente:

    cd vaccination-client
    npm install
    npm run dev

> O Frontend rodará em `http://localhost:5173`.

---

## 🧪 Funcionalidades Principais

1.  **Gerador de Dados (Setup):** Cria automaticamente 10 pacientes com histórico de vacinação cronológico para testes.
2.  **Reset de Administrador:** Permite limpar o banco de dados mediante senha (`1234`).
3.  **Controle de Doses:** Validação visual e lógica de doses aplicadas.
4.  **Anti-Duplicidade:** O sistema impede criação de vacinas duplicadas e valida CPFs únicos.

---

## 📂 Estrutura do Projeto

- **/VaccinationApi**: Código fonte do Backend C#.
- **/vaccination-client**: Código fonte do Frontend React.
- **/Models**: Definição das entidades (Person, Vaccine, VaccinationRecord).
- **/Data**: Contexto do banco e Seed Data.

---

**Desenvolvido por Isabella Rosseto**