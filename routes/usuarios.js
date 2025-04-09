import express from 'express'
import { getUsuarios, getUsuario } from '../controllers/usuarios.controller.js'
const router = express.Router()


router.get('/', getUsuarios);
router.get('/:id', getUsuario);

export { router }