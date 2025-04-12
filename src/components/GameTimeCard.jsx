import React from 'react'
import { FaClock } from 'react-icons/fa'
import '../styles/GameTimeCard.css'

const GameTimeCard = ({ hours = 56 }) => {
  return (
    <div className="card-container">
      <div className="card-title">Tiempo de juego</div>
      <div className="time-text">{hours} h</div>
      <div className="icon-background">
        <FaClock />
      </div>
    </div>
  )
}

export default GameTimeCard