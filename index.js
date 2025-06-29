import express from 'express'
import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config();
console.log('[index.js] DBNAME from process.env:', process.env.DBNAME);

import { router as usuariosRouter } from './routes/usuarios.js'; // Renamed import
import { router as estadisticaRouter } from './routes/estadistica.js'; // Renamed import
import { loginRouter } from './routes/login.js'; // Import the new login router

const app = express()
const port = process.env.PORT || 3000

// Middleware
// app.use(cors()) // Comentamos o eliminamos la configuración CORS simple
app.use(cors({
  origin: '*', // Permite cualquier origen. Para producción, considera restringirlo a tu dominio frontend.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'] // Cabeceras permitidas
}));
app.use(express.json()) // Middleware to parse JSON bodies

// Rutas
// Añadimos el prefijo y el middleware de logging para las rutas de usuarios
app.use('/', (req, res, next) => {
    console.log(`>>> Petición recibida en /api/usuarios: ${req.method} ${req.originalUrl}`);
    next(); // Pasa al siguiente middleware (el router de usuarios)
}, usuariosRouter); // Monta el router de usuarios bajo /api/usuarios

app.get('/', (req, res) => {
  res.send('Hola desde el servidor de Firewall Defenders!')
});

// Mantenemos las otras rutas como estaban (asumiendo que no necesitan el prefijo /api/ o ya lo tienen definido internamente)
// Si necesitas prefijos o logging para estas, habría que modificarlas de forma similar.
app.use(estadisticaRouter);
app.use(loginRouter); // Use the login router

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`)
})