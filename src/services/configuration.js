const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://dtas.evenor-tech.com/api';

/**
 * Servicio para manejar la configuración del usuario
 */

/**
 * Obtener configuración del usuario autenticado
 * @returns {Promise} 
 */
export const getUserConfig = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/users/config`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', 
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(data.message || 'Error al obtener la configuración');
    }

    return data.data;
  } catch (error) {
    console.error('Error en servicio configuración:', error);
    throw error;
  }
};

/**
 * Actualizar configuración completa del usuario
 * @param {Object} configData 
 * @returns {Promise} 
 */
export const updateUserConfig = async (configData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/users/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(configData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(data.message || 'Error al actualizar la configuración');
    }

    return data.data;
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    throw error;
  }
};

/**
 * Actualizar configuración de notificaciones
 * @param {Object} notificationData 
 * @returns {Promise} 
 */
export const updateNotificationConfig = async (notificationData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/users/config/notifications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(notificationData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(data.message || 'Error al actualizar notificaciones');
    }

    return data.data;
  } catch (error) {
    console.error('Error actualizando notificaciones:', error);
    throw error;
  }
};

/**
 * Actualizar preferencias de búsqueda
 * @param {Object} searchData 
 * @returns {Promise} 
 */
export const updateSearchPreferences = async (searchData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    // Formatear los datos para que coincidan con el esquema del backend
    const formattedData = {
      searchPreferences: {
        sectors: searchData.sectores || [],
        keywords: searchData.palabrasClave || [],
        budgetRange: {
          min: searchData.presupuestoMinimo ? parseInt(searchData.presupuestoMinimo) : 0,
          max: searchData.presupuestoMaximo ? parseInt(searchData.presupuestoMaximo) : null
        },
        locations: {
          countries: ['España'], // Por defecto España
          regions: [],
          cities: searchData.ubicaciones || []
        }
      }
    };

    const response = await fetch(`${API_URL}/users/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(formattedData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(data.message || 'Error al actualizar preferencias de búsqueda');
    }

    return data.data;
  } catch (error) {
    console.error('Error actualizando preferencias:', error);
    throw error;
  }
};

/**
 * Actualizar configuración de la aplicación
 * @param {Object} appData 
 * @returns {Promise} 
 */
export const updateAppSettings = async (appData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/users/config/app-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(appData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(data.message || 'Error al actualizar configuración de aplicación');
    }

    return data.data;
  } catch (error) {
    console.error('Error actualizando configuración de app:', error);
    throw error;
  }
};

/**
 * Actualizar configuración de seguridad
 * @param {Object} securityData 
 * @returns {Promise} 
 */
export const updateSecurityConfig = async (securityData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/users/config/security`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(securityData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(data.message || 'Error al actualizar configuración de seguridad');
    }

    return data.data;
  } catch (error) {
    console.error('Error actualizando seguridad:', error);
    throw error;
  }
};

/**
 * Cambiar contraseña del usuario
 * @param {string} currentPassword 
 * @param {string} newPassword 
 * @returns {Promise} 
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(data.message || 'Error al cambiar la contraseña');
    }

    return data;
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    throw error;
  }
};

/**
 * Restablecer configuración a valores por defecto
 * @returns {Promise} 
 */
export const resetUserConfig = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/users/config/reset`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(data.message || 'Error al restablecer configuración');
    }

    return data.data;
  } catch (error) {
    console.error('Error restableciendo configuración:', error);
    throw error;
  }
};
