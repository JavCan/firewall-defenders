import React, { useState } from 'react' // Importa useState
import Topbar from './Topbar'
import GameTimeCard from './GameTimeCard'
import ProgressCard from './ProgressCard'
import StickerGallery from './StickerGallery'
import { FiLogOut } from 'react-icons/fi'; // Asegúrate de importar un icono de logout
import { FaBookmark} from 'react-icons/fa' // Importa FaSignOutAlt
import { motion } from 'framer-motion' // Importa AnimatePresence
import '../styles/Dashboard.css'

// Acepta onLogout como prop
const Dashboard = ({ user, onLogout }) => {
  // Extrae el userId y ultimo_sticker_desbloqueado del objeto user.
  const userId = user?.id;
  const ultimoStickerDesbloqueado = user?.ultimo_sticker_desbloqueado;
  const monedas = user?.monedas;

  // Estado para controlar la visibilidad del menú de logout
  const [showLogout, setShowLogout] = useState(false);

  // Función para alternar la visibilidad del menú
  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión
    console.log("Cerrando sesión...");
    // Llama a la función onLogout pasada como prop
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
      {/* Pasa user y monedas a Topbar */}
      <Topbar user={user} monedas={monedas} />
      <div className="content-container">
        <motion.div
          className="sidebar"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {/* ... icono de bookmark ... */}
          <motion.div
            className="sidebar-icon active"
            id='1'
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaBookmark />
          </motion.div>

          {/* Reemplaza el contenedor de settings y el menú */}
          {/* El onClick ahora llama a la función handleLogout actualizada */}
          <div className="sidebar-icon sidebar-icon-bottom" onClick={handleLogout} title="Cerrar Sesión">
             <FiLogOut /> {/* Usa el icono de logout importado */}
          </div>

        </motion.div>

        {/* ... resto del main content ... */}
        <motion.div
          className="main-content-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <div className="main-content">
            {userId ? (
              <>
                <GameTimeCard userId={userId} />
                <StickerGallery ultimoStickerDesbloqueado={ultimoStickerDesbloqueado} />
                <ProgressCard userId={userId} />
              </>
            ) : (
              <p>Cargando datos del usuario...</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard