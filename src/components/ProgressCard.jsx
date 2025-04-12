import React, { useState } from 'react'
import { FaChevronLeft, FaGamepad, FaChessRook, FaArrowUp } from 'react-icons/fa'
import '../styles/ProgressCard.css'

const ProgressCard = () => {
  const [activeFilter, setActiveFilter] = useState('niveles')
  
  // Sample data for the chart
  const chartData = [
    { value: 30 },
    { value: 45 },
    { value: 25 },
    { value: 60 },
    { value: 80 },
    { value: 40 },
    { value: 70 }
  ]
  
  return (
    <div className="progress-card-container">
      <h2 className="progress-title">Progreso</h2>
      
      <div className="content-wrapper">
        <div className="chart-container">
          <div className="chart-axes">
            <div className="y-axis"></div>
            <div className="x-axis"></div>
          </div>
          <div className="chart">
            {chartData.map((item, index) => (
              <div 
                key={index}
                className="chart-bar"
                style={{ 
                  height: `${item.value}%`,
                  backgroundColor: `rgba(2, 190, 239, ${0.7 + (item.value / 200)})`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="button-group">
          <button 
            className={`filter-button ${activeFilter === 'niveles' ? 'active' : ''}`}
            onClick={() => setActiveFilter('niveles')}
          >
            <FaChevronLeft /> Niveles
          </button>
          <button 
            className={`filter-button ${activeFilter === 'torretas' ? 'active' : ''}`}
            onClick={() => setActiveFilter('torretas')}
          >
            <FaChevronLeft /> Torretas
          </button>
          <button 
            className={`filter-button ${activeFilter === 'mejoras' ? 'active' : ''}`}
            onClick={() => setActiveFilter('mejoras')}
          >
            <FaChevronLeft /> Mejoras
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProgressCard