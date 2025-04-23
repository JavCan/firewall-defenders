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
app.use(cors())
app.use(express.json()) // Middleware to parse JSON bodies

// Rutas
app.use(usuariosRouter); 
app.use(estadisticaRouter);
app.use(loginRouter); // Use the login router

app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`)
})