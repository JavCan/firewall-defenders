import React, { useState } from 'react'
import { FaHome, FaChartBar } from 'react-icons/fa'
import { motion } from 'framer-motion' // Importamos motion de framer-motion
import '../styles/Topbar.css'
import a from '../assets/a.png'

const aLogo = [
  { src: a },
];

const Topbar = ({ user = {email: 'correo@ejemplo.com', gamertag: 'Gamer' } }) => {
  const [activeTab, setActiveTab] = useState('inicio')
  
  return (
    <header className="topbar-container">
      <div className="left-section">
        {/* Reemplazamos el div por motion.div para el logo */}
        <motion.div 
          className="logo"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
          }}
          whileTap={{ scale: 0.97 }}
        >
          <img src={a} alt="ã" className="alogo" />
        </motion.div>
        <div className="nav-buttons">
          <motion.button 
            className={`nav-button ${activeTab === 'inicio' ? 'active' : ''}`}
            onClick={() => setActiveTab('inicio')}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaHome /> Inicio
          </motion.button>
          {/* <button 
            className={`nav-button ${activeTab === 'monitoreo' ? 'active' : ''}`}
            onClick={() => setActiveTab('monitoreo')}
          >
            <FaChartBar /> Monitoreo
          </button> */}
        </div>
      </div>
      
      <div className="right-section">
        <motion.div 
          className="user-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <span className="user-name">{user.name}</span>
          <span className="username">{user.email}</span>
        </motion.div>
        <motion.div 
          className="avatar"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
          }}
          whileTap={{ scale: 0.97 }}
        >
          {(user.name).charAt(0).toUpperCase()}
        </motion.div>
      </div>
    </header>
  )
}

export default Topbar