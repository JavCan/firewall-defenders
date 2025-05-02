import React, { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/GameTimeCard.css';

// Elimina el valor por defecto userId = 1
const GameTimeCard = ({ userId }) => {
  const [timeData, setTimeData] = useState({ formattedTime: null }); // Inicializa con null o un valor por defecto
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Asegúrate de que userId tenga un valor antes de hacer fetch
    if (!userId) {
        console.warn('GameTimeCard: userId no proporcionado.');
        setLoading(false); // Detiene la carga si no hay ID
        setTimeData({ formattedTime: 'N/A' }); // Muestra N/A o similar
        return; // No continuar si no hay userId
    }

    const fetchGameTime = async () => {
      setLoading(true); // Inicia la carga
      try {
        // --- Añadir obtención del token ---
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('Usuario no autenticado.');
        }
        // --- Fin obtención del token ---

        // Usa el userId recibido por props
        const response = await fetch(`/api/estadistica/usuario/${userId}/tiempo`, {
          // --- Añadir cabeceras ---
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
          // --- Fin añadir cabeceras ---
        });

        if (!response.ok) {
          // Lanza un error más descriptivo
          const errorData = await response.text(); // Intenta obtener más detalles del error
          throw new Error(`Error fetching time: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        console.log(`Datos de tiempo recibidos para userId ${userId}:`, data); // Para depuración

        // --- INICIO DE LA NUEVA MODIFICACIÓN ---
        // Verificar si 'tiempoFormateado' existe y es un string en la respuesta
        if (data && data.tiempoFormateado !== undefined && typeof data.tiempoFormateado === 'string') {
           // Usar directamente el valor formateado del backend
           setTimeData({
             formattedTime: data.tiempoFormateado
           });
        } else {
           // Si 'tiempoFormateado' no viene o no es string, considera un valor por defecto
           console.warn('Respuesta inesperada o campo tiempoFormateado ausente/inválido:', data); // Mensaje actualizado
           setTimeData({ formattedTime: '0 h 0 m' }); // O 'Error' o 'N/A'
        }
        // --- FIN DE LA NUEVA MODIFICACIÓN ---

      } catch (error) {
        console.error('Error fetching game time:', error);
        setTimeData({ formattedTime: 'Error' }); // Muestra un error en la UI
      } finally {
        setLoading(false);
      }
    };

    fetchGameTime();
    // Añade userId como dependencia para que se vuelva a ejecutar si cambia
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
        {/* Muestra el tiempo formateado o 'Cargando...' */}
        {loading ? 'Cargando...' : timeData.formattedTime}
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
  );
};

export default GameTimeCard;