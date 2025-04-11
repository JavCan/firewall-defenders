import React from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import Topbar from './Topbar'
import { FaBookmark, FaCalendarAlt, FaCog } from 'react-icons/fa'

const DashboardContainer = styled.div`
  width: 100%;
  height: 85vh;
  margin-top: 3.7rem;
  border-radius: 30px;
  background-color:rgba(255, 255, 255, 0.26);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`

const ContentContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  width: 100%;
  max-width: 100%;
`

const Sidebar = styled.div`
  background: rgba(30, 30, 63, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  margin: .5rem .6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 20px;
  width: 70px;
  height: 76.3vh;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const SidebarIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${props => props.active ? '#ff5a5f' : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#ff5a5f' : 'rgba(255, 255, 255, 0.2)'};
    transform: translateY(-2px);
  }
`

const MainContentWrapper = styled.div`
  flex: 1;
  padding: 24px 32px;
`

const MainContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`

const Dashboard = ({ user }) => {
  return (
    <DashboardContainer>
      <Topbar user={user} />
      <ContentContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Sidebar>
          <SidebarIcon active>
            <FaBookmark />
          </SidebarIcon>
          <SidebarIcon>
            <FaCalendarAlt />
          </SidebarIcon>
          <SidebarIcon>
            <FaCog />
          </SidebarIcon>
        </Sidebar>
        
        <MainContentWrapper>
          <MainContent>
            {/* Dashboard content will be added here */}
            {/* This is where we'll add components like GameTimeCard, ProgressCard, StickersCard, etc. */}
          </MainContent>
        </MainContentWrapper>
      </ContentContainer>
    </DashboardContainer>
  )
}

export default Dashboard