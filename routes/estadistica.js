import express from 'express'
import {
  getEstadistica,
  getEstadisticaPorTipo,
  getEstadisticaUsuario,
  getTiempoJuegoUsuario,
  getEstadisticaUsuarioPorTipo,
  getTiposEstadistica,
  upsertEstadistica // <-- Importar la nueva función
} from '../controllers/estadistica.controller.js'
import { verifyJWT } from '../middleware/jwt.middleware.js'; // <-- Importar middleware JWT

const router = express.Router()

// --- Rutas GET existentes ---
router.get('/api/estadistica', getEstadistica); // Podría requerir autenticación también?
router.get('/api/estadistica/tipos', getTiposEstadistica); // Endpoint público para tipos
router.get('/api/estadistica/tipo/:idTipo', getEstadisticaPorTipo); // Podría requerir autenticación?
// Rutas GET específicas de usuario (ya deberían estar protegidas si es necesario)
router.get('/api/estadistica/usuario/:idUsuario', getEstadisticaUsuario); // Considerar proteger con JWT y usar req.user.userId
router.get('/api/estadistica/usuario/:idUsuario/tiempo', getTiempoJuegoUsuario); // Considerar proteger con JWT
router.get('/api/estadistica/usuario/:idUsuario/tipo/:idTipo', getEstadisticaUsuarioPorTipo); // Considerar proteger con JWT

// --- NUEVA RUTA POST para crear/actualizar estadísticas ---
// Protegida por JWT: Solo usuarios logueados pueden actualizar sus estadísticas.
// El idUsuario se tomará del token, no de la URL o el body.
router.post('/api/estadistica', verifyJWT, upsertEstadistica);

export { router }