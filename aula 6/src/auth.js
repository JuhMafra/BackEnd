// auth.js

// Carrega as variáveis de ambiente (necessário para acessar process.env.JWT_SECRET)
require("dotenv").config();
const jwt = require("jsonwebtoken");

/**
 * Middleware para autenticar o token JWT.
 * Ele será usado em todas as rotas que precisam de proteção.
 */
const authenticateToken = (req, res, next) => {
  // O token geralmente é enviado no cabeçalho de autorização no formato "Bearer TOKEN"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Se não houver token, retorna um erro 401 (Não Autorizado)
  if (token == null) return res.sendStatus(401);

  // Verifica se o token é válido
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // Se o token for inválido (expirado, malformado, etc.), retorna um erro 403 (Proibido)
    if (err) {
      console.error("Erro na verificação do token:", err);
      return res.sendStatus(403);
    }

    // Se o token for válido, o payload decodificado (que chamamos de 'user') é adicionado ao objeto da requisição (req)
    // Isso permite que as próximas rotas na cadeia de middleware acessem os dados do usuário (ex: req.user.id)
    req.user = user;

    // Chama a próxima função de middleware ou a rota final
    next();
  });
};

module.exports = { authenticateToken };