// server.js
const express = require("express");
require("dotenv").config(); // Carrega as variáveis de ambiente do arquivo .env

const authRoutes = require("./src/routes/authRoutes");
const tasksRoutes = require("./src/routes/tasksRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear o corpo das requisições em JSON
app.use(express.json());

// Rota de "saúde" da API
app.get("/", (req, res) => {
  res.send("API de Tarefas com Autenticação JWT está no ar!");
});

// Carrega as rotas de autenticação sob o prefixo /auth
app.use("/auth", authRoutes);

// Carrega as rotas de tarefas sob o prefixo /tasks
app.use("/tasks", tasksRoutes);

// Se executado diretamente (ex: node server.js), inicia o servidor.
// Se importado por outro arquivo (ex: start.js ou testes), apenas exporta o app.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app; // Exporta o app para ser usado em start.js e nos testes
