import express from 'express'
import { getUsuarios, getUsuario } from '../controllers/usuarios.controller.js'
const router = express.Router()


router.get('api/usuarios', getUsuarios);
router.get('api/usuarios/:id', getUsuario);

export { router }