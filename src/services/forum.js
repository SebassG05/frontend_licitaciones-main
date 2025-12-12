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
  if (!response.ok) throw new Error('Error al obtener los posts del foro');
  const data = await response.json();
  return data.data || [];
};
