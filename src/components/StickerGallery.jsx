import React from 'react'
import { FaChevronDown } from 'react-icons/fa'
import '../styles/StickerGallery.css'

// Sticker images - in a real app, these would be imported from your assets
const stickers = [
  { src: 'https://via.placeholder.com/80/FF4B4B/FFFFFF?text=🪐' },
  { src: 'https://via.placeholder.com/80/3498db/FFFFFF?text=🌌' },
  { src: 'https://via.placeholder.com/80/9b59b6/FFFFFF?text=🚀' },
  { src: 'https://via.placeholder.com/80/f1c40f/FFFFFF?text=🚀' },
  { src: 'https://via.placeholder.com/80/1abc9c/FFFFFF?text=⚛️' },
  { src: 'https://via.placeholder.com/80/e74c3c/FFFFFF?text=🐱' },
  { src: 'https://via.placeholder.com/80/7f8c8d/FFFFFF?text=🐨' },
  { src: 'https://via.placeholder.com/80/3498db/FFFFFF?text=🥚' },
  { src: 'https://via.placeholder.com/80/f1c40f/FFFFFF?text=📚' },
  { src: 'https://via.placeholder.com/80/e74c3c/FFFFFF?text=⭕' },
  { src: 'https://via.placeholder.com/80/9b59b6/FFFFFF?text=💎' },
  { src: 'https://via.placeholder.com/80/1abc9c/FFFFFF?text=🧙' },
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
            style={{ backgroundColor: index % 2 === 0 ? '#02BEEF' : '#3498db' }}
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