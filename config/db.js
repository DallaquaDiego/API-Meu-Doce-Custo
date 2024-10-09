const mysql = require("mysql");

const conecta = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "415399",
    database: "meu_doce_custo",
});

module.exports = conecta;