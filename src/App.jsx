import { useState, useEffect } from 'react'; // Asegúrate de importar useEffect si lo necesitas en otro lugar
import LoginForm from './components/LoginForm';
import ParticleBackground from './components/ParticleBackground';
import BackgroundDecorations from './components/BackgroundDecorations';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  // isLoading y error ahora se manejan dentro de LoginForm,
  // pero podrías mantenerlos aquí si necesitas un estado de carga/error global.

  // Modifica handleLogin para usar directamente los datos recibidos
  // Modifica handleLogin para ser async y obtener el ID
  const handleLogin = async (loginResponseData) => { // <--- Hacer la función async
    console.log('Login exitoso recibido en App:', loginResponseData);

    // Verifica los datos iniciales del login
    if (loginResponseData && loginResponseData.token && loginResponseData.email && loginResponseData.jwtToken) { // Asegúrate que jwtToken exista
      setIsAuthenticated(true);
      // Guarda la información básica inicial y los tokens
      const basicUserInfo = {
        email: loginResponseData.email,
        level: loginResponseData.level,
        name: loginResponseData.name,
        token: loginResponseData.token, // Token de sesión general (si lo usas para algo más)
        jwtToken: loginResponseData.jwtToken // Token JWT para llamadas API
      };
      // Actualiza el estado con la info básica (sin ID aún)
      setUser(basicUserInfo);

      // --- INICIO DE LA MODIFICACIÓN PARA OBTENER userId ---

      try {
        // Usa la URL completa del backend y el endpoint /me
        const response = await fetch('http://localhost:3000/api/usuarios/me', { // <-- URL CORREGIDA
          method: 'GET',
          headers: {
            // Añade el header de autorización con el jwtToken
            'Authorization': `Bearer ${loginResponseData.jwtToken}`, // <-- HEADER AÑADIDO
            'Content-Type': 'application/json' // Es buena práctica incluirlo aunque GET no tenga body
          }
        });

        if (!response.ok) {
          // Si la respuesta no es exitosa, lanza un error
          // Intenta leer el cuerpo del error si es posible
          let errorBody = '';
          try {
            errorBody = await response.text(); // o response.json() si esperas JSON
          } catch (e) {
             // Ignora si no se puede leer el cuerpo
          }
          throw new Error(`Error al obtener detalles del usuario: ${response.status} ${response.statusText}. ${errorBody}`);
        }

        // Parsea la respuesta JSON que debería contener el ID y otros datos
        const fullUserData = await response.json();

        // Asegúrate de que la respuesta contenga el 'id' (o 'userId' según tu backend)
        // Ajusta 'fullUserData.id' si tu backend devuelve el ID con otro nombre (ej: 'userId')
        const userId = fullUserData.id || fullUserData.userId;

        if (userId) {
          // Combina la información básica con la completa (incluyendo el id)
          const completeUser = {
            ...basicUserInfo, // Mantiene email, level, name, tokens
            ...fullUserData, // Sobrescribe campos si existen en fullUserData y añade nuevos
            id: userId, // Asegura que el id esté presente (usa la variable userId)
          };
          setUser(completeUser); // Actualiza el estado con el usuario completo (con ID)
          console.log('Detalles completos del usuario obtenidos y estado actualizado:', completeUser);
        } else {
          console.error('La respuesta de /api/usuarios/me no contiene un ID de usuario:', fullUserData);
          // Decide cómo manejar esto. Podrías mantener el estado básico o desautenticar.
        }

        // Opcional: guardar token en localStorage si lo usas para futuras llamadas API
        // localStorage.setItem('authToken', loginResponseData.jwtToken); // Guarda el JWT

      } catch (error) {
        console.error('Falló la obtención de detalles completos del usuario:', error);
        // Aquí puedes decidir qué hacer en caso de error.
        // Ejemplo:
        // setIsAuthenticated(false);
        // setUser(null);
        // alert('No se pudieron cargar los detalles completos del usuario. Inténtalo de nuevo.');
      }

      // --- FIN DE LA MODIFICACIÓN ---

    } else {
      // Este bloque se ejecuta si token, email o jwtToken no vienen en la respuesta inicial
      console.error('Datos de login iniciales inesperados o incompletos recibidos en App:', loginResponseData);
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // localStorage.removeItem('authToken'); // Limpia el token si lo guardaste
  };

  return (
    <div className="app-container">
      <ParticleBackground />
      {!isAuthenticated ? (
        <>
          <BackgroundDecorations />
          <LoginForm onLogin={handleLogin} />
        </>
      ) : (
        // Ahora 'user' contendrá el 'id' una vez que la llamada a /api/me sea exitosa
        // Asegúrate que Dashboard maneje el caso donde user.id aún no está disponible
        user && user.id ? (
           <Dashboard user={user} onLogout={handleLogout} />
        ) : (
           // Muestra un indicador de carga mientras se obtiene el ID
           <div>Cargando datos del usuario...</div>
        )

      )}
    </div>
  );
}

export default App;
