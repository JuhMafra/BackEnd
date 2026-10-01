// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res
      .status(400)
      .send({ error: "Nome, usuário, email e senha são obrigatórios." });
  }

  try {
    // Verifica se o usuário ou email já existe
    const existingUser = await db.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email],
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).send({ error: "Usuário ou email já cadastrado." });
    }

    // Gera o hash da senha
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Salva o novo usuário no banco
    const newUser = await db.query(
      "INSERT INTO users (name, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, username, email",
      [name, username, email, password_hash],
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro ao registrar novo usuário." });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: "Usuário e senha são obrigatórios." });
  }

  try {
    // Busca o usuário no banco
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).send({ error: "Usuário não encontrado." });
    }

    // Compara a senha fornecida com o hash armazenado
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).send({ error: "Senha inválida." });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "1h" }, // Token expira em 1 hora
    );

    res.status(200).json({
      message: "Login bem-sucedido!",
      token: token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Erro interno do servidor." });
  }
};
