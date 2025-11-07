import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth';

// Crear contexto
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    // Evitar verificaciones repetidas
    if (initialized) return;
    
    const checkAuth = async () => {
      try {
        setLoading(true);
        // Verificar si hay token en localStorage antes de hacer la solicitud
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setLoading(false);
          setInitialized(true);
          return;
        }
        
        const userData = await authService.getProfile();
        setUser(userData);
      } catch (error) {
        // No mostramos el error en consola, solo establecemos user a null
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuth();
  }, [initialized]);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      setUser(response.data.user);
      
      // Hacer una mini recarga para mostrar los datos sin parsear
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      return { success: true };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      // Asegurar que localStorage se limpia
      localStorage.removeItem('token');
      
      // Hacer una mini recarga para mostrar los datos parseados (modo free)
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así limpiar estado local
      setUser(null);
      localStorage.removeItem('token');
      
      // Hacer recarga incluso si hay error para asegurar que se muestren datos parseados
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
};