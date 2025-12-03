const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://dtas.evenor-tech.com/api';

export const getMyAvatar = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No está autenticado.');
  const response = await fetch(`${API_URL}/users/avatar`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    credentials: 'include',
  });
  if (response.status === 404) return null; // No avatar, usuario nuevo o sin avatar
  if (!response.ok && response.status !== 404) {
    const data = await response.json();
    throw new Error(data.message || 'Error al obtener el avatar');
  }
  if (response.status === 404) return null;
  const data = await response.json();
  return data.data;
};

export const saveMyAvatar = async (avatarData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No está autenticado.');

  // Si avatarData es FormData, enviar como multipart/form-data
  if (avatarData instanceof FormData) {
    const response = await fetch(`${API_URL}/users/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: avatarData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al guardar el avatar');
    return data.data;
  } else {
    // Si es JSON (avatar predeterminado)
    const response = await fetch(`${API_URL}/users/avatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(avatarData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al guardar el avatar');
    return data.data;
  }
};

export const deleteMyAvatar = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No está autenticado.');
  const response = await fetch(`${API_URL}/users/avatar`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
    credentials: 'include',
  });
  if (response.status === 404) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al eliminar el avatar');
  return data.data;
};
