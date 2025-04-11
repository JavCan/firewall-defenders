import React, { useState } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { FaChevronLeft, FaGamepad, FaChessRook, FaArrowUp } from 'react-icons/fa'

const CardContainer = styled(motion.div)`
  background: linear-gradient(135deg, #4481eb, #04befe);
  border-radius: 24px;
  padding: 24px;
  height: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`

const Title = styled.h2`
  font-size: 1.5rem;
  color: white;
  margin: 0 0 20px 0;
`

const ChartContainer = styled.div`
  flex: 1;
  margin-bottom: 20px;
  position: relative;
`

const Chart = styled.div`
  display: flex;
  align-items: flex-end;
  height: 150px;
  gap: 12px;
  padding-left: 24px;
  position: relative;
`

const AxisY = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: rgba(255, 255, 255, 0.3);
`

const AxisX = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
`

const Bar = styled.div`
  width: 20px;
  height: ${props => props.height}%;
  background-color: #02BEEF;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.5s ease;
  
  &:hover {
    background-color: #00d4ff;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
`

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${props => props.active ? 'rgba(30, 30, 63, 0.9)' : 'rgba(30, 30, 63, 0.5)'};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(30, 30, 63, 0.8);
  }
  
  svg {
    font-size: 16px;
  }
`

// Sample data for the chart
const levelData = [
  { value: 40 },
  { value: 60 },
  { value: 30 },
  { value: 70 },
  { value: 50 },
  { value: 80 },
  { value: 45 },
];

const towerData = [
  { value: 65 },
  { value: 45 },
  { value: 75 },
  { value: 35 },
  { value: 85 },
];

const upgradeData = [
  { value: 30 },
  { value: 50 },
  { value: 70 },
  { value: 90 },
];

const ProgressCard = () => {
  const [activeFilter, setActiveFilter] = useState('levels');
  const [chartData, setChartData] = useState(levelData);
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    switch(filter) {
      case 'levels':
        setChartData(levelData);
        break;
      case 'towers':
        setChartData(towerData);
        break;
      case 'upgrades':
        setChartData(upgradeData);
        break;
      default:
        setChartData(levelData);
    }
  };
  
  return (
    <CardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Title>Progreso</Title>
      
      <ChartContainer>
        <Chart>
          <AxisY />
          <AxisX />
          {chartData.map((item, index) => (
            <Bar key={index} height={item.value} />
          ))}
        </Chart>
      </ChartContainer>
      
      <ButtonGroup>
        <FilterButton 
          active={activeFilter === 'levels'} 
          onClick={() => handleFilterChange('levels')}
        >
          <FaChevronLeft /> Niveles
        </FilterButton>
        <FilterButton 
          active={activeFilter === 'towers'} 
          onClick={() => handleFilterChange('towers')}
        >
          <FaChevronLeft /> Torretas
        </FilterButton>
        <FilterButton 
          active={activeFilter === 'upgrades'} 
          onClick={() => handleFilterChange('upgrades')}
        >
          <FaChevronLeft /> Mejoras
        </FilterButton>
      </ButtonGroup>
    </CardContainer>
  )
}

export default ProgressCard