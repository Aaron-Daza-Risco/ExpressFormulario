// server.js

const express = require('express');
const cors = require('cors');
const db = require('./config/db.config');

const app = express();

app.use(cors());
app.use(express.json());

// Prueba de conexión a la base de datos
db.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/cursos', require('./routes/cursos.routes'));
// Quitar esta línea si está comentada
// app.use('/api/preguntas', require('./routes/preguntas.routes'));

// Ajustar las rutas de encuestas
app.use('/api/encuestas', require('./routes/encuestas.routes'));

// Añadir las rutas de preguntas bajo encuestas
app.use('/api/encuestas', require('./routes/preguntas.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});