import express from 'express'
import { 
  getEstadistica, 
  getEstadisticaPorTipo, 
  getEstadisticaUsuario, 
  getTiempoJuegoUsuario 
} from '../controllers/estadistica.controller.js'

const router = express.Router()

router.get('/api/estadistica', getEstadistica);
router.get('/api/estadistica/tipo/:tipo', getEstadisticaPorTipo);
router.get('/api/estadistica/usuario/:idUsuario', getEstadisticaUsuario);
router.get('/api/estadistica/usuario/:idUsuario/tiempo', getTiempoJuegoUsuario);

export { router }