const API_URL = 'http://localhost:3000/api';

/**
 * Servicio para manejar la autenticación con el backend
 */

/**
 * Iniciar sesión
 * @param {string} email - Email del empleado
 * @param {string} password - Contraseña del empleado
 * @returns {Promise} - Respuesta con datos del empleado
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Importante para manejar cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    // La cookie JWT se establece automáticamente por el navegador
    // Solo necesitamos devolver los datos del usuario
    return data;
  } catch (error) {
    console.error('Error en servicio auth:', error);
    throw error;
  }
};

/**
 * Cerrar sesión
 * @returns {Promise} - Respuesta del servidor
 */
export const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include', // Importante para manejar cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al cerrar sesión');
    }

    return data;
  } catch (error) {
    console.error('Error en servicio auth:', error);
    throw error;
  }
};

/**
 * Obtener perfil del usuario autenticado
 * @returns {Promise} - Datos del perfil
 */
export const getProfile = async () => {
  try {
    // Verificar primero si hay una cookie JWT (evita hacer peticiones innecesarias)
    if (!document.cookie.includes('jwt=')) {
      return null;
    }

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      credentials: 'include', // Importante para manejar cookies
    });

    // Si no hay autorización, simplemente devolvemos null sin mostrar error
    if (response.status === 401) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener perfil');
    }

    return data.data.employee;
  } catch (error) {
    // Solo mostramos errores que no sean de autorización
    if (error.message !== 'Error al obtener perfil') {
      console.error('Error en servicio auth:', error);
    }
    return null;
  }
};