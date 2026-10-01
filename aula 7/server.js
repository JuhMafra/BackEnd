const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  const inicio = Date.now();

  res.on("finish", () => {
    const tempo = Date.now() - inicio;

    console.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${tempo}ms`
    );
  });

  next();
});


// Banco de dados em memória
let produtos = [
  {
    id: 1,
    nome: "Notebook Gamer",
    preco: 7500,
    estoque: 30,
    categoria: "Eletrônicos",
  },
  {
    id: 2,
    nome: "Cadeira de Escritório",
    preco: 1200,
    estoque: 50,
    categoria: "Móveis",
  },
];

// 1. Endpoint para listar todos os produtos
app.get("/produtos", (req, res) => {
  res.json(produtos);
});

// 2. Endpoint para buscar um produto específico
app.get("/produtos/:id", (req, res) => {
  const idProduto = parseInt(req.params.id);
  const produto = produtos.find((p) => p.id === idProduto);
  if (produto) {
    res.json(produto);
  } else {
    res.send("Produto não encontrado.");
  }
});

// 3. Endpoint para adicionar um novo produto
app.post("/produtos", (req, res) => {
  const { nome, preco, estoque, categoria } = req.body;
  if (!req.body.nome || req.body.preco <= 0) {
    return res.status(400).json({ erro: "Nome e preço > 0 obrigatórios" });
  }
  const novoProduto = {
    id: produtos.length + 1,
    nome,
    preco: parseFloat(preco),
    estoque: parseInt(estoque),
    categoria,
  };
  produtos.push(novoProduto);
  res.status(201).json({
    mensagem: "Produto adicionado com sucesso.",
    produtos: produtos,
  });
});

// 4. Endpoint para modificar um produto
app.put("/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      erro: "Produto não encontrado"
    });
  }
  produtos[index] = {
    ...produtos[index],
    ...req.body
  };

  res.json(produtos[index]);
});

// PATCH - Atualização parcial de um produto
app.patch("/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = produtos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      erro: "Produto não encontrado",
    });
  }

  const { nome, preco, estoque, categoria } = req.body;

  // Validação do preço, caso tenha sido enviado
  if (preco !== undefined) {
    const precoNumerico = parseFloat(preco);

    if (isNaN(precoNumerico) || precoNumerico <= 0) {
      return res.status(400).json({
        erro: "O preço deve ser maior que 0",
      });
    }

    produtos[index].preco = precoNumerico;
  }

  // Atualiza somente os campos enviados
  if (nome !== undefined) {
    produtos[index].nome = nome;
  }

  if (estoque !== undefined) {
    produtos[index].estoque = parseInt(estoque);
  }

  if (categoria !== undefined) {
    produtos[index].categoria = categoria;
  }

  res.status(200).json(produtos[index]);
});


// 5. Endpoint para remover um produto
app.delete("/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find((p) => p.id === id);
  if (!produto) {
    return res.status(404).json({
      erro: "Produto não encontrado"
    });
  }
  produtos = produtos.filter((p) => p.id !== id);
  res.status(204).json({
    mensagem: "Produto removido com sucesso.",
    produtos
  });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
