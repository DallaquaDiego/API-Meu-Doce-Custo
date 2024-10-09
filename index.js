const express = require('express'); // Importa o Express
const cors = require('cors'); // Importa o Cors
const router = require('./routes/index');
const conecta = require('./config/db'); // Conexão com o banco de dados

const app = express(); 
const port = 3000; 
const ip = 'http://192.168.46.107:';

app.use(express.json()); 
app.use(cors());
app.use('/meu_doce_custo', router);

conecta.connect((error) => {
  if (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    return;
  }

  app.listen(port, (error) => {
    if (error) {
      console.log("Ocorreu um erro ao iniciar o servidor!");
      return;
    } else {
      console.log(`Servidor iniciado em ${ip}${port}/meu_doce_custo`);
    }
  });
});
