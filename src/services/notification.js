import { useState } from 'react';

const API_URL = 'https://licitanor.evenor-tech.com/api';

/**
 * Servicio para manejar notificaciones del usuario
 */

/**
 * Obtener notificaciones del usuario autenticado
 * @param {Object} options - Opciones de consulta
 * @param {number} options.page - Página
 * @param {number} options.limit - Límite por página
 * @param {boolean} options.unreadOnly - Solo no leídas
 * @param {string} options.type - Tipo específico
 * @returns {Promise} 
 */
export const getUserNotifications = async (options = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const {
      page = 1,
      limit = 20,
      unreadOnly = false,
      type = null
    } = options;

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      unreadOnly: unreadOnly.toString()
    });

    if (type) {
      params.append('type', type);
    }

    const response = await fetch(`${API_URL}/notifications?${params}`, {
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
      throw new Error(data.message || 'Error al obtener notificaciones');
    }

    return data.data;
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    throw error;
  }
};

/**
 * Obtener contador de notificaciones no leídas
 * @returns {Promise} 
 */
export const getUnreadCount = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/notifications/unread-count`, {
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
      throw new Error(data.message || 'Error al obtener contador');
    }

    return data.data;
  } catch (error) {
    console.error('Error obteniendo contador de no leídas:', error);
    throw error;
  }
};

/**
 * Marcar notificación como leída
 * @param {string} notificationId - ID de la notificación
 * @returns {Promise} 
 */
export const markAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
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
      throw new Error(data.message || 'Error al marcar como leída');
    }

    return data.data;
  } catch (error) {
    console.error('Error marcando como leída:', error);
    throw error;
  }
};

/**
 * Marcar todas las notificaciones como leídas
 * @returns {Promise} 
 */
export const markAllAsRead = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: 'PUT',
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
      throw new Error(data.message || 'Error al marcar todas como leídas');
    }

    return data.data;
  } catch (error) {
    console.error('Error marcando todas como leídas:', error);
    throw error;
  }
};

/**
 * Eliminar una notificación
 * @param {string} notificationId - ID de la notificación
 * @returns {Promise} 
 */
export const deleteNotification = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
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
      throw new Error(data.message || 'Error al eliminar notificación');
    }

    return data.data;
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas de notificaciones
 * @returns {Promise} 
 */
export const getNotificationStats = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/notifications/stats`, {
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
      throw new Error(data.message || 'Error al obtener estadísticas');
    }

    return data.data;
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw error;
  }
};

/**
 * Obtener notificaciones por tipo
 * @param {string} type - Tipo de notificación
 * @param {Object} options - Opciones adicionales
 * @returns {Promise} 
 */
export const getNotificationsByType = async (type, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const {
      page = 1,
      limit = 20,
      unreadOnly = false
    } = options;

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      unreadOnly: unreadOnly.toString()
    });

    const response = await fetch(`${API_URL}/notifications/type/${type}?${params}`, {
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
      throw new Error(data.message || 'Error al obtener notificaciones por tipo');
    }

    return data.data;
  } catch (error) {
    console.error('Error obteniendo notificaciones por tipo:', error);
    throw error;
  }
};

/**
 * Crear notificación de prueba (solo desarrollo)
 * @param {Object} notificationData - Datos de la notificación
 * @returns {Promise} 
 */
export const createTestNotification = async (notificationData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No está autenticado. Por favor inicie sesión');
    }

    const response = await fetch(`${API_URL}/notifications/test`, {
      method: 'POST',
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
      throw new Error(data.message || 'Error al crear notificación de prueba');
    }

    return data.data;
  } catch (error) {
    console.error('Error creando notificación de prueba:', error);
    throw error;
  }
};

/**
 * Hook personalizado para manejar notificaciones en tiempo real
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async (options = {}) => {
    setLoading(true);
    try {
      const data = await getUserNotifications(options);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      return data;
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.count);
      return data;
    } catch (error) {
      console.error('Error cargando contador:', error);
      throw error;
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read: true, readAt: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marcando como leída:', error);
      throw error;
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
      throw error;
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      const removedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (removedNotification && !removedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error eliminando notificación:', error);
      throw error;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    loadUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification
  };
};