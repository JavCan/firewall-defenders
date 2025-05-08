import React, { useState, useEffect, useMemo, useRef } from 'react' // Añadir useRef
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6' // Cambiado a fa6 y añadido FaChevronUp
import { motion, AnimatePresence } from 'framer-motion' // Añadir AnimatePresence
import '../styles/StickerGallery.css' // Asegúrate que el CSS está importado

// Import all sticker images
import s1 from '../assets/Sticker-01.png'
import s2 from '../assets/Sticker-02.png'
import s3 from '../assets/Sticker-03.png'
import s4 from '../assets/Sticker-04.png'
import s5 from '../assets/Sticker-05.png'
import s6 from '../assets/Sticker-06.png'
import s7 from '../assets/Sticker-07.png'
import s8 from '../assets/Sticker-08.png'
import s9 from '../assets/Sticker-09.png'
import s10 from '../assets/Sticker-10.png'
import s11 from '../assets/Sticker-11.png'
import s12 from '../assets/Sticker-12.png'
import s13 from '../assets/Sticker-13.png'
import s14 from '../assets/Sticker-14.png'
import s15 from '../assets/Sticker-15.png'
import s16 from '../assets/Sticker-16.png'
import s17 from '../assets/Sticker-17.png'
import s18 from '../assets/Sticker-18.png'
import s19 from '../assets/Sticker-19.png'
import s20 from '../assets/Sticker-20.png'

// Sticker images with proper imports
const stickers = [
  { src: s1, id: 1, name: "Sticker 1" }, // Añade un ID y nombre a cada sticker
  { src: s2, id: 2, name: "Sticker 2" },
  { src: s3, id: 3, name: "Sticker 3" },
  { src: s4, id: 4, name: "Sticker 4" },
  { src: s5, id: 5, name: "Sticker 5" },
  { src: s6, id: 6, name: "Sticker 6" },
  { src: s7, id: 7, name: "Sticker 7" },
  { src: s8, id: 8, name: "Sticker 8" },
  { src: s9, id: 9, name: "Sticker 9" },
  { src: s10, id: 10, name: "Sticker 10" },
  { src: s11, id: 11, name: "Sticker 11" },
  { src: s12, id: 12, name: "Sticker 12" },
  { src: s13, id: 13, name: "Sticker 13" },
  { src: s14, id: 14, name: "Sticker 14" },
  { src: s15, id: 15, name: "Sticker 15" },
  { src: s16, id: 16, name: "Sticker 16" },
  { src: s17, id: 17, name: "Sticker 17" },
  { src: s18, id: 18, name: "Sticker 18" },
  { src: s19, id: 19, name: "Sticker 19" },
  { src: s20, id: 20, name: "Sticker 20" },
];

