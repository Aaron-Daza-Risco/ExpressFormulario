const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursos.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Ruta para obtener todos los cursos (para administradores)
router.get('/all', authMiddleware, cursosController.getAllCursos);

// Ruta para obtener cursos filtrados por carrera_id y ciclo_id
router.get('/', authMiddleware, cursosController.getCursos);

// Ruta para obtener cursos del estudiante autenticado
router.get('/student', authMiddleware, cursosController.getCursosByStudent);

// Otras rutas existentes
router.post('/', authMiddleware, cursosController.createCurso);
router.put('/:id', authMiddleware, cursosController.updateCurso);
router.delete('/:id', authMiddleware, cursosController.deleteCurso);

module.exports = router;