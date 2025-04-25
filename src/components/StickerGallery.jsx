import React from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { motion } from 'framer-motion'
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
  { src: s1, id: 1 }, // Añade un ID a cada sticker
  { src: s2, id: 2 },
  { src: s3, id: 3 },
  { src: s4, id: 4 },
  { src: s5, id: 5 },
  { src: s6, id: 6 },
  { src: s7, id: 7 },
  { src: s8, id: 8 },
  { src: s9, id: 9 },
  { src: s10, id: 10 },
  { src: s11, id: 11 },
  { src: s12, id: 12 },
  { src: s13, id: 13 },
  { src: s14, id: 14 },
  { src: s15, id: 15 },
  { src: s16, id: 16 },
  { src: s17, id: 17 },
  { src: s18, id: 18 },
  { src: s19, id: 19 },
  { src: s20, id: 20 },
];

// Recibe ultimoStickerDesbloqueado como prop
const StickerGallery = ({ ultimoStickerDesbloqueado }) => {
  // Asegúrate de que ultimoStickerDesbloqueado sea un número, o usa 0 si no está definido
  const lastUnlockedId = Number(ultimoStickerDesbloqueado) || 0;

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
        <motion.div 
          className="filter-dropdown"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="dropdown-text">Más usados</span>
          <FaChevronDown />
        </motion.div>
      </motion.div>
      
      <motion.div className="stickers-grid">
        {stickers.map((sticker) => { // No necesitamos el index si usamos sticker.id
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
                delay: 0.25 + (sticker.id * 0.01), // Usa ID para el delay
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