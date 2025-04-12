import React, { useState } from 'react'
import { FaHome, FaChartBar } from 'react-icons/fa'
import '../styles/Topbar.css'

const Topbar = ({ user = { name: 'Nombre Apellido', username: 'Username' } }) => {
  const [activeTab, setActiveTab] = useState('inicio')
  
  return (
    <header className="topbar-container">
      <div className="left-section">
        <div className="logo">ā</div>
        <div className="nav-buttons">
          <button 
            className={`nav-button ${activeTab === 'inicio' ? 'active' : ''}`}
            onClick={() => setActiveTab('inicio')}
          >
            <FaHome /> Inicio
          </button>
          <button 
            className={`nav-button ${activeTab === 'monitoreo' ? 'active' : ''}`}
            onClick={() => setActiveTab('monitoreo')}
          >
            <FaChartBar /> Monitoreo
          </button>
        </div>
      </div>
      
      <div className="right-section">
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="username">{user.username}</span>
        </div>
        <div className="avatar">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  )
}

export default Topbar