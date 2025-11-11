const API_URL = 'https://licitanor.evenor-tech.com/api';

/**
 * Cache simple para evitar llamadas repetitivas
 */
const cache = new Map();
const CACHE_DURATION = 5000; // 5 segundos para reducir parpadeo
let pendingRequests = new Map(); // Para evitar llamadas duplicadas

const getCacheKey = (params) => {
  return JSON.stringify(params);
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
  
  // Limpiar cache viejo cada cierto tiempo
  if (cache.size > 50) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
};

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
 * @param {string} params.keywords - Palabras clave separadas por comas
 * @param {string} params.deadline - Fecha límite mínima
 * @param {number} params.minBudget - Presupuesto mínimo
 * @returns {Promise} - Respuesta con las licitaciones
 */
export const getLicitaciones = async (params = {}) => {
  try {
    // Verificar cache primero
    const cacheKey = getCacheKey(params);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Verificar si ya hay una request pendiente para evitar duplicados
    if (pendingRequests.has(cacheKey)) {
      return await pendingRequests.get(cacheKey);
    }
    
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
    if (params.keywords) queryParams.append('keywords', params.keywords);
    if (params.deadline) queryParams.append('deadline', params.deadline);
    if (params.minBudget) queryParams.append('minBudget', params.minBudget);
    
    // Crear y almacenar la promesa de la request
    const requestPromise = fetch(`${API_URL}/licitaciones?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    }).then(async (response) => {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener las licitaciones');
      }

      // Guardar en cache
      setCachedData(cacheKey, data);
      
      // Limpiar request pendiente
      pendingRequests.delete(cacheKey);
      
      return data;
    });

    // Almacenar la promesa para evitar requests duplicadas
    pendingRequests.set(cacheKey, requestPromise);
    
    return await requestPromise;
  } catch (error) {
    // Limpiar request pendiente en caso de error
    const cacheKey = getCacheKey(params);
    pendingRequests.delete(cacheKey);
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