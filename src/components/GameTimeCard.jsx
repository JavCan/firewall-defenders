import React, { useState, useEffect } from 'react'
import { FaClock } from 'react-icons/fa'
import { motion } from 'framer-motion'
import '../styles/GameTimeCard.css'

const GameTimeCard = ({ userId = 1 }) => {
  const [timeData, setTimeData] = useState({ hours: 0, minutes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameTime = async () => {
      try {
        const response = await fetch(`/api/estadistica/usuario/${userId}/tiempo`);
        const data = await response.json();
        
        if (data && data.tiempoFormateado) {
          setTimeData({
            formattedTime: data.tiempoFormateado
          });
        }
      } catch (error) {
        console.error('Error fetching game time:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameTime();
  }, [userId]);

  return (
    <motion.div 
      className="card-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
      }}
    >
      <motion.div 
        className="card-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.2 }}
      >
        Tiempo de juego:
      </motion.div>
      <motion.div 
        className="time-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.2 }}
      >
        {loading ? 'Cargando...' : timeData.formattedTime || '0 h 0 m'}
      </motion.div>
      <motion.div 
        className="icon-background"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <FaClock />
      </motion.div>
    </motion.div>
  )
}

export default GameTimeCard