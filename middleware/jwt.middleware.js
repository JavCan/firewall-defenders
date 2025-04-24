import jwt from 'jsonwebtoken';
// No necesitas importar express aquí si solo exportas la función middleware

// Asegúrate de tener KEYPHRASE en tus variables de entorno (.env)
const JWT_SECRET = process.env.KEYPHRASE;

const verifyJWT = (req, res, next) => {
    // Verificar si la clave secreta está definida al inicio del middleware
    if (!JWT_SECRET) {
        console.error("FATAL ERROR: La variable de entorno KEYPHRASE (secreto JWT) no está definida.");
        return res.status(500).json({ mensaje: 'Error interno del servidor: Configuración de seguridad incompleta.' });
    }

    // Obtener token del header Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (token == null) {
        console.log('Middleware JWT: Token no proporcionado o formato incorrecto.');
        // 401 Unauthorized si no hay token
        return res.status(401).send({ mensaje: 'Token no proporcionado o formato incorrecto (se requiere Bearer)' });
    }

    jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
        if (err) {
            console.error('Middleware JWT: Error al verificar token:', err.message);
            // Diferenciar errores comunes
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ mensaje: 'Token expirado' }); // 401 para expirado
            }
            // 403 Forbidden para otros errores de token (inválido, malformado)
            return res.status(403).json({ mensaje: 'Token inválido' });
        }

        // ¡Éxito! Token válido. Adjuntamos el payload decodificado a req.user
        // Ahora las rutas protegidas pueden acceder a req.user.userId, req.user.email, etc.
        req.user = decodedPayload;
        console.log('Middleware JWT: Token verificado, usuario adjuntado:', req.user);
        next(); // Continuar a la siguiente función (el controlador de la ruta)
    });
};

// Exportamos la función middleware directamente para usarla en rutas específicas
export { verifyJWT };
// Ya no exportamos 'middleware' como un router