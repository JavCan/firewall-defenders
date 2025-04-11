import React, { useState } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { FaHome, FaChartBar } from 'react-icons/fa'

const TopbarContainer = styled(motion.header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(30, 30, 63, 0.8);
  backdrop-filter: blur(10px);
  padding: 12px .5rem;
  width: 100%;
  position: relative;
  z-index: 100;
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  padding-left: 12px;
`

const Logo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #ff5a5f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-left: 0;
  
  &:hover {
    transform: scale(1.05);
  }
`

const NavButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-left: 24px;
`

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${props => props.active ? '#ff5a5f' : 'transparent'};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#ff5a5f' : 'rgba(255, 90, 95, 0.2)'};
  }
  
  svg {
    font-size: 18px;
  }
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: white;
`

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
`

const Username = styled.span`
  font-size: 12px;
  opacity: 0.7;
`

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  margin-right: .7rem;
  border-radius: 50%;
  background-color: #ff5a5f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`

const Topbar = ({ user = { name: 'Nombre Apellido', username: 'Username' } }) => {
  const [activeTab, setActiveTab] = useState('inicio')
  
  return (
    <TopbarContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <LeftSection>
        <Logo>ā</Logo>
        <NavButtons>
          <NavButton 
            active={activeTab === 'inicio'} 
            onClick={() => setActiveTab('inicio')}
          >
            <FaHome /> Inicio
          </NavButton>
          <NavButton 
            active={activeTab === 'monitoreo'} 
            onClick={() => setActiveTab('monitoreo')}
          >
            <FaChartBar /> Monitoreo
          </NavButton>
        </NavButtons>
      </LeftSection>
      
      <RightSection>
        <UserInfo>
          <UserName>{user.name}</UserName>
          <Username>{user.username}</Username>
        </UserInfo>
        <Avatar>
          {user.name.charAt(0)}
        </Avatar>
      </RightSection>
    </TopbarContainer>
  )
}

export default Topbar