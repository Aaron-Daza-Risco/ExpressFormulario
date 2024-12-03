// config/db.config.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '*aalu123',
  database: 'encuestasUTP'
});

module.exports = connection;