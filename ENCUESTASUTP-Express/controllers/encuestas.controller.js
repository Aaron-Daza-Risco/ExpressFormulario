const db = require('../config/db.config');

exports.createEncuesta = (req, res) => {
  const { nombre, curso_id, fecha_inicio, fecha_fin } = req.body;
  
  const query = `INSERT INTO encuestas (nombre, curso_id, fecha_inicio, fecha_fin) 
                 VALUES (?, ?, ?, ?)`;
  
  db.query(query, [nombre, curso_id, fecha_inicio, fecha_fin], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    res.send({ 
      message: "Encuesta creada exitosamente!", 
      id: results.insertId 
    });
  });
};

exports.createPregunta = (req, res) => {
  const { encuesta_id, pregunta } = req.body;
  const administrador_id = req.userId; // Del middleware de auth
  
  const query = `INSERT INTO preguntas_encuesta (encuesta_id, pregunta, administrador_id) 
                 VALUES (?, ?, ?)`;
  
  db.query(query, [encuesta_id, pregunta, administrador_id], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    res.send({ 
      message: "Pregunta creada exitosamente!", 
      id: results.insertId 
    });
  });
};

// Enviar respuestas a encuesta
// controllers/encuestas.controller.js

exports.submitRespuesta = (req, res) => {
  const { pregunta_encuesta_id, respuesta } = req.body;
  const estudiante_id = req.userId; // Del middleware de auth

  console.log('Datos recibidos:', { pregunta_encuesta_id, respuesta, estudiante_id });

  // Validación de campos requeridos
  if (!pregunta_encuesta_id || respuesta === undefined) {
    return res.status(400).send({ message: "Datos incompletos para guardar la respuesta." });
  }

  // Validación de que 'respuesta' sea un número dentro del rango permitido (1-5, por ejemplo)
  if (typeof respuesta !== 'number' || respuesta < 1 || respuesta > 5) {
    return res.status(400).send({ message: "Respuesta inválida. Debe ser un número entre 1 y 5." });
  }

  // Verificar que la pregunta existe y pertenece a una encuesta activa
  const verificarPreguntaQuery = `
    SELECT e.id, e.curso_id, e.fecha_inicio, e.fecha_fin 
    FROM preguntas_encuesta p 
    JOIN encuestas e ON p.encuesta_id = e.id 
    WHERE p.id = ? AND NOW() BETWEEN e.fecha_inicio AND e.fecha_fin
  `;

  db.query(verificarPreguntaQuery, [pregunta_encuesta_id], (err, results) => {
    if (err) {
      console.error('Error al verificar la pregunta:', err);
      return res.status(500).send({ message: "Error al verificar la pregunta." });
    }

    if (results.length === 0) {
      return res.status(400).send({ message: "Pregunta no válida o la encuesta no está activa." });
    }

    // Insertar la respuesta en la base de datos
    const insertRespuestaQuery = `
      INSERT INTO respuestas_encuesta (pregunta_encuesta_id, estudiante_id, respuesta) 
      VALUES (?, ?, ?)
    `;

    db.query(insertRespuestaQuery, [pregunta_encuesta_id, estudiante_id, respuesta], (err, insertResults) => {
      if (err) {
        console.error('Error al guardar la respuesta:', err);
        return res.status(500).send({ message: "Error al guardar la respuesta." });
      }

      res.send({ message: "Respuesta guardada exitosamente." });
    });
  });
};

exports.getEncuestas = (req, res) => {
  const query = `SELECT * FROM encuestas`;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    res.send(results);
  });
};

exports.updateEncuesta = (req, res) => {
  const { nombre, curso_id, fecha_inicio, fecha_fin } = req.body;
  const encuestaId = req.params.id;
  
  const query = `UPDATE encuestas 
                 SET nombre = ?, curso_id = ?, fecha_inicio = ?, fecha_fin = ? 
                 WHERE id = ?`;
  
  db.query(query, [nombre, curso_id, fecha_inicio, fecha_fin, encuestaId], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: "Encuesta no encontrada" });
    }
    res.send({ message: "Encuesta actualizada exitosamente!" });
  });
};

