import React from 'react'
import Topbar from './Topbar'
import GameTimeCard from './GameTimeCard'
import ProgressCard from './ProgressCard'
import StickerGallery from './StickerGallery'
import { FaBookmark, FaCalendarAlt, FaCog } from 'react-icons/fa'
import { motion } from 'framer-motion'
import '../styles/Dashboard.css'

const Dashboard = ({ user }) => {
  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Topbar user={user} />
      <div className="content-container">
        <motion.div 
          className="sidebar"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <motion.div 
            className="sidebar-icon active" 
            id='1'
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaBookmark />
          </motion.div>
          {/* <div className="sidebar-icon" id='2'>
            <FaCalendarAlt />
          </div>
          <div className="sidebar-icon sidebar-icon-bottom" id='3'>
            <FaCog />
          </div> */}
        </motion.div>
        
        <motion.div 
          className="main-content-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <div className="main-content">
            <GameTimeCard userId={user.id} />
            <StickerGallery />
            <ProgressCard />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard