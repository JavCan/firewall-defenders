import React, { useState, useEffect, useRef } from 'react'
import { FaChevronDown, FaChevronUp, FaFlag, FaTowerObservation, FaSkull, FaGem } from 'react-icons/fa6'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/ProgressCard.css'

const ProgressCard = ({ userId = 1 }) => {
  const [activeFilter, setActiveFilter] = useState('todos')
  const [statsData, setStatsData] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const menuRef = useRef(null)
  
  // Mapping of idTipo to stat properties
  const statTypeMapping = {
    2: { 
      id: 'niveles', 
      title: 'Niveles completados', 
      icon: <FaFlag />, 
      color: '#4CAF50',
      descriptionTemplate: '{value}/12 niveles superados'
    },
    3: { 
      id: 'torretas', 
      title: 'Torretas construidas', 
      icon: <FaTowerObservation />, 
      color: '#2196F3',
      descriptionTemplate: '{value} torretas en total'
    },
    4: { 
      id: 'enemigos', 
      title: 'Enemigos eliminados', 
      icon: <FaSkull />, 
      color: '#FF5722',
      descriptionTemplate: '{value} enemigos derrotados'
    },
    5: { 
      id: 'cristales', 
      title: 'Cristales recolectados', 
      icon: <FaGem />, 
      color: '#9C27B0',
      descriptionTemplate: '{value} cristales obtenidos'
    }
  }
  
  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/estadistica/usuario/${userId}`)
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Filter out time-based statistics (those with non-zero valor_TIME)
        const filteredData = data.filter(stat => stat.valor_TIME === "00:00:00")
        
        // Transform API data to our component format
        const transformedData = filteredData.map(stat => {
          const typeInfo = statTypeMapping[stat.idTipo]
          
          if (!typeInfo) return null
          
          return {
            id: typeInfo.id,
            title: typeInfo.title,
            value: stat.valor_INT,
            icon: typeInfo.icon,
            color: typeInfo.color,
            description: typeInfo.descriptionTemplate.replace('{value}', stat.valor_INT)
          }
        }).filter(Boolean) // Remove null entries
        
        // Filter based on active filter
        if (activeFilter === 'todos') {
          setStatsData(transformedData)
        } else {
          setStatsData(transformedData.filter(stat => stat.id === activeFilter))
        }
      } catch (err) {
        console.error('Error fetching statistics:', err)
        setError('Failed to load statistics')
        setStatsData([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [activeFilter, userId])
  
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
        {loading ? (
          <div className="loading-message">Cargando estadísticas...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : statsData.length === 0 ? (
          <div className="no-data-message">No hay estadísticas disponibles</div>
        ) : (
          statsData.map((stat, index) => (
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
          ))
        )}
      </motion.div>
    </motion.div>
  )
}

export default ProgressCard