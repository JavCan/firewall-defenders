import React, { useState } from 'react'
// Importa FaCoins
import { FaHome, FaChartBar, FaCoins } from 'react-icons/fa'
import { motion } from 'framer-motion'
import '../styles/Topbar.css'
import a from '../assets/a.png'

const aLogo = [
  { src: a },
];

// Modifica la desestructuración para recibir 'monedas' directamente
// y establece un valor por defecto para 'monedas' si no se proporciona.
const Topbar = ({ user = { email: 'correo@ejemplo.com', name: 'Usuario' }, monedas = 0 }) => {
  const [activeTab, setActiveTab] = useState('inicio')

  // Extrae solo name y email del usuario. 'monedas' ya se recibe como prop.
  const { name, email } = user;

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
        {/* Mueve la sección de monedas aquí, fuera de user-info */}
        <motion.div
          className="user-coins"
          // Elimina el style prop de aquí
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.2 }}
        >
          <span className='nav-button'>
            <FaCoins style={{ marginRight: '5px', color: '#FFD700' }} />
            {monedas}
            </span> {/* Muestra la cantidad de monedas */}
        </motion.div>

        {/* El contenedor user-info ahora solo tiene nombre y email */}
        <motion.div
          className="user-info"
          // Elimina el style prop de aquí
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          {/* Muestra el nombre y email */}
          <span className="user-name">{name}</span>
          <span className="username">{email}</span>
        </motion.div>
        
        {/* El avatar sigue al final */}
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
          {/* Asegúrate que 'name' exista antes de usar charAt */}
          {name ? name.charAt(0).toUpperCase() : '?'} 
        </motion.div>
      </div>
    </header>
  )
}

export default Topbar