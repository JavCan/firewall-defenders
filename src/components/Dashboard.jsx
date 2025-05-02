import React, { useState } from 'react'; // Asegúrate que useState esté importado
import Topbar from './Topbar';
import GameTimeCard from './GameTimeCard';
import ProgressCard from './ProgressCard';
import StickerGallery from './StickerGallery';
// Importa los nuevos componentes
import MonitoringCard1 from './MonitoringCard1';
import MonitoringCard2 from './MonitoringCard2';
import { FiLogOut } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/Dashboard.css';

// Elimina las definiciones placeholder
// const MonitoringCard1 = () => <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '20px', color: 'white', gridColumn: '1 / -1' }}>Tarjeta de Monitoreo 1 (Placeholder)</div>;
// const MonitoringCard2 = () => <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '20px', color: 'white', gridColumn: '1 / -1' }}>Tarjeta de Monitoreo 2 (Placeholder)</div>;


const Dashboard = ({ user, onLogout }) => {
  const userId = user?.id;
  const ultimoStickerDesbloqueado = user?.ultimo_sticker_desbloqueado;
  const monedas = user?.monedas;

  const [showLogout, setShowLogout] = useState(false);
  const [activeView, setActiveView] = useState('inicio'); // Estado para la vista actual

  // Función para alternar la visibilidad del menú
  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    if (onLogout) {
      onLogout();
    } else {
      console.error("La función onLogout no fue proporcionada al Dashboard.");
    }
  };


  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Pasa activeView y setActiveView a Topbar */}
      <Topbar
        user={user}
        monedas={monedas}
        activeTab={activeView}
        onTabChange={setActiveView} // Pasa la función para cambiar la vista
      />
      <div className="content-container">
        <motion.div
          className="sidebar"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {/* ... icono de bookmark ... */}
          <motion.div
            className={`sidebar-icon ${activeView === 'inicio' ? 'active' : ''}`} // El icono activo depende de la vista
            id='1'
            onClick={() => setActiveView('inicio')} // También permite cambiar la vista desde aquí
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaBookmark />
          </motion.div>

          <div className="sidebar-icon sidebar-icon-bottom" onClick={handleLogout} title="Cerrar Sesión">
             <FiLogOut />
          </div>
        </motion.div>

        <motion.div
          className="main-content-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <div className="main-content">
            {userId ? (
              <>
                {/* Renderizado condicional basado en activeView */}
                {activeView === 'inicio' && (
                  <>
                    <GameTimeCard userId={userId} />
                    <StickerGallery ultimoStickerDesbloqueado={ultimoStickerDesbloqueado} />
                    <ProgressCard userId={userId} />
                  </>
                )}
                {activeView === 'monitoreo' && (
                  <>
                    {/* Renderiza los nuevos componentes importados */}
                    <MonitoringCard1  userId={userId}/>
                    <MonitoringCard2  userId={userId}/>
                  </>
                )}
              </>
            ) : (
              <p>Cargando datos del usuario...</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;