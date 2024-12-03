const express = require('express');
const router = express.Router({ mergeParams: true }); // Importante para acceder a los parámetros de la ruta padre
const preguntasController = require('../controllers/preguntas.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Obtener preguntas de una encuesta específica
router.get('/:encuesta_id/preguntas', authMiddleware, preguntasController.getPreguntas);

// Crear una nueva pregunta para una encuesta
router.post('/:encuesta_id/preguntas', authMiddleware, preguntasController.createPregunta);

// Actualizar una pregunta existente
router.put('/preguntas/:id', authMiddleware, preguntasController.updatePregunta);

// Eliminar una pregunta
router.delete('/preguntas/:id', authMiddleware, preguntasController.deletePregunta);

module.exports = router;