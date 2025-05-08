import React, { useState, useEffect, useRef } from 'react';
// Intenta importar FaHeartBroken desde 'react-icons/fa'
import { FaChevronDown, FaChevronUp, FaFlag, FaTowerObservation, FaSkull, FaGem } from 'react-icons/fa6';
import { FaHeartBroken } from 'react-icons/fa'; // <-- Cambiado aquí
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ProgressCard.css';

// Elimina el valor por defecto userId = 1
const ProgressCard = ({ userId }) => {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [statsData, setStatsData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const menuRef = useRef(null);

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
    },
    // Añade la nueva estadística de derrotas
    // **¡VERIFICA ESTE idTipo (6)!** Podría ser diferente en tu API.
    6: {
      id: 'derrotas',
      title: 'Derrotas sufridas',
      icon: <FaHeartBroken />,
      color: '#F44336', // Un color rojo para derrotas
      descriptionTemplate: '{value} veces has sido derrotado'
    }
  }

  // Fetch data from the API
  useEffect(() => {
    // Asegúrate de que userId tenga un valor antes de hacer fetch
    if (!userId) {
        console.warn('ProgressCard: userId no proporcionado.');
        setLoading(false); // Detiene la carga si no hay ID
        setError('Usuario no identificado'); // Muestra un error o mensaje
        // **Modificado: Crear tarjetas por defecto incluso sin userId**
        const defaultStats = Object.values(statTypeMapping).map(typeInfo => ({
            id: typeInfo.id,
            title: typeInfo.title,
            value: 0,
            icon: typeInfo.icon,
            color: typeInfo.color,
            description: typeInfo.descriptionTemplate.replace('{value}', 0)
        }));
        setStatsData(activeFilter === 'todos' ? defaultStats : defaultStats.filter(stat => stat.id === activeFilter));
        return; // No continuar si no hay userId
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let finalStatsData = []; // Array para guardar los datos finales

      try {
        // --- Añadir obtención del token ---
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('Usuario no autenticado.');
        }
        // --- Fin obtención del token ---

        // Usa el userId recibido por props
        const response = await fetch(`https://mrr4kvt4dj.execute-api.us-east-1.amazonaws.com/api/estadistica/usuario/${userId}`, { // <-- URL CORREGIDA
           // --- Añadir cabeceras ---
           headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
          // --- Fin añadir cabeceras ---
        });

        if (!response.ok) {
           // Intenta leer el mensaje de error del cuerpo si existe
           const errorData = await response.json().catch(() => ({})); // Intenta parsear JSON, si falla, objeto vacío
           throw new Error(`Error ${response.status}: ${errorData.mensaje || response.statusText}`);
        }

        const data = await response.json();
        console.log(`Datos de estadísticas recibidos para userId ${userId}:`, data); // Para depuración

        // Filter out time-based statistics (those with non-zero valor_TIME)
        const filteredData = data.filter(stat => stat.valor_TIME === null);

        // Transform API data to our component format
        let transformedData = filteredData.map(stat => {
          const typeInfo = statTypeMapping[stat.idTipo];
          if (!typeInfo) return null;
          return {
            id: typeInfo.id,
            title: typeInfo.title,
            value: stat.valor_INT,
            icon: typeInfo.icon,
            color: typeInfo.color,
            description: typeInfo.descriptionTemplate.replace('{value}', stat.valor_INT)
          };
        }).filter(Boolean); // Remove null entries

        // **Modificado: Asegurar que todas las estadísticas existan, añadiendo las faltantes con valor 0**
        const existingStatIds = new Set(transformedData.map(stat => stat.id));
        Object.values(statTypeMapping).forEach(typeInfo => {
          if (!existingStatIds.has(typeInfo.id)) {
            transformedData.push({
              id: typeInfo.id,
              title: typeInfo.title,
              value: 0, // Valor por defecto
              icon: typeInfo.icon,
              color: typeInfo.color,
              description: typeInfo.descriptionTemplate.replace('{value}', 0)
            });
          }
        });
        // **Fin de la modificación**

        finalStatsData = transformedData; // Guarda los datos completos

      } catch (err) {
        console.error('Error fetching statistics:', err);
        // --- Modificación: Usar err.message para un error más específico ---
        setError(err.message || 'Failed to load statistics');
        // **Modificado: Crear tarjetas por defecto para TODAS las estadísticas en caso de error**
        finalStatsData = Object.values(statTypeMapping).map(typeInfo => ({
            id: typeInfo.id,
            title: typeInfo.title,
            value: 0,
            icon: typeInfo.icon,
            color: typeInfo.color,
            description: typeInfo.descriptionTemplate.replace('{value}', 0)
        }));
        // **Fin de la modificación**
      } finally {
        // **Modificado: Aplicar el filtro DESPUÉS de asegurar todas las tarjetas o manejar el error**
        if (activeFilter === 'todos') {
          setStatsData(finalStatsData);
        } else {
          setStatsData(finalStatsData.filter(stat => stat.id === activeFilter));
        }
        setLoading(false);
      }
    };

    fetchData();
    // userId ya está en las dependencias, lo cual es correcto
  }, [activeFilter, userId]); // Asegúrate de que statTypeMapping no necesite estar aquí si no cambia

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
      // Añade el caso para derrotas
      case 'derrotas': return 'Derrotas'
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
                {/* Añade la opción para Derrotas */}
                <motion.div
                  className={`dropdown-item ${activeFilter === 'derrotas' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('derrotas')
                    setIsMenuOpen(false)
                  }}
                  whileHover={{ backgroundColor: 'rgba(30, 30, 63, 0.7)' }}
                >
                  Derrotas sufridas
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Muestra mensaje de carga o error */}
      {loading && <p style={{ color: 'white', textAlign: 'center' }}>Cargando estadísticas...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Renderiza las tarjetas de estadísticas */}
      {!loading && !error && (
        <div className="stats-wrapper">
          <AnimatePresence>
            {statsData.map((stat) => (
              <motion.div 
                key={stat.id} 
                className="stat-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                whileHover={{ 
                  y: -3, 
                  boxShadow: `0 6px 15px ${stat.color}33`, // Sombra sutil con el color del icono
                  backgroundColor: 'rgba(255, 255, 255, 0.15)' // Un poco más claro al pasar el ratón
                }}
              >
                <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">{stat.title}</h3>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-description">{stat.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default ProgressCard;