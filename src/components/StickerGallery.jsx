import React from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'

const CardContainer = styled(motion.div)`
  background: rgba(111, 66, 193, 0.3);
  border-radius: 24px;
  padding: 24px;
  height: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(138, 43, 226, 0.5);
  display: flex;
  flex-direction: column;
`

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const Title = styled.h2`
  font-size: 1.5rem;
  color: white;
  margin: 0;
`

const FilterDropdown = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(30, 30, 63, 0.8);
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(30, 30, 63, 1);
  }
`

const DropdownText = styled.span`
  color: white;
  font-size: 14px;
  margin-right: 8px;
`

const StickersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  background: rgba(30, 30, 63, 0.5);
  padding: 16px;
  border-radius: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const StickerItem = styled(motion.div)`
  background: ${props => props.bgColor || '#02BEEF'};
  border-radius: 50%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`

const StickerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

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
    <CardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <HeaderSection>
        <Title>Stickers</Title>
        <FilterDropdown>
          <DropdownText>Más usados</DropdownText>
          <FaChevronDown size={12} color="white" />
        </FilterDropdown>
      </HeaderSection>
      
      <StickersGrid>
        {stickers.map((sticker, index) => (
          <StickerItem 
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <StickerImage src={sticker.src} alt={`Sticker ${index + 1}`} />
          </StickerItem>
        ))}
      </StickersGrid>
    </CardContainer>
  )
}

export default StickerGallery