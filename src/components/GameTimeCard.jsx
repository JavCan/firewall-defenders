import React, { useState, useEffect } from 'react'
import { FaClock } from 'react-icons/fa'
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
    <div className="card-container">
      <div className="card-title">Tiempo de juego:</div>
      <div className="time-text">
        {loading ? 'Cargando...' : timeData.formattedTime || '0 h 0 m'}
      </div>
      <div className="icon-background">
        <FaClock />
      </div>
    </div>
  )
}

export default GameTimeCard