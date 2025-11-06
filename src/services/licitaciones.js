const API_URL = 'http://localhost:3000/api';

/**
 * Servicio para manejar las licitaciones
 */

/**
 * Obtener todas las licitaciones con filtros
 * @param {Object} params - Parámetros de filtrado
 * @param {number} params.page - Página actual (por defecto 1)
 * @param {number} params.limit - Elementos por página (por defecto 20)
 * @param {string} params.search - Término de búsqueda
 * @param {string} params.source - Fuente de la licitación
 * @param {string} params.status - Estado de la licitación
 * @param {string} params.sortBy - Campo para ordenar
 * @param {string} params.sortOrder - Orden ascendente o descendente
 * @returns {Promise} - Respuesta con las licitaciones
 */
export const getLicitaciones = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    
    // Construir URL con parámetros de consulta
    const queryParams = new URLSearchParams();
    
    // Parámetros de paginación
    queryParams.append('page', params.page || 1);
    queryParams.append('limit', params.limit || 20);
    
    // Filtros opcionales
    if (params.search) queryParams.append('search', params.search);
    if (params.source) queryParams.append('source', params.source);
    if (params.status) queryParams.append('status', params.status);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const response = await fetch(`${API_URL}/licitaciones?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener las licitaciones');
    }

    return data;
  } catch (error) {
    console.error('Error en servicio de licitaciones:', error);
    throw error;
  }
};

/**
 * Obtener una licitación por ID
 * @param {string} id - ID de la licitación
 * @returns {Promise} - Respuesta con la licitación
 */
export const getLicitacionById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/licitaciones/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener la licitación');
    }

    return data;
  } catch (error) {
    console.error('Error en servicio de licitación:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de licitaciones
 * @returns {Promise} - Respuesta con las estadísticas
 */
export const getLicitacionesStats = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/licitaciones/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener las estadísticas');
    }

    return data;
  } catch (error) {
    console.error('Error en estadísticas de licitaciones:', error);
    throw error;
  }
};

/**
 * Obtener fuentes disponibles
 * @returns {Promise} - Respuesta con las fuentes
 */
export const getSources = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/licitaciones/sources`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener las fuentes');
    }

    return data;
  } catch (error) {
    console.error('Error en fuentes de licitaciones:', error);
    throw error;
  }
};

export default {
  getLicitaciones,
  getLicitacionById,
  getLicitacionesStats,
  getSources,
};