exports.deleteEncuesta = (req, res) => {
  const encuestaId = req.params.id;
  
  const query = `DELETE FROM encuestas WHERE id = ?`;
  
  db.query(query, [encuestaId], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: "Encuesta no encontrada" });
    }
    res.send({ message: "Encuesta eliminada exitosamente!" });
  });
};

exports.updatePregunta = (req, res) => {
  const { pregunta } = req.body;
  const preguntaId = req.params.id;
  
  const query = `UPDATE preguntas_encuesta 
                SET pregunta = ?
                WHERE id = ?`;
  
  db.query(query, [pregunta, preguntaId], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: "Pregunta no encontrada" });
    }
    res.send({ message: "Pregunta actualizada exitosamente!" });
  });
};

exports.getPregunta = (req, res) => {
  const preguntaId = req.params.id;
  
  const query = `SELECT * FROM preguntas_encuesta WHERE id = ?`;
  
  db.query(query, [preguntaId], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (results.length === 0) {
      return res.status(404).send({ message: "Pregunta no encontrada" });
    }
    res.send(results[0]);
  });
};

exports.deletePregunta = (req, res) => {
  const preguntaId = req.params.id;
  
  const query = `DELETE FROM preguntas_encuesta WHERE id = ?`;
  
  db.query(query, [preguntaId], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: "Pregunta no encontrada" });
    }
    res.send({ message: "Pregunta eliminada exitosamente!" });
  });
};

// Obtener encuestas activas por curso
exports.getEncuestasByCurso = (req, res) => {
  const { curso_id } = req.params;

  const encuestaQuery = `
    SELECT * FROM encuestas 
    WHERE curso_id = ? 
      AND fecha_inicio <= NOW() 
      AND fecha_fin >= NOW()
  `;

  db.query(encuestaQuery, [curso_id], (err, encuestas) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    res.send(encuestas);
  });
};

// Obtener preguntas por encuesta
exports.getPreguntasByEncuesta = (req, res) => {
  const { encuesta_id } = req.params;

  const preguntasQuery = `SELECT * FROM preguntas_encuesta WHERE encuesta_id = ?`;

  db.query(preguntasQuery, [encuesta_id], (err, preguntas) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    res.send(preguntas);
  });
};

// ... código existente ...

// Obtener encuestas activas por curso que el estudiante no ha completado
exports.getEncuestasPendientesByCurso = (req, res) => {
  const { curso_id } = req.params;
  const estudiante_id = req.userId;

  const encuestaQuery = `
    SELECT e.*
    FROM encuestas e
    WHERE e.curso_id = ?
      AND e.fecha_inicio <= NOW()
      AND e.fecha_fin >= NOW()
      AND NOT EXISTS (
        SELECT 1
        FROM (
          SELECT pe.encuesta_id, COUNT(*) AS total_preguntas
          FROM preguntas_encuesta pe
          WHERE pe.encuesta_id = e.id
          GROUP BY pe.encuesta_id
        ) AS total_p
        JOIN (
          SELECT pe.encuesta_id, COUNT(*) AS total_respuestas
          FROM respuestas_encuesta re
          JOIN preguntas_encuesta pe ON re.pregunta_encuesta_id = pe.id
          WHERE re.estudiante_id = ?
            AND pe.encuesta_id = e.id
          GROUP BY pe.encuesta_id
        ) AS total_r ON total_p.encuesta_id = total_r.encuesta_id
        WHERE total_p.total_preguntas = total_r.total_respuestas
      )
  `;

  db.query(encuestaQuery, [curso_id, estudiante_id], (err, encuestas) => {
    if (err) {
      console.error('Error al obtener encuestas pendientes:', err);
      res.status(500).send({ message: err.message });
      return;
    }
    res.send(encuestas);
  });
};

// ... código existente ...