const API_URL = 'https://licitanor.evenor-tech.com/api';

/**
 * Servicio para manejar mensajes de contacto
 */

/**
 * Envía un mensaje de contacto al backend
 * @param {Object} messageData - Datos del mensaje de contacto
 * @param {string} messageData.name - Nombre completo del remitente
 * @param {string} messageData.email - Email del remitente
 * @param {string} messageData.phone - Teléfono (opcional)
 * @param {string} messageData.company - Empresa/Organización (opcional)
 * @param {string} messageData.subject - Asunto del mensaje
 * @param {string} messageData.message - Contenido del mensaje
 * @returns {Promise} - Respuesta de la API
 */
export const sendContactMessage = async (messageData) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Para manejar cookies si es necesario
      body: JSON.stringify(messageData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al enviar el mensaje de contacto');
    }

    return data;
  } catch (error) {
    console.error('Error en servicio de contacto:', error);
    throw error;
  }
};

/**
 * Valida los datos del formulario de contacto antes del envío
 * @param {Object} formData - Datos del formulario
 * @returns {Object} - Objeto con isValid y errores
 */
export const validateContactForm = (formData) => {
  const errors = {};
  
  // Validación de nombre
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  }
  
  // Validación de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'Por favor ingresa un email válido';
  }
  
  // Validación de teléfono (opcional pero si se proporciona debe ser válido)
  if (formData.phone && formData.phone.trim() !== '') {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{9,}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = 'Por favor ingresa un teléfono válido';
    }
  }
  
  // Validación de asunto
  if (!formData.subject || formData.subject.trim().length < 5) {
    errors.subject = 'El asunto debe tener al menos 5 caracteres';
  }
  
  // Validación de mensaje
  if (!formData.message || formData.message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};