// Recibe ultimoStickerDesbloqueado como prop
const StickerGallery = ({ ultimoStickerDesbloqueado }) => {
  const [sortOrder, setSortOrder] = useState('unlocked'); // 'unlocked' o 'most_used'
  const [stickerUsageData, setStickerUsageData] = useState({}); // { 1: 10, 5: 25 } (stickerId: count)
  const [isLoadingUsageData, setIsLoadingUsageData] = useState(false);
  const [errorLoadingUsageData, setErrorLoadingUsageData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef(null); // Añadir menuRef

  // Asegúrate de que ultimoStickerDesbloqueado sea un número, o usa 0 si no está definido
  const lastUnlockedId = Number(ultimoStickerDesbloqueado) || 0;

  const fetchStickerUsage = async () => {
    setIsLoadingUsageData(true);
    setErrorLoadingUsageData(null);
    try {
      const token = localStorage.getItem('jwtToken'); // MODIFICADO: Usar 'jwtToken'
      if (!token) {
        throw new Error("Usuario no autenticado (jwtToken no encontrado). No se puede cargar el uso de stickers."); // MODIFICADO: Mensaje más específico
      }
      const response = await fetch('/api/estadistica/stickers/uso', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error al cargar datos de uso: ${response.statusText}`);
      }
      const data = await response.json(); // Espera un array: [{ idSticker: 5, contador_uso: 10 }, ...]
      const usageMap = data.reduce((acc, item) => {
        acc[item.idSticker] = item.contador_uso;
        return acc;
      }, {});
      setStickerUsageData(usageMap);
    } catch (error) {
      console.error("Error fetching sticker usage:", error);
      setErrorLoadingUsageData(error.message);
      // Opcional: podrías querer volver a 'unlocked' si falla la carga
      // setSortOrder('unlocked'); 
    } finally {
      setIsLoadingUsageData(false);
    }
  };

  useEffect(() => {
    if (sortOrder === 'most_used' && Object.keys(stickerUsageData).length === 0 && !isLoadingUsageData) {
      fetchStickerUsage();
    }
  }, [sortOrder, stickerUsageData, isLoadingUsageData]);

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sortedStickers = useMemo(() => {
    let tempStickers = [...stickers];

    if (sortOrder === 'most_used') {
      tempStickers.sort((a, b) => {
        const usageA = stickerUsageData[a.id] || 0;
        const usageB = stickerUsageData[b.id] || 0;
        if (usageB !== usageA) {
          return usageB - usageA; // Ordenar por uso descendente
        }
        return a.id - b.id; // Luego por ID ascendente para desempate
      });
    } else { // 'unlocked' (orden por defecto por ID)
      tempStickers.sort((a, b) => a.id - b.id);
    }
    return tempStickers;
  }, [stickers, sortOrder, stickerUsageData]);

  const handleSortChange = (newOrder) => {
    setSortOrder(newOrder);
    setIsDropdownOpen(false); // Cerrar dropdown después de seleccionar
  };

  // Obtener el texto del filtro activo
  const getSortOrderText = () => {
    switch(sortOrder) {
      case 'unlocked': return 'Desbloqueo';
      case 'most_used': return 'Más usados';
      default: return 'Ordenar';
    }
  };

  return (
    <motion.div 
      className="sticker-card-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
      }}
    >
      <motion.div 
        className="header-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.2 }}
      >
        <motion.h2 
          className="sticker-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
        >
          Stickers
        </motion.h2>
        
        {/* Contenedor del dropdown similar a ProgressCard */}
        <div className="dropdown-container" ref={menuRef}>
          <motion.button
            className="dropdown-button" // Clase similar a ProgressCard
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            {getSortOrderText()} {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                className="dropdown-menu" // Clase similar a ProgressCard
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className={`dropdown-item ${sortOrder === 'unlocked' ? 'active' : ''}`}
                  onClick={() => handleSortChange('unlocked')}
                  whileHover={{ backgroundColor: 'rgba(30, 30, 63, 0.7)' }}
                >
                  Por Desbloqueo
                </motion.div>
                <motion.div
                  className={`dropdown-item ${sortOrder === 'most_used' ? 'active' : ''}`}
                  onClick={() => handleSortChange('most_used')}
                  whileHover={{ backgroundColor: 'rgba(30, 30, 63, 0.7)' }}
                >
                  Más Usados
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {isLoadingUsageData && <p className="loading-text">Cargando datos de uso...</p>}
      {errorLoadingUsageData && <p className="error-text">Error: {errorLoadingUsageData}</p>}

      <motion.div className="stickers-grid">
        {sortedStickers.map((sticker, index) => { // Añadir index para la animación
          // Determina si el sticker está desbloqueado
          const isUnlocked = sticker.id <= lastUnlockedId;
          
          return (
            <motion.div 
              key={sticker.id} // Usa el ID del sticker como key
              // Añade la clase 'locked' si no está desbloqueado
              className={`sticker-item ${!isUnlocked ? 'locked' : ''}`} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.25 + (index * 0.01), // Usa el index del array ordenado
                duration: 0.2 
              }}
              whileHover={isUnlocked ? { // Solo anima el hover si está desbloqueado
                scale: 1.05,
                transition: { duration: 0.1 }
              } : {}} // No aplicar hover si está bloqueado
            >
              <img 
                src={sticker.src} 
                alt={`Sticker ${sticker.id}`} 
                className="sticker-image"
              />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  )
}

export default StickerGallery