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
    // In a real app, you would validate credentials with an API
    console.log('Login attempt with:', userData)
    
    // For demo purposes, we'll just set authenticated to true
    setIsAuthenticated(true)
    setUser({
      name: 'Nombre Apellido',
      username: userData.identifier
    })
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
