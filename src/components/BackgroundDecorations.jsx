import styled from '@emotion/styled';
import yellowCircle from '../assets/images/Elementos Aulify-11.png';
import yellowWave from '../assets/images/Elementos Aulify-13.png';
import yellowCross from '../assets/images/Elementos Aulify-15.png';
import yellowCrossAlt from '../assets/images/Elementos Aulify-14.png';
import yellowDots from '../assets/images/Elementos Aulify-16.png';
import yellowSquare from '../assets/images/Elementos Aulify-19.png';
import redCross from '../assets/images/Elementos Aulify-21.png';
import redWave from '../assets/images/Elementos Aulify-22.png';
import redCircle from '../assets/images/Elementos Aulify-23.png';
import blueCross from '../assets/images/Elementos Aulify-25.png';
import blueCrossAlt from '../assets/images/Elementos Aulify-24.png';
import blueWave from '../assets/images/Elementos Aulify-29.png';

const DecorationsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const Decoration = styled.img`
  position: absolute;
  opacity: 0.8;
  transition: transform 0.3s ease;
  animation: float 35s infinite linear;
  
  &:hover {
    transform: scale(1.1);
  }

  @keyframes float {
    0% {
      transform: translateY(110vh) rotate(0deg);
      opacity: 0;
    }
    5% {
      opacity: 0.8;
    }
    95% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(-10vh) rotate(360deg);
      opacity: 0;
    }
  }
`;

// Update animation delay utility
const withAnimationDelay = (Component) => styled(Component)`
  animation-delay: ${() => (Math.random() * -35)}s;
`;

// Apply animation delay to all decoration components
const YellowCircle = withAnimationDelay(styled(Decoration)`
  width: 80px;
  &.left { 
    top: 20%; 
    left: 15%;
    transform: rotate(-15deg);
  }
  &.right { 
    bottom: 25%; 
    right: 10%;
    transform: rotate(15deg);
  }
`);

const YellowWave = withAnimationDelay(styled(Decoration)`
  width: 60px;
  &.top { 
    top: 15%; 
    right: 20%;
    transform: rotate(45deg);
  }
  &.bottom { 
    bottom: 15%; 
    left: 25%;
    transform: rotate(-45deg);
  }
`);

const YellowCross = withAnimationDelay(styled(Decoration)`
  width: 40px;
  &.top-left { 
    top: 30%; 
    left: 30%;
  }
  &.bottom-right { 
    bottom: 35%; 
    right: 25%;
  }
  &.center-left {
    top: 45%;
    left: 18%;
    transform: rotate(-15deg);
  }
  &.top-center {
    top: 12%;
    left: 50%;
    transform: rotate(25deg);
  }
`);

const YellowDots = styled(Decoration)`
  width: 50px;
  &.center { 
    top: 50%; 
    right: 15%;
    transform: rotate(30deg);
  }
`;

const YellowSquare = styled(Decoration)`
  width: 45px;
  &.top { 
    top: 10%; 
    left: 45%;
    transform: rotate(-20deg);
  }
  &.bottom { 
    bottom: 20%; 
    left: 10%;
    transform: rotate(20deg);
  }
`;

// Add new styled components for red and blue elements
const RedCross = styled(Decoration)`
  width: 35px;
  &.top-right { 
    top: 15%; 
    right: 25%;
    transform: rotate(15deg);
  }
  &.bottom-left { 
    bottom: 20%; 
    left: 20%;
    transform: rotate(-15deg);
  }
`;

const RedWave = styled(Decoration)`
  width: 55px;
  &.top { 
    top: 25%; 
    right: 30%;
    transform: rotate(-30deg);
  }
`;

const RedCircle = styled(Decoration)`
  width: 70px;
  &.center-right { 
    top: 45%; 
    right: 20%;
    transform: rotate(20deg);
  }
`;

const BlueCross = styled(Decoration)`
  width: 40px;
  &.top { 
    top: 10%; 
    left: 35%;
    transform: rotate(-25deg);
  }
  &.bottom { 
    bottom: 15%; 
    right: 35%;
    transform: rotate(25deg);
  }
`;

const BlueWave = styled(Decoration)`
  width: 50px;
  &.center-left { 
    top: 40%; 
    left: 25%;
    transform: rotate(15deg);
  }
`;

