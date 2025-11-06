const API_URL = 'http://localhost:3000/api';

/**
 * Servicio para manejar el perfil del usuario
 */

/**
 * Obtener perfil del usuario autenticado
 * @returns {Promise} 
 */
export const getMyProfile = async () => {
  try {
    // Obtener token del localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include', 
    });

    const data = await response.json();

    if (!response.ok) {
      // Si es error de autenticación, limpiar token
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(data.message || 'Error al obtener el perfil');
    }

    return data.data;
  } catch (error) {
    console.error('Error en servicio perfil:', error);
    throw error;
  }
};

/**
 * Actualizar perfil del usuario autenticado
 * @param {Object} profileData 
 * @returns {Promise} 
 */
export const updateMyProfile = async (profileData) => {
  try {
    // Obtener token del localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si es error de autenticación, limpiar token
      if (response.status === 401) {
        localStorage.removeItem('token');
      }
      throw new Error(data.message || 'Error al actualizar el perfil');
    }

    return data.data;
  } catch (error) {
    console.error('Error en servicio perfil:', error);
    throw error;
  }
};