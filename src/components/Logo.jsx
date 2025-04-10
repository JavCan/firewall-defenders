import React from 'react';
import aulifyLogo from '../assets/AULIFY_LOGOTIPO1.jpg';
import '../styles/Logo.css';

const Logo = () => {
  return (
    <div className="logo-container">
      <img className="logo-image" src={aulifyLogo} alt="Aulify Logo" />
    </div>
  );
};

export default Logo;