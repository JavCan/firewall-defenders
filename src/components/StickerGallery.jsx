import React from 'react'
import { FaChevronDown } from 'react-icons/fa'
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
];

const StickerGallery = () => {
  return (
    <div className="sticker-card-container">
      <div className="header-section">
        <h2 className="sticker-title">Stickers</h2>
        <div className="filter-dropdown">
          <span className="dropdown-text">Más usados</span>
          <FaChevronDown />
        </div>
      </div>
      
      <div className="stickers-grid">
        {stickers.map((sticker, index) => (
          <div 
            key={index} 
            className="sticker-item"
          >
            <img 
              src={sticker.src} 
              alt={`Sticker ${index + 1}`} 
              className="sticker-image"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default StickerGallery