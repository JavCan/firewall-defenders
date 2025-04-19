import express from 'express'
import { getUsuarios, getUsuario, getUsuarioPorEmail } from '../controllers/usuarios.controller.js'
const router = express.Router()

// Reordering routes - specific routes must come before parameterized routes
router.get('/api/usuarios', getUsuarios);
router.get('/api/usuarios/email/:email', getUsuarioPorEmail); // This must come before the :id route
router.get('/api/usuarios/:id', getUsuario);

export { router }