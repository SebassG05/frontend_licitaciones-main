const API_URL = 'https://evenor-tech.com/api';

/**
 * Suscribe un email a la newsletter
 * @param {string} email - Email a suscribir
 * @returns {Promise} - Respuesta de la API
 */
export const subscribeToNewsletter = async (email) => {
  try {
    const response = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al suscribirse a la newsletter');
    }

    return data;
  } catch (error) {
    console.error('Error en servicio newsletter:', error);
    throw error;
  }
};