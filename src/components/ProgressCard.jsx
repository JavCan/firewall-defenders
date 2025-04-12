import React, { useState, useEffect } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
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
    <div className="progress-card-container">
      <h2 className="progress-title">Progreso</h2>
      
      <div className="content-wrapper">
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
                <div 
                  className="chart-bar"
                  style={{ 
                    height: `${item.value}%`,
                    backgroundColor: `rgba(2, 190, 239, ${0.7 + (item.value / 200)})`
                  }}
                />
              </div>
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