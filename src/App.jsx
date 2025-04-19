import { useState } from 'react'
import LoginForm from './components/LoginForm'
import ParticleBackground from './components/ParticleBackground'
import BackgroundDecorations from './components/BackgroundDecorations'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    console.log('Login attempt with:', userData)
    
    // Validación simplificada solo con correo electrónico
    if (userData.identifier === 'javier@prueba.com') {
      setIsAuthenticated(true)
      setUser({
        id: 1, // Este ID debe coincidir con el de tu base de datos
        name: 'Javier',
        email: userData.identifier
      })
    } else {
      // Mostrar mensaje de error
      alert('Correo electrónico no válido. Usa javier@prueba.com para pruebas.')
    }
  }

  return (
    <div className="app-container">
      <ParticleBackground />
      {!isAuthenticated ? (
        <>
          <BackgroundDecorations />
          <LoginForm onLogin={handleLogin} />
        </>
      ) : (
        <Dashboard user={user} />
      )}
    </div>
  )
}

export default App
