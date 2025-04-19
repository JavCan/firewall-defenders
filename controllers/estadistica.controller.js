import { pool } from '../helpers/mysql-config.js'

// Obtener todas las estadísticas
const getEstadistica = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM estadistica');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener estadistica:', error);
    res.status(500).json({ error: 'Error al obtener las estadisticas' });
  }
};

// Obtener estadísticas por tipo
const getEstadisticaPorTipo = async (req, res) => {
  try {
    const { idTipo } = req.params;
    console.log(`Buscando estadísticas con idTipo: ${idTipo}`);
    
    // First, check if the tipo exists
    const [tipoExists] = await pool.query('SELECT * FROM tipoEstadistica WHERE id = ?', [idTipo]);
    
    if (tipoExists.length === 0) {
      console.log(`No existe un tipo de estadística con id: ${idTipo}`);
      return res.status(404).json({ 
        error: `No existe un tipo de estadística con id: ${idTipo}`,
        tiposDisponibles: await getTiposEstadistica()
      });
    }
    
    // Now query the estadisticas
    const [rows] = await pool.query(
      'SELECT * FROM estadistica WHERE idTipo = ?', 
      [idTipo]
    );
    
    console.log(`Resultados encontrados: ${rows.length}`);
    
    if (rows.length === 0) {
      // If no records found, return a more informative message
      return res.json({
        message: `No hay estadísticas registradas para el tipo con id: ${idTipo} (${tipoExists[0].nombre})`,
        tipo: tipoExists[0]
      });
    }
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener estadistica por tipo:', error);
    res.status(500).json({ error: 'Error al obtener las estadisticas por tipo' });
  }
};

// Helper function to get all tipos de estadistica
// Obtener todos los tipos de estadísticas
const getTiposEstadistica = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipoEstadistica');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tipos de estadística:', error);
    res.status(500).json({ error: 'Error al obtener los tipos de estadística' });
  }
};
// Obtener estadísticas de un usuario
const getEstadisticaUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const [rows] = await pool.query('SELECT * FROM estadistica WHERE idUsuario = ?', [idUsuario]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener estadistica del usuario:', error);
    res.status(500).json({ error: 'Error al obtener las estadisticas del usuario' });
  }
};

// Obtener estadísticas de un usuario por tipo
const getEstadisticaUsuarioPorTipo = async (req, res) => {
  try {
    const { idUsuario, idTipo } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM estadistica WHERE idUsuario = ? AND idTipo = ?', 
      [idUsuario, idTipo]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron estadísticas para este usuario y tipo' });
    }
    
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener estadistica del usuario por tipo:', error);
    res.status(500).json({ error: 'Error al obtener las estadisticas del usuario por tipo' });
  }
};



// Obtener tiempo de juego de un usuario
const getTiempoJuegoUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const [rows] = await pool.query(
      'SELECT valor_TIME FROM estadistica e JOIN tipoEstadistica t ON e.idTipo = t.id WHERE e.idUsuario = ? AND t.nombre = "Tiempo de juego total"', 
      [idUsuario]
    );
    
    if (rows.length === 0) {
      return res.json({ tiempoTotal: "00:00:00", tiempoFormateado: "0 h 0 m" });
    }
    
    // El valor es de tipo TIME en formato hh:mm:ss
    const tiempoString = rows[0].valor_TIME;
    
    // Extraer las horas del formato TIME
    const [horas, minutos, segundos] = tiempoString.split(':').map(Number);
    
    res.json({ 
      tiempoTotal: tiempoString,
      tiempoFormateado: `${horas} h ${minutos} m`
    });
  } catch (error) {
    console.error('Error al obtener tiempo de juego:', error);
    res.status(500).json({ error: 'Error al obtener el tiempo de juego' });
  }
};

export { 
    getEstadistica, 
    getEstadisticaPorTipo, 
    getEstadisticaUsuario, 
    getTiempoJuegoUsuario,
    getEstadisticaUsuarioPorTipo,
    getTiposEstadistica
  }
  