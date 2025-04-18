import React from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { motion } from 'framer-motion'
import '../styles/StickerGallery.css'

// Import all sticker images
import sticker1 from '../assets/Sticker-01.png'
import sticker2 from '../assets/Sticker-02.png'
import sticker3 from '../assets/Sticker-03.png'
import sticker4 from '../assets/Sticker-04.png'
import sticker5 from '../assets/Sticker-05.png'
import sticker6 from '../assets/Sticker-06.png'
import sticker7 from '../assets/Sticker-07.png'
import sticker8 from '../assets/Sticker-08.png'
import sticker9 from '../assets/Sticker-09.png'
import sticker10 from '../assets/Sticker-10.png'
import sticker11 from '../assets/Sticker-11.png'
import sticker12 from '../assets/Sticker-12.png'
import sticker13 from '../assets/Sticker-13.png'
import sticker14 from '../assets/Sticker-14.png'
import sticker15 from '../assets/Sticker-15.png'
import sticker16 from '../assets/Sticker-16.png'
import sticker17 from '../assets/Sticker-17.png'
import sticker18 from '../assets/Sticker-18.png'
import sticker19 from '../assets/Sticker-19.png'
import sticker20 from '../assets/Sticker-20.png'

// Sticker images with proper imports
const stickers = [
  { src: sticker1 },
  { src: sticker2 },
  { src: sticker3 },
  { src: sticker4 },
  { src: sticker5 },
  { src: sticker6 },
  { src: sticker7 },
  { src: sticker8 },
  { src: sticker9 },
  { src: sticker10 },
  { src: sticker11 },
  { src: sticker12 },
  { src: sticker13 },
  { src: sticker14 },
  { src: sticker15 },
  { src: sticker16 },
  { src: sticker17 },
  { src: sticker18 },
  { src: sticker19 },
  { src: sticker20 },
];

const StickerGallery = () => {
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
        {stickers.map((sticker, index) => (
          <motion.div 
            key={index} 
            className="sticker-item"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.25 + (index * 0.01), 
              duration: 0.2 
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.1 }
            }}
          >
            <img 
              src={sticker.src} 
              alt={`Sticker ${index + 1}`} 
              className="sticker-image"
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default StickerGallery