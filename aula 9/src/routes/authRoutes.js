// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rota para registrar um novo usuário
router.post("/register", authController.register);

// Rota para fazer login e obter um token
router.post("/login", authController.login);

module.exports = router;
