const jwt = require('jsonwebtoken');
const JWT_SECRET = 'minha_chave_secreta';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: "Acesso negado. Nenhum token fornecido." });
  }

  const tokenWithoutBearer = token.split(" ")[1] || token;

  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
