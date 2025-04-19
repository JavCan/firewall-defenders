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
    const { tipo } = req.params;
    const [rows] = await pool.query(
      'SELECT e.* FROM estadistica e JOIN tipoEstadistica t ON e.idTipo = t.id WHERE t.nombre = ?', 
      [tipo]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener estadistica por tipo:', error);
    res.status(500).json({ error: 'Error al obtener las estadisticas por tipo' });
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

// Obtener todas las estadísticas para el dashboard de un usuario
const getEstadisticasDashboard = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    
    // Consulta para obtener todas las estadísticas relevantes para el dashboard
    const [rows] = await pool.query(`
      SELECT 
        t.id as idTipo,
        t.nombre as tipoNombre,
        COALESCE(e.valor_INT, 0) as valor,
        COALESCE(e.valor_TIME, '00:00:00') as valorTiempo
      FROM 
        tipoEstadistica t
      LEFT JOIN 
        estadistica e ON t.id = e.idTipo AND e.idUsuario = ?
      WHERE 
        t.nombre IN ('Niveles completados', 'Torretas construidas', 'Enemigos eliminados', 'Cristales recolectados')
    `, [idUsuario]);
    
    // Formatear los datos para el frontend
    const estadisticas = rows.map(row => {
      return {
        id: row.idTipo,
        tipo: row.tipoNombre,
        valor: row.valor
      };
    });
    
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas para el dashboard:', error);
    res.status(500).json({ error: 'Error al obtener las estadísticas para el dashboard' });
  }
};

// Obtener una estadística específica para un usuario
const getEstadisticaEspecifica = async (req, res) => {
  try {
    const { idUsuario, tipoNombre } = req.params;
    
    const [rows] = await pool.query(`
      SELECT 
        t.id as idTipo,
        t.nombre as tipoNombre,
        COALESCE(e.valor_INT, 0) as valor
      FROM 
        tipoEstadistica t
      LEFT JOIN 
        estadistica e ON t.id = e.idTipo AND e.idUsuario = ?
      WHERE 
        t.nombre = ?
    `, [idUsuario, tipoNombre]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tipo de estadística no encontrado' });
    }
    
    res.json({
      id: rows[0].idTipo,
      tipo: rows[0].tipoNombre,
      valor: rows[0].valor
    });
  } catch (error) {
    console.error('Error al obtener estadística específica:', error);
    res.status(500).json({ error: 'Error al obtener la estadística específica' });
  }
};

export { 
  getEstadistica, 
  getEstadisticaPorTipo, 
  getEstadisticaUsuario, 
  getTiempoJuegoUsuario,
  getEstadisticasDashboard,
  getEstadisticaEspecifica
}