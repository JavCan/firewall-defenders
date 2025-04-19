import express from 'express'
import { getUsuarios, getUsuario, getUsuarioPorEmail } from '../controllers/usuarios.controller.js'
const router = express.Router()


router.get('/api/usuarios', getUsuarios);
router.get('/api/usuarios/:id', getUsuario);
router.get('/api/usuarios/email/:email', getUsuarioPorEmail);

export { router }