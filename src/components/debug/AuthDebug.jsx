import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AuthDebug = () => {
  const { user, isAuthenticated } = useAuth();
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Verificar token en localStorage
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const refreshToken = () => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  };

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-md z-50">
      <h3 className="text-lg font-bold mb-2">Debug Auth</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Autenticado:</strong> {isAuthenticated ? 'Sí' : 'No'}
        </div>
        
        <div>
          <strong>Usuario:</strong> {user ? user.nombre || user.email : 'No hay usuario'}
        </div>
        
        <div>
          <strong>Token (localStorage):</strong> 
          <span className="block text-xs break-all">
            {token ? `${token.substring(0, 20)}...` : 'No hay token'}
          </span>
        </div>
        
        <button 
          onClick={refreshToken}
          className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Actualizar
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;