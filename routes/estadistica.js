import express from 'express'
import {
  getEstadistica,
  getEstadisticaPorTipo,
  getEstadisticaUsuario,
  getTiempoJuegoUsuario,
  getEstadisticaUsuarioPorTipo,
  getTiposEstadistica,
  upsertEstadistica,
  getTiempoJuegoSemanalUsuario,
  getMonedasGastadasPorNivelUsuario,
  registrarGastoMonedasPorNivel,
  iniciarSesionJuego, 
  finalizarSesionJuego,
  registrarUsoSticker,
  getUsoStickersUsuario 
} from '../controllers/estadistica.controller.js'
import { verifyJWT } from '../middleware/jwt.middleware.js';

const router = express.Router()

// --- Rutas GET existentes ---
router.get('/api/estadistica', getEstadistica);
router.get('/api/estadistica/tipos', getTiposEstadistica);
router.get('/api/estadistica/tipo/:idTipo', getEstadisticaPorTipo);
router.get('/api/estadistica/usuario/:idUsuario', verifyJWT, getEstadisticaUsuario); 
router.get('/api/estadistica/usuario/:idUsuario/tiempo', verifyJWT, getTiempoJuegoUsuario); 
router.get('/api/estadistica/usuario/:idUsuario/tipo/:idTipo', verifyJWT, getEstadisticaUsuarioPorTipo); 
router.get('/api/estadistica/usuario/:idUsuario/tiempo-semanal', verifyJWT, getTiempoJuegoSemanalUsuario);
router.get('/api/estadistica/usuario/:idUsuario/monedas-por-nivel', verifyJWT, getMonedasGastadasPorNivelUsuario);
router.get('/api/estadistica/stickers/uso', verifyJWT, getUsoStickersUsuario);

router.post('/api/estadistica', verifyJWT, upsertEstadistica);
router.post('/api/estadistica/sticker/usar', verifyJWT, registrarUsoSticker);

router.post('/api/monedas/gasto-nivel', verifyJWT, registrarGastoMonedasPorNivel);

router.post('/api/sesion/inicio', verifyJWT, iniciarSesionJuego);
router.post('/api/sesion/fin', verifyJWT, finalizarSesionJuego);

export { router }