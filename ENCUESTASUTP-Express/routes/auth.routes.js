// routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Registro y login
router.post('/signup/admin', authController.signupAdmin);
router.post('/signup/student', authController.signupStudent);
router.post('/signin', authController.signin);

// Administradores
router.put('/admin/:id', authMiddleware, authController.updateAdmin);
router.delete('/admin/:id', authMiddleware, authController.deleteAdmin);

// Estudiantes
router.put('/student/:id', authMiddleware, authController.updateStudent);
router.delete('/student/:id', authMiddleware, authController.deleteStudent);

module.exports = router;