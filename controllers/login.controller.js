import axios from 'axios';
import jwt from 'jsonwebtoken'; // <-- Importar jsonwebtoken
import { findOrCreateUser } from './usuarios.controller.js';

const AULIFY_LOGIN_URL = 'https://www.aulify.mx/aulifyLogin';
const AULIFY_API_KEY = 'tec_api_KdZRQLUyMEJJHDqztZilqg';
// Asegúrate de tener KEYPHRASE en tus variables de entorno (.env)
const JWT_SECRET = process.env.KEYPHRASE;

const doLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Verificar si la clave secreta está definida
    if (!JWT_SECRET) {
        console.error("FATAL ERROR: La variable de entorno KEYPHRASE (secreto JWT) no está definida.");
        // En producción, podrías querer evitar que la aplicación funcione sin esto.
        // Considera lanzar un error o salir si es crítico.
        return res.status(500).json({ error: 'Error interno del servidor: Configuración de seguridad incompleta.' });
    }


    console.log(`Attempting login for email: ${email}`);

    const aulifyResponse = await axios.post(
      AULIFY_LOGIN_URL,
      { email: email, password: password },
      { headers: { 'X-Api-Key': AULIFY_API_KEY } }
    );

    if (aulifyResponse.status >= 200 && aulifyResponse.status < 300) {
      console.log('Aulify login successful:', aulifyResponse.data);
      const { email: aulifyEmail } = aulifyResponse.data;

      try {
        const localUser = await findOrCreateUser(aulifyEmail);
        console.log(`Usuario ${localUser.email} (ID: ${localUser.id}) asegurado en la base de datos local.`);

        // --- Inicio: Generación de JWT ---
        const payload = {
          userId: localUser.id, // ID de tu base de datos local
          email: localUser.email
        };

        // DEBUG: Verifica el ID que se va a incluir en el token
        console.log('>>> DEBUG: ID de usuario para JWT:', localUser.id);
        console.log('>>> DEBUG: Payload para JWT:', payload);

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        console.log(`JWT generado para el usuario ID: ${localUser.id}`);
        // --- Fin: Generación de JWT ---

        res.json({
            ...aulifyResponse.data,
            jwtToken: token
        });

      } catch (dbError) {
        console.error('Error interacting with local database:', dbError);
        res.status(500).json({ error: 'Login successful via external service, but failed to update local user data.' });
      }
    }
  } catch (error) {
    // Handle errors during the axios request or other issues
    // --- Inicio: Logging Mejorado ---
    console.error('Error during Aulify login process:');
    if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:');
        if (error.response) {
            // Error recibido desde la API de Aulify (e.g., 401, 403, 500)
            console.error(`  Status Code: ${error.response.status}`);
            console.error('  Response Data:', error.response.data); // Loguea la respuesta completa de Aulify
            console.error('  Response Headers:', error.response.headers);
        } else if (error.request) {
            // La petición se hizo pero no se recibió respuesta
            console.error('  No response received from Aulify. Request details:', error.request);
        } else {
            // Error al configurar la petición
            console.error('  Error setting up Axios request:', error.message);
        }
    } else {
        // Otro tipo de error (no relacionado con Axios directamente)
        console.error('Non-Axios Error:', error.message);
    }
    // --- Fin: Logging Mejorado ---


    if (axios.isAxiosError(error) && error.response) {
      // Error desde la API de Aulify (e.g., 401 Invalid credentials, 403 No active membership)
      // Devolvemos el estado y el mensaje de error de Aulify
      const details = error.response.data || { error: 'Could not connect to authentication service or received empty response.' };
      const responseDetails = typeof details === 'string' ? { error: details } : details;

      // Devolvemos el status code recibido de Aulify
      res.status(error.response.status).json({
        error: 'Authentication failed via external service.', // Mensaje genérico
        details: responseDetails // Detalles específicos de Aulify
      });
    } else {
      // Network errors or other unexpected errors
      res.status(500).json({ error: 'An internal server error occurred during login.' });
    }
  }
};

export { doLogin };