import LoginForm from './components/LoginForm'
import ParticleBackground from './components/ParticleBackground'
import BackgroundDecorations from './components/BackgroundDecorations'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <ParticleBackground />
      <BackgroundDecorations />
      <LoginForm />
    </div>
  )
}

export default App
