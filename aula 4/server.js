// src/server.js
const express = require("express");
const app = express();
const port = 3000;

// Middleware para o Express entender JSON no corpo das requisições
app.use(express.json());

// Middleware de Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Essencial para passar para o próximo middleware ou rota!
});

// Middleware de Autenticação
function autenticar(req, res, next) {
  const token = req.headers["x-token"]; // O cliente deve enviar o token neste cabeçalho

  if (token !== "senha") {
    // Se o token não for válido, bloqueamos a requisição com erro 401
    return res.status(401).json({ erro: "Token inválido. Acesso negado." });
  }

  // Se o token for válido, continuamos para a rota
  next();
}


// Um array para simular nosso "banco de dados" em memória
let livros = [
  { id: 1, descricao: "Genesis", concluida: true },
  { id: 2, descricao: "Exodo", concluida: false },
  { id: 3, descricao: "Levitico", concluida: false },
  { id: 4, descricao: "Numero", concluida: false },
];

// Rota principal
app.get("/", (req, res) => {
  res.send("Bem-vindo à API de Livros da Biblia!");
});
// GET /livros - Retorna todas as livros
app.get("/livros", (req, res) => {
  res.json(livros);
});
// POST /livros - Cria uma nova livro
app.post("/livros", autenticar, (req, res) => {
  const novoLivro = {
    id: livros.length + 1, // Simples geração de ID
    descricao: req.body.descricao,
    concluida: false,
  };
  livros.push(novoLivro);
  res.status(201).json(novoLivro); // 201 significa "Created"
});
// PUT /livros/:id - Atualiza uma livro existente
app.put("/livros/:id",autenticar, (req, res) => {
  const idLivro = parseInt(req.params.id);
  const livro = livros.find((t) => t.id === idLivro);

  if (!livro) {
    return res.status(404).json({ erro: "Livro não encontrado" }); // 404 Not Found
  }

  livro.descricao = req.body.descricao || livro.descricao;
  livro.concluida =
    req.body.concluida === undefined ? livro.concluida : req.body.concluida;

  res.json(livro);
});
// DELETE /livros/:id - Deleta uma livro
app.delete("/livros/:id", (req, res) => {
  const idLivro = parseInt(req.params.id);
  const index = livros.findIndex((t) => t.id === idLivro);

  if (index === -1) {
    return res.status(404).json({ erro: "Livro não encontrado" });
  }

  livros.splice(index, 1);
  res.status(204).send(); // 204 No Content
});
// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
