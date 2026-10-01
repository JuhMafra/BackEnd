// login.js

// Carrega as variáveis de ambiente
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Usado para comparar senhas de forma segura
const db = require("./db");

const router = express.Router();

// Rota de login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email e senha são obrigatórios.");
  }

  try {
    // 1. Buscar o usuário no banco de dados pelo email
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // Verifica se o usuário foi encontrado
    if (rows.length === 0) {
      return res.status(401).send("Email ou senha incorretos.");
    }

    const user = rows[0];

    // 2. Comparar a senha enviada com o hash armazenado no banco
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send("Email ou senha incorretos.");
    }

    // 3. Se a senha for válida, gerar o token JWT
    const payload = { id: user.id, name: user.name, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // O token expira em 1 hora
    });

    // Retorna o token para o cliente
    res.json({ accessToken });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).send("Erro interno ao tentar fazer login.");
  }
});

module.exports = router;