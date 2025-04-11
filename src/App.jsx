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
    // In a real app, you would validate credentials here
    console.log('Login successful:', userData)
    setUser({
      name: 'Nombre Apellido',
      username: 'Username'
    })
    setIsAuthenticated(true)
  }

  return (
    <div className="app-container">
      {isAuthenticated ? (
        <Dashboard user={user} />
      ) : (
        <>
          <ParticleBackground />
          <BackgroundDecorations />
          <LoginForm onLogin={handleLogin} />
        </>
      )}
    </div>
  )
}

export default App
