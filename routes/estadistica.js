import express from 'express'
import {
  getEstadistica,
  getEstadisticaPorTipo,
  getEstadisticaUsuario,
  getTiempoJuegoUsuario,
  getEstadisticaUsuarioPorTipo,
  getTiposEstadistica,
  upsertEstadistica,
  getTiempoJuegoSemanalUsuario // <-- Importar la nueva función
} from '../controllers/estadistica.controller.js'
import { verifyJWT } from '../middleware/jwt.middleware.js'; // <-- Importar middleware JWT

const router = express.Router()

// --- Rutas GET existentes ---
// Considera si estas rutas también deberían estar protegidas por JWT
router.get('/api/estadistica', getEstadistica);
router.get('/api/estadistica/tipos', getTiposEstadistica);
router.get('/api/estadistica/tipo/:idTipo', getEstadisticaPorTipo);
router.get('/api/estadistica/usuario/:idUsuario', verifyJWT, getEstadisticaUsuario); // Protegida
router.get('/api/estadistica/usuario/:idUsuario/tiempo', verifyJWT, getTiempoJuegoUsuario); // Protegida
router.get('/api/estadistica/usuario/:idUsuario/tipo/:idTipo', verifyJWT, getEstadisticaUsuarioPorTipo); // Protegida

// --- NUEVA RUTA GET para obtener tiempo de juego semanal ---
// Protegida por JWT. El idUsuario se obtiene del token dentro del controlador.
// Aunque la ruta incluye :idUsuario, el controlador priorizará el ID del token.
// Podríamos quitar :idUsuario de la ruta si SIEMPRE se va a obtener del token,
// pero mantenerlo puede ser útil para administradores en el futuro (con lógica de permisos adicional).
// Por ahora, lo dejamos pero usamos el token ID en el controller.
router.get('/api/estadistica/usuario/:idUsuario/tiempo-semanal', verifyJWT, getTiempoJuegoSemanalUsuario);


// --- RUTA POST existente para crear/actualizar estadísticas ---
router.post('/api/estadistica', verifyJWT, upsertEstadistica); // Ya protegida

export { router }