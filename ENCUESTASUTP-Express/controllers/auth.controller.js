const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');

exports.signupAdmin = (req, res) => {
  const { username, password, nombre, email, rol_id } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = `INSERT INTO administradores (username, password, nombre, email, rol_id) 
                 VALUES (?, ?, ?, ?, ?)`;
  
  db.query(query, [username, hashedPassword, nombre, email, rol_id], 
    (err, results) => {
      if (err) {
        res.status(500).send({ message: err.message });
        return;
      }
      res.send({ message: "Administrador registrado exitosamente!" });
    });
};

exports.signupStudent = (req, res) => {
  const { username, password, nombre, email, carrera_id, ciclo_id, rol_id } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = `INSERT INTO estudiantes (username, password, nombre, email, carrera_id, ciclo_id, rol_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(query, [username, hashedPassword, nombre, email, carrera_id, ciclo_id, rol_id], 
    (err, results) => {
      if (err) {
        res.status(500).send({ message: err.message });
        return;
      }
      res.send({ message: "Estudiante registrado exitosamente!" });
    });
};

exports.signin = (req, res) => {
  const { username, password, tipo } = req.body;

  let table;
  if (tipo === 'student') {
    table = 'estudiantes';
  } else if (tipo === 'admin') {
    table = 'administradores';
  } else {
    return res.status(400).send({ message: "Tipo de usuario inválido." });
  }

  const query = `SELECT * FROM ${table} WHERE username = ?`;

  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).send({ message: err.message });
    }
    if (results.length === 0) {
      return res.status(401).send({ message: "Credenciales inválidas." });
    }

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Contraseña inválida!"
      });
    }

    const token = jwt.sign(
      { id: user.id, tipo: tipo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Para estudiantes, incluir carrera_id y ciclo_id
    if (tipo === 'student') {
      return res.status(200).send({
        accessToken: token,
        id: user.id,
        tipo: tipo,
        nombre: user.nombre,
        email: user.email,
        carrera_id: user.carrera_id,
        ciclo_id: user.ciclo_id,
      });
    }

    // Para administradores
    return res.status(200).send({
      accessToken: token,
      id: user.id,
      tipo: tipo,
      nombre: user.nombre,
      email: user.email,
      rol_id: user.rol_id,
    });
  });
};

exports.updateAdmin = (req, res) => {
  const { nombre, email } = req.body;
  const adminId = req.params.id;

  const query = `UPDATE administradores 
                SET nombre = ?, email = ? 
                WHERE id = ?`;
  
  db.query(query, [nombre, email, adminId], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: "Administrador no encontrado" });
    }
    res.send({ message: "Administrador actualizado exitosamente!" });
  });
};

exports.updateStudent = (req, res) => {
  const { nombre, email, carrera_id, ciclo_id, rol_id } = req.body;
  const studentId = req.params.id;

  const query = `UPDATE estudiantes 
                 SET username = ?, nombre = ?, email = ?, carrera_id = ?, ciclo_id = ?, rol_id = ?
                 WHERE id = ?`;

  db.query(query, [req.body.username, nombre, email, carrera_id, ciclo_id, rol_id, studentId], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }

    if (results.affectedRows === 0) {
      return res.status(404).send({ message: "Estudiante no encontrado" });
    }

    res.send({ message: "Estudiante actualizado exitosamente!" });
  });
};

exports.deleteAdmin = (req, res) => {
  const adminId = req.params.id;
  
  const query = `DELETE FROM administradores WHERE id = ?`;
  
  db.query(query, [adminId], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: "Administrador no encontrado" });
    }
    res.send({ message: "Administrador eliminado exitosamente!" });
  });
};

exports.deleteStudent = (req, res) => {
  const studentId = req.params.id;
  
  const query = `DELETE FROM estudiantes WHERE id = ?`;
  
  db.query(query, [studentId], (err, results) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      return res.status(404).send({ message: "Estudiante no encontrado" });
    }
    res.send({ message: "Estudiante eliminado exitosamente!" });
  });
};
