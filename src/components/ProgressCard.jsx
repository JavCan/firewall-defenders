import React, { useState, useEffect } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { motion } from 'framer-motion'
import '../styles/ProgressCard.css'

const ProgressCard = () => {
  const [activeFilter, setActiveFilter] = useState('niveles')
  const [chartData, setChartData] = useState([])
  
  // Simulating data fetching from a database
  useEffect(() => {
    // This would be replaced with your actual database fetch
    const fetchData = () => {
      const data = {
        niveles: [
          { label: 'N1', value: 30 },
          { label: 'N2', value: 45 },
          { label: 'N3', value: 25 },
          { label: 'N4', value: 60 },
          { label: 'N5', value: 80 },
          { label: 'N6', value: 40 },
          { label: 'N7', value: 70 },
          { label: 'N8', value: 55 }
        ],
        torretas: [
          { label: 'T1', value: 50 },
          { label: 'T2', value: 65 },
          { label: 'T3', value: 35 },
          { label: 'T4', value: 75 },
          { label: 'T5', value: 45 },
          { label: 'T6', value: 60 }
        ],
        mejoras: [
          { label: 'M1', value: 60 },
          { label: 'M2', value: 40 },
          { label: 'M3', value: 85 },
          { label: 'M4', value: 30 },
          { label: 'M5', value: 55 },
          { label: 'M6', value: 70 },
          { label: 'M7', value: 45 }
        ]
      }
      
      setChartData(data[activeFilter] || [])
    }
    
    fetchData()
  }, [activeFilter])
  
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
      <motion.h2 
        className="progress-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.2 }}
      >
        Progreso
      </motion.h2>
      
      <motion.div 
        className="content-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.2 }}
      >
        <div className="chart-container">
          <div className="chart-axes">
            <div className="y-axis"></div>
            <div className="x-axis"></div>
            <div className="y-axis-ticks">
              <div className="y-tick" style={{ bottom: '25%' }}>25%</div>
              <div className="y-tick" style={{ bottom: '50%' }}>50%</div>
              <div className="y-tick" style={{ bottom: '75%' }}>75%</div>
            </div>
            <div className="x-axis-labels">
              {chartData.map((item, index) => (
                <div key={index} className="x-label">{item.label}</div>
              ))}
            </div>
          </div>
          <div className="chart">
            {chartData.map((item, index) => (
              <div key={index} className="chart-bar-container">
                <motion.div 
                  className="chart-bar"
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{ 
                    delay: 0.25 + (index * 0.02), 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200
                  }}
                  style={{ 
                    backgroundColor: `rgba(2, 190, 239, ${0.7 + (item.value / 200)})`
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="button-group">
          <motion.button 
            className={`filter-button ${activeFilter === 'niveles' ? 'active' : ''}`}
            onClick={() => setActiveFilter('niveles')}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaChevronLeft /> Niveles
          </motion.button>
          <motion.button 
            className={`filter-button ${activeFilter === 'torretas' ? 'active' : ''}`}
            onClick={() => setActiveFilter('torretas')}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaChevronLeft /> Torretas
          </motion.button>
          <motion.button 
            className={`filter-button ${activeFilter === 'mejoras' ? 'active' : ''}`}
            onClick={() => setActiveFilter('mejoras')}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaChevronLeft /> Mejoras
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProgressCard