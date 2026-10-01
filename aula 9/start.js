// start.js
require("dotenv").config();

// Permite definir o ambiente via flag (--production, --dev, --test) ou variável de ambiente / .env
if (process.argv.includes("--production") || process.argv.includes("--prod")) {
  process.env.NODE_ENV = "production";
} else if (process.argv.includes("--dev") || process.argv.includes("--development")) {
  process.env.NODE_ENV = "development";
} else if (process.argv.includes("--test")) {
  process.env.NODE_ENV = "test";
}

const app = require("./server"); // Importa a instância do app Express

const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  if (process.env.NODE_ENV === "production") {
    console.log("Rodando em ambiente de PRODUÇÃO!");
  } else if (process.env.NODE_ENV === "test") {
    console.log("Rodando em ambiente de TESTE.");
  } else {
    console.log("Rodando em ambiente de DESENVOLVIMENTO.");
  }
});
