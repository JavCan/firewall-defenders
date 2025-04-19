import express from 'express'
import { 
  getEstadistica, 
  getEstadisticaPorTipo, 
  getEstadisticaUsuario, 
  getTiempoJuegoUsuario,
  getEstadisticasDashboard,
  getEstadisticaEspecifica
} from '../controllers/estadistica.controller.js'

const router = express.Router()

router.get('/api/estadistica', getEstadistica);
router.get('/api/estadistica/tipo/:tipo', getEstadisticaPorTipo);
router.get('/api/estadistica/usuario/:idUsuario', getEstadisticaUsuario);
router.get('/api/estadistica/usuario/:idUsuario/tiempo', getTiempoJuegoUsuario);
router.get('/api/estadistica/dashboard/:idUsuario', getEstadisticasDashboard);
router.get('/api/estadistica/usuario/:idUsuario/tipo/:tipoNombre', getEstadisticaEspecifica);

export { router }