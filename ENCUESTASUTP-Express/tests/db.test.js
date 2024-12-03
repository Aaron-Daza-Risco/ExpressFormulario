// tests/db.test.js
const connection = require('../config/db.config');

// Prueba simple de conexión
console.log('Intentando conectar a la base de datos...');

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión:', err);
    process.exit(1);
  }
  
  // Prueba una consulta simple
  connection.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      console.error('Error en consulta:', err);
      process.exit(1);
    }
    
    console.log('Consulta exitosa:', results);
    console.log('Conexión establecida correctamente');
    
    // Cerrar conexión
    connection.end((err) => {
      if (err) {
        console.error('Error al cerrar conexión:', err);
        process.exit(1);
      }
      console.log('Conexión cerrada correctamente');
    });
  });
});