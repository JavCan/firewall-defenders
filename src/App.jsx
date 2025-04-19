import { useState } from 'react'
import LoginForm from './components/LoginForm'
import ParticleBackground from './components/ParticleBackground'
import BackgroundDecorations from './components/BackgroundDecorations'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (userData) => {
    console.log('Login attempt with:', userData)
    setIsLoading(true)
    setError(null)
    
    try {
      // Consultar a la API si el usuario existe
      const response = await fetch(`/api/usuarios/email/${userData.identifier}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Usuario no encontrado. Verifica tus credenciales.')
        }
        throw new Error('Error al verificar el usuario')
      }
      
      const data = await response.json()
      
      // Si el usuario existe en la base de datos
      setIsAuthenticated(true)
      setUser({
        id: data.id,
        email: data.email,
        gamertag: data.gamertag
      })
      
    } catch (error) {
      console.error('Error durante el login:', error)
      setError(error.message)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <ParticleBackground />
      {!isAuthenticated ? (
        <>
          <BackgroundDecorations />
          <LoginForm onLogin={handleLogin} isLoading={isLoading} error={error} />
        </>
      ) : (
        <Dashboard user={user} />
      )}
    </div>
  )
}

export default App
