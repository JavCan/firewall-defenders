import express from 'express'
import { getCurrentUser, getUsuarios, getUsuario, getUsuarioPorEmail } from '../controllers/usuarios.controller.js'
import { verifyJWT } from '../middleware/jwt.middleware.js';
const router = express.Router()

// Reordering routes - specific routes must come before parameterized routes
router.get('/api/usuarios/me', verifyJWT, getCurrentUser);
router.get('/api/usuarios', getUsuarios);
router.get('/api/usuarios/email/:email', getUsuarioPorEmail); // This must come before the :id route
router.get('/api/usuarios/:id', getUsuario);

export { router }