const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const JWT_SECRET = 'minha_chave_secreta';

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  // Buscar o usuário pelo email
  const sql = `SELECT * FROM user WHERE email = ?`;
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar usuário" });
    if (results.length === 0) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    const user = results[0];

    // Verificar se a senha armazenada é em texto simples
    if (!user.password.startsWith('$2b$')) {
      // A senha está em texto simples, compará-la diretamente
      if (user.password === password) {
        // A senha está correta, agora vamos hashá-la e atualizar o banco de dados
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) return res.status(500).json({ error: "Erro ao hash a senha para bcrypt" });

          // Atualiza a senha no banco com o hash
          const updateSql = `UPDATE user SET password = ? WHERE email = ?`;
          db.query(updateSql, [hashedPassword, email], (err, result) => {
            if (err) {
              return res.status(500).json({ error: "Erro ao atualizar a senha no banco" });
            }

            const AccessToken = jwt.sign(
              { userId: user.id, email: user.email },
              JWT_SECRET,
              { expiresIn: '24h' }
            );

            res.json({
              user: {
                id: user.id,
                email: user.email
              },
              AccessToken,
            });
          });
        });
      } else {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }
    } else {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json({ error: "Erro ao verificar senha" });
        if (!isMatch) {
          return res.status(401).json({ error: "Email ou senha inválidos" });
        }

        // Gerar o token JWT
        const AccessToken = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          user: {
            id: user.id,
            email: user.email
          },
          AccessToken
        });
      });
    }
  });
};

module.exports = {
  login
};
