import React from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { FaClock } from 'react-icons/fa'

const CardContainer = styled(motion.div)`
  background: linear-gradient(135deg, #3a7bd5, #6d5b98);
  border-radius: 24px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`

const Title = styled.div`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
`

const TimeText = styled.div`
  font-size: 3.5rem;
  font-weight: 600;
  color: white;
  margin-top: 16px;
  position: relative;
  z-index: 2;
`

const IconBackground = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 150px;
  color: rgba(255, 255, 255, 0.1);
  z-index: 1;
`

const GameTimeCard = ({ hours = 56 }) => {
  return (
    <CardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Tiempo de juego:</Title>
      <TimeText>{hours} h</TimeText>
      <IconBackground>
        <FaClock />
      </IconBackground>
    </CardContainer>
  )
}

export default GameTimeCard