// Add new styled components for the additional crosses
const BlueCrossAlt = styled(Decoration)`
  width: 35px;
  &.top-right { 
    top: 18%; 
    right: 42%;
    transform: rotate(25deg);
  }
  &.bottom-left { 
    bottom: 22%; 
    left: 38%;
    transform: rotate(-15deg);
  }
  &.center-right {
    top: 55%;
    right: 28%;
    transform: rotate(10deg);
  }
  &.center-top {
    top: 25%;
    right: 50%;
    transform: rotate(-20deg);
  }
`;

const YellowCrossAlt = styled(Decoration)`
  width: 40px;
  &.top-left { 
    top: 28%; 
    left: 42%;
    transform: rotate(-20deg);
  }
  &.bottom-right { 
    bottom: 32%; 
    right: 45%;
    transform: rotate(30deg);
  }
  &.center {
    top: 50%;
    left: 50%;
    transform: rotate(15deg);
  }
  &.bottom-center {
    bottom: 15%;
    left: 48%;
    transform: rotate(-25deg);
  }
`;

// Add new imports
import element09 from '../assets/images/Elementos Aulify-09.png';
import element06 from '../assets/images/Elementos Aulify-06.png';
import element05 from '../assets/images/Elementos Aulify-05.png';
import element04 from '../assets/images/Elementos Aulify-04.png';
import element03 from '../assets/images/Elementos Aulify-03.png';
import element02 from '../assets/images/Elementos Aulify-02.png';
import element01 from '../assets/images/Elementos Aulify-01.png';

// Add new styled components for the new elements
const Element09 = withAnimationDelay(styled(Decoration)`
  width: 45px;
  &.top-right { 
    top: 15%; 
    right: 35%;
  }
  &.bottom-left { 
    bottom: 25%; 
    left: 40%;
  }
`);

const Element06 = withAnimationDelay(styled(Decoration)`
  width: 50px;
  &.center-left { 
    top: 45%; 
    left: 25%;
  }
  &.top-center { 
    top: 20%; 
    left: 50%;
  }
`);

const Element05 = withAnimationDelay(styled(Decoration)`
  width: 40px;
  &.bottom-right { 
    bottom: 30%; 
    right: 30%;
  }
  &.center-right { 
    top: 50%; 
    right: 20%;
  }
`);

const Element04 = withAnimationDelay(styled(Decoration)`
  width: 35px;
  &.top-left { 
    top: 25%; 
    left: 35%;
  }
`);

const Element03 = withAnimationDelay(styled(Decoration)`
  width: 45px;
  &.center { 
    top: 40%; 
    left: 45%;
  }
`);

const Element02 = withAnimationDelay(styled(Decoration)`
  width: 40px;
  &.bottom-center { 
    bottom: 20%; 
    left: 48%;
  }
`);

const Element01 = withAnimationDelay(styled(Decoration)`
  width: 38px;
  &.top-right-corner { 
    top: 15%; 
    right: 20%;
  }
`);

export default function BackgroundDecorations() {
  return (
    <DecorationsContainer>
      {/* Single instance of each decoration with better spacing */}
      <YellowCircle src={yellowCircle} alt="" className="left" />
      <YellowWave src={yellowWave} alt="" className="top" />
      <YellowCross src={yellowCross} alt="" className="center-left" />
      <YellowDots src={yellowDots} alt="" className="center" />
      <YellowSquare src={yellowSquare} alt="" className="bottom" />
      
      <RedCross src={redCross} alt="" className="top-right" />
      <RedWave src={redWave} alt="" className="top" />
      <RedCircle src={redCircle} alt="" className="center-right" />
      
      <BlueCross src={blueCross} alt="" className="bottom" />
      <BlueWave src={blueWave} alt="" className="center-left" />
      
      <BlueCrossAlt src={blueCrossAlt} alt="" className="center-right" />
      <YellowCrossAlt src={yellowCrossAlt} alt="" className="bottom-center" />
      
      <Element09 src={element09} alt="" className="top-right" />
      <Element06 src={element06} alt="" className="center-left" />
      <Element05 src={element05} alt="" className="bottom-right" />
      <Element04 src={element04} alt="" className="top-left" />
      <Element03 src={element03} alt="" className="center" />
      <Element02 src={element02} alt="" className="bottom-center" />
      <Element01 src={element01} alt="" className="top-right-corner" />
    </DecorationsContainer>
  );
}