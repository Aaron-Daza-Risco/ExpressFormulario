// encuestas.routes.js
const express = require('express');
const router = express.Router();
const encuestasController = require('../controllers/encuestas.controller');
const preguntasController = require('../controllers/preguntas.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rutas base de encuestas
router.get('/', authMiddleware, encuestasController.getEncuestas);
router.post('/', authMiddleware, encuestasController.createEncuesta);
router.put('/:id', authMiddleware, encuestasController.updateEncuesta);
router.delete('/:id', authMiddleware, encuestasController.deleteEncuesta);

// Rutas para preguntas de encuesta
router.get('/:encuesta_id/preguntas', authMiddleware, preguntasController.getPreguntas);
router.post('/:encuesta_id/preguntas', authMiddleware, preguntasController.createPregunta);
router.put('/preguntas/:id', authMiddleware, preguntasController.updatePregunta);
router.delete('/preguntas/:id', authMiddleware, preguntasController.deletePregunta);

// Nuevas rutas
// Obtener encuestas por curso
router.get('/curso/:curso_id', authMiddleware, encuestasController.getEncuestasByCurso);

// Obtener preguntas por encuesta
router.get('/:encuesta_id/preguntas', authMiddleware, encuestasController.getPreguntasByEncuesta);

// Ruta para enviar respuestas
router.post('/respuestas', authMiddleware, encuestasController.submitRespuesta);

// encuestas.routes.js

// ... código existente ...

// Obtener encuestas pendientes por curso para el estudiante actual
router.get('/curso/:curso_id/pendientes', authMiddleware, encuestasController.getEncuestasPendientesByCurso);

module.exports = router;