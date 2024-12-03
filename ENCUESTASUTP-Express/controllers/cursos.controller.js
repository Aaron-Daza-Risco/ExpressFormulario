const db = require('../config/db.config');

// Obtener cursos filtrados por carrera_id y ciclo_id
exports.getCursos = (req, res) => {
  const { carrera_id, ciclo_id } = req.query;
  
  const query = `SELECT * FROM cursos WHERE carrera_id = ? AND ciclo_id = ?`;
  
  db.query(query, [carrera_id, ciclo_id], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    res.send(results);
  });
};

exports.createCurso = (req, res) => {
  const { nombre, ciclo_id, carrera_id } = req.body;
  
  const query = `INSERT INTO cursos (nombre, ciclo_id, carrera_id) VALUES (?, ?, ?)`;
  
  db.query(query, [nombre, ciclo_id, carrera_id], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    res.send({ message: "Curso creado exitosamente!", id: results.insertId });
  });
};

exports.updateCurso = (req, res) => {
  const { nombre } = req.body;
  const cursoId = req.params.id;

  const query = `UPDATE cursos SET nombre = ? WHERE id = ?`;
  
  db.query(query, [nombre, cursoId], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: "Curso no encontrado" });
    }
    res.send({ message: "Curso actualizado exitosamente!" });
  });
};

exports.deleteCurso = (req, res) => {
  const cursoId = req.params.id;
  
  const query = `DELETE FROM cursos WHERE id = ?`;
  
  db.query(query, [cursoId], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: "Curso no encontrado" });
    }
    res.send({ message: "Curso eliminado exitosamente!" });
  });
};

// En cursos.controller.js (backend)
exports.getAllCursos = (req, res) => {
  const query = `
    SELECT c.*, ca.nombre as carrera_nombre, ci.numero as ciclo_numero 
    FROM cursos c
    JOIN carreras ca ON c.carrera_id = ca.id
    JOIN ciclos ci ON c.ciclo_id = ci.id
    ORDER BY ca.nombre, ci.numero, c.nombre
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    res.send({ data: results }); // Asegurado que está envuelto en { data: ... }
  });
};

// Obtener cursos del estudiante autenticado
// cursos.controller.js

exports.getCursosByStudent = (req, res) => {
  const studentId = req.userId;
  console.log(`Obteniendo cursos para el estudiante ID: ${studentId}`);

  const studentQuery = `SELECT carrera_id, ciclo_id FROM estudiantes WHERE id = ?`;

  db.query(studentQuery, [studentId], (err, results) => {
    if (err) {
      console.error('Error en la consulta de estudiante:', err);
      return res.status(500).send({ message: err.message });
    }
    if (results.length === 0) {
      console.log('Estudiante no encontrado.');
      return res.status(404).send({ message: "Estudiante no encontrado." });
    }
    const { carrera_id, ciclo_id } = results[0];
    console.log(`Carrera ID: ${carrera_id}, Ciclo ID: ${ciclo_id}`);

    const cursosQuery = `SELECT * FROM cursos WHERE carrera_id = ? AND ciclo_id = ?`;
    console.log(`Ejecutando consulta de cursos: ${cursosQuery} con parámetros ${carrera_id}, ${ciclo_id}`);

    db.query(cursosQuery, [carrera_id, ciclo_id], (err, cursos) => {
      if (err) {
        console.error('Error en la consulta de cursos:', err);
        return res.status(500).send({ message: err.message });
      }
      console.log(`Cursos obtenidos: ${JSON.stringify(cursos)}`);
      res.send({ data: cursos }); // Cambiado aquí
    });
  });
};