import React from 'react'
import Topbar from './Topbar'
import GameTimeCard from './GameTimeCard'
import ProgressCard from './ProgressCard'
import StickerGallery from './StickerGallery'
import { FaBookmark, FaCalendarAlt, FaCog } from 'react-icons/fa'
import '../styles/Dashboard.css'

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard-container">
      <Topbar user={user} />
      <div className="content-container">
        <div className="sidebar">
          <div className="sidebar-icon active">
            <FaBookmark />
          </div>
          <div className="sidebar-icon">
            <FaCalendarAlt />
          </div>
          <div className="sidebar-icon">
            <FaCog />
          </div>
        </div>
        
        <div className="main-content-wrapper">
          <div className="main-content">
            <GameTimeCard />
            <StickerGallery />
            <ProgressCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard