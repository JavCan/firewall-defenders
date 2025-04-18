import express from 'express'
import { 
  getEstadistica, 
  getEstadisticaPorTipo, 
  getEstadisticaUsuario, 
  getTiempoJuegoUsuario 
} from '../controllers/estadistica.controller.js'

const router = express.Router()

router.get('/', getEstadistica);
router.get('/tipo/:tipo', getEstadisticaPorTipo);
router.get('/usuario/:idUsuario', getEstadisticaUsuario);
router.get('/usuario/:idUsuario/tiempo', getTiempoJuegoUsuario);

export { router }