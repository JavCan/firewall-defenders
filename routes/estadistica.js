import express from 'express'
import { 
  getEstadistica, 
  getEstadisticaPorTipo, 
  getEstadisticaUsuario, 
  getTiempoJuegoUsuario,
  getEstadisticaUsuarioPorTipo,
  getTiposEstadistica
} from '../controllers/estadistica.controller.js'

const router = express.Router()

router.get('/api/estadistica', getEstadistica);
router.get('/api/estadistica/tipos', getTiposEstadistica); // New endpoint to get all types
router.get('/api/estadistica/tipo/:idTipo', getEstadisticaPorTipo);
router.get('/api/estadistica/usuario/:idUsuario', getEstadisticaUsuario);
router.get('/api/estadistica/usuario/:idUsuario/tiempo', getTiempoJuegoUsuario);
router.get('/api/estadistica/usuario/:idUsuario/tipo/:idTipo', getEstadisticaUsuarioPorTipo);

export { router }