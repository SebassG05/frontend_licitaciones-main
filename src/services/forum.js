// Eliminar un post del foro
export const deleteForumPost = async (postId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/forum/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error('Respuesta del servidor no válida');
  }
  if (!response.ok) {
    throw new Error(data.message || 'Error al eliminar post');
  }
  return data;
};
// Servicio para obtener todos los posts del foro
const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const getAllForumPosts = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/forum/posts`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  let data;
  const text = await response.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = null;
  }
  if (!response.ok) {
    const message = (data && (data.message || data.error)) || response.statusText || 'Error al obtener los posts del foro';
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }
  return (data && (data.data || data)) || [];
};

export const getPerfilEmpresa = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/forum/empresa/perfil`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Error al obtener perfil de empresa');
  return await response.json();
};

export const getPostsByLicitacion = async (licitacionId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/forum/licitacion/${licitacionId}/posts`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (response.status === 404) return { posts: [], total: 0 };
  if (!response.ok) throw new Error('Error al obtener posts de la licitación');
  return await response.json();
};

// Marcar un post como favorito
export const marcarFavorito = async (postId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/forum/posts/${postId}/favorito`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al marcar favorito');
  return await response.json();
};

// Desmarcar un post como favorito
export const desmarcarFavorito = async (postId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/forum/posts/${postId}/favorito`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al desmarcar favorito');
  return await response.json();
};

// Obtener los posts favoritos del usuario
export const getFavoritos = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/forum/favoritos`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Error al obtener favoritos');
  return await response.json();
};

// Responder a un post
export const responderPost = async (postId, mensaje, parentRespuesta = null) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/forum/posts/${postId}/responder`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ mensaje, parentRespuesta })
  });
  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error('Respuesta del servidor no válida');
  }
  if (!response.ok) {
    // Si el backend envía un mensaje, lo mostramos
    throw new Error(data.message || 'Error al responder post');
  }
  return data.data || data;
};

// Eliminar una respuesta de un post
export const eliminarRespuesta = async (postId, respuestaId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/forum/posts/${postId}/respuestas/${respuestaId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error('Respuesta del servidor no válida');
  }
  if (!response.ok) throw new Error(data.message || 'Error al eliminar respuesta');
  return data.data || data;
};
