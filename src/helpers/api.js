// API helper functions for fetching data from the backend

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Obtiene todas las estadísticas para el dashboard de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} - Array de estadísticas
 */
export const fetchDashboardStats = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/estadistica/dashboard/${userId}`);
    if (!response.ok) {
      throw new Error('Error al obtener estadísticas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en fetchDashboardStats:', error);
    return [];
  }
};

/**
 * Obtiene una estadística específica para un usuario
 * @param {number} userId - ID del usuario
 * @param {string} statType - Nombre del tipo de estadística
 * @returns {Promise<Object>} - Objeto con la estadística
 */
export const fetchSpecificStat = async (userId, statType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/estadistica/usuario/${userId}/tipo/${encodeURIComponent(statType)}`);
    if (!response.ok) {
      throw new Error(`Error al obtener estadística: ${statType}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en fetchSpecificStat (${statType}):`, error);
    return { tipo: statType, valor: 0 };
  }
};

/**
 * Obtiene el tiempo de juego de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} - Objeto con el tiempo de juego
 */
export const fetchGameTime = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/estadistica/usuario/${userId}/tiempo`);
    if (!response.ok) {
      throw new Error('Error al obtener tiempo de juego');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en fetchGameTime:', error);
    return { tiempoTotal: "00:00:00", tiempoFormateado: "0 h 0 m" };
  }
};