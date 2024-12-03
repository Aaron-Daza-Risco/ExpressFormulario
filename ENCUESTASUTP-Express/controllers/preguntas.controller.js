const db = require('../config/db.config');

// Cambiar de 'preguntas' a 'preguntas_encuesta'
exports.getPreguntas = (req, res) => {
  const { encuesta_id } = req.params;

  const query = `SELECT * FROM preguntas_encuesta WHERE encuesta_id = ?`;

  db.query(query, [encuesta_id], (err, results) => {
    if (err) {
      console.error('Error al obtener preguntas:', err);
      res.status(500).send({ success: false, message: err.message });
      return;
    }
    res.send({ success: true, data: results });
  });
};

exports.createPregunta = (req, res) => {
  const { pregunta } = req.body;
  const { encuesta_id } = req.params; // Asegúrate de obtener encuesta_id desde los parámetros de la ruta
  const administrador_id = req.userId; // Del middleware de autenticación

  const query = `INSERT INTO preguntas_encuesta (encuesta_id, pregunta, administrador_id) VALUES (?, ?, ?)`;

  db.query(query, [encuesta_id, pregunta, administrador_id], (err, results) => {
    if (err) {
      console.error('Error al crear pregunta:', err);
      res.status(500).send({ success: false, message: err.message });
      return;
    }
    res.send({
      success: true,
      message: 'Pregunta creada exitosamente!',
      data: { id: results.insertId },
    });
  });
};
// Las funciones updatePregunta y deletePregunta pueden permanecer igual

exports.updatePregunta = (req, res) => {
  const { pregunta } = req.body;
  const preguntaId = req.params.id;

  const query = `UPDATE preguntas_encuesta SET pregunta = ? WHERE id = ?`;

  db.query(query, [pregunta, preguntaId], (err, results) => {
    if (err) {
      console.error('Error al actualizar pregunta:', err);
      res.status(500).send({ message: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Pregunta no encontrada' });
    }
    res.send({ message: 'Pregunta actualizada exitosamente!' });
  });
};
exports.deletePregunta = (req, res) => {
  const preguntaId = req.params.id;

  const query = `DELETE FROM preguntas_encuesta WHERE id = ?`;

  db.query(query, [preguntaId], (err, results) => {
    if (err) {
      console.error('Error al eliminar pregunta:', err);
      res.status(500).send({ message: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: 'Pregunta no encontrada' });
    }
    res.send({ message: 'Pregunta eliminada exitosamente!' });
  });
};