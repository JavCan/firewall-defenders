import React, { useState, useEffect, useRef } from 'react'
import { FaChevronDown, FaChevronUp, FaFlag, FaTowerObservation, FaSkull, FaGem } from 'react-icons/fa6'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/ProgressCard.css'

const ProgressCard = () => {
  const [activeFilter, setActiveFilter] = useState('todos')
  const [statsData, setStatsData] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  
  // Simulating data fetching from a database
  useEffect(() => {
    // This would be replaced with your actual database fetch
    const fetchData = () => {
      // Datos de ejemplo
      const allStats = [
        { 
          id: 'niveles', 
          title: 'Niveles completados', 
          value: 8, 
          icon: <FaFlag />, 
          color: '#4CAF50',
          description: '8/12 niveles superados'
        },
        { 
          id: 'torretas', 
          title: 'Torretas construidas', 
          value: 24, 
          icon: <FaTowerObservation />, 
          color: '#2196F3',
          description: '24 torretas en total'
        },
        { 
          id: 'enemigos', 
          title: 'Enemigos eliminados', 
          value: 156, 
          icon: <FaSkull />, 
          color: '#FF5722',
          description: '156 enemigos derrotados'
        },
        { 
          id: 'cristales', 
          title: 'Cristales recolectados', 
          value: 342, 
          icon: <FaGem />, 
          color: '#9C27B0',
          description: '342 cristales obtenidos'
        }
      ];
      
      if (activeFilter === 'todos') {
        setStatsData(allStats);
      } else {
        setStatsData(allStats.filter(stat => stat.id === activeFilter));
      }
    }
    
    fetchData()
  }, [activeFilter])
  
  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  // Obtener el texto del filtro activo
  const getFilterText = () => {
    switch(activeFilter) {
      case 'niveles': return 'Niveles'
      case 'torretas': return 'Torretas'
      case 'enemigos': return 'Enemigos'
      case 'cristales': return 'Cristales'
      case 'todos': return 'Todas'
      default: return 'Estadísticas'
    }
  }
  
  return (
    <motion.div 
      className="progress-card-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
      }}
    >
      <div className="header-row">
        <motion.h2 
          className="progress-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.2 }}
        >
          Progreso
        </motion.h2>
        
        <div className="dropdown-container" ref={menuRef}>
          <motion.button 
            className="dropdown-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            {getFilterText()} {isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
          </motion.button>
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                className="dropdown-menu"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className={`dropdown-item ${activeFilter === 'todos' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('todos')
                    setIsMenuOpen(false)
                  }}
                  whileHover={{ backgroundColor: 'rgba(30, 30, 63, 0.7)' }}
                >
                  Todas las estadísticas
                </motion.div>
                <motion.div 
                  className={`dropdown-item ${activeFilter === 'niveles' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('niveles')
                    setIsMenuOpen(false)
                  }}
                  whileHover={{ backgroundColor: 'rgba(30, 30, 63, 0.7)' }}
                >
                  Niveles completados
                </motion.div>
                <motion.div 
                  className={`dropdown-item ${activeFilter === 'torretas' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('torretas')
                    setIsMenuOpen(false)
                  }}
                  whileHover={{ backgroundColor: 'rgba(30, 30, 63, 0.7)' }}
                >
                  Torretas construidas
                </motion.div>
                <motion.div 
                  className={`dropdown-item ${activeFilter === 'enemigos' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('enemigos')
                    setIsMenuOpen(false)
                  }}
                  whileHover={{ backgroundColor: 'rgba(30, 30, 63, 0.7)' }}
                >
                  Enemigos eliminados
                </motion.div>
                <motion.div 
                  className={`dropdown-item ${activeFilter === 'cristales' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('cristales')
                    setIsMenuOpen(false)
                  }}
                  whileHover={{ backgroundColor: 'rgba(30, 30, 63, 0.7)' }}
                >
                  Cristales recolectados
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <motion.div 
        className="stats-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.2 }}
      >
        {statsData.map((stat, index) => (
          <motion.div 
            key={stat.id}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (index * 0.1), duration: 0.3 }}
            whileHover={{ 
              y: -5,
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)"
            }}
          >
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <motion.div 
                className="stat-value"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + (index * 0.1), type: "spring", stiffness: 200 }}
              >
                {stat.value}
              </motion.div>
              <div className="stat-description">{stat.description}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default ProgressCard