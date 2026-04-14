import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth';

// Crear contexto
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [userConfig, setUserConfig] = useState(null);
  const navigate = useNavigate();

  // Verificar token inmediatamente al inicializar
  const hasToken = localStorage.getItem('token');

  // Verificar si el usuario está autenticado al cargar la aplicación y obtener configuración
  useEffect(() => {
    if (initialized) return;
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setUserConfig(null);
          setLoading(false);
          setInitialized(true);
          return;
        }
        // Si hay token, obtener perfil completo del usuario
        let userData = await authService.getProfile();
        // Si el servicio de perfil existe, usarlo para obtener datos más completos
        try {
          const profileModule = await import('../services/profile');
          const profileData = await profileModule.getMyProfile();
          userData = { ...userData, ...profileData };
        } catch (err) {
          // Si falla, usar solo los datos mínimos
        }
        // Obtener avatar actualizado y sincronizarlo en el contexto
        try {
          const avatarModule = await import('../services/avatar');
          const avatarData = await avatarModule.getMyAvatar();
          userData = { ...userData, avatar: avatarData };
        } catch (err) {
          // Si falla, dejar avatar como está
        }
        setUser(userData);
        // Obtener configuración de usuario (incluye sessionTimeout)
        if (userData) {
          try {
            const configModule = await import('../services/configuration');
            const config = await configModule.getUserConfig();
            setUserConfig(config);
          } catch (err) {
            setUserConfig(null);
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
        setUserConfig(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    if (!hasToken) {
      setUser(null);
      setUserConfig(null);
      setLoading(false);
      setInitialized(true);
    } else {
      checkAuth();
    }
  }, [initialized, hasToken]);

  // Cierre automático de sesión por inactividad
  useEffect(() => {
    if (!user || !userConfig || !userConfig.seguridad) return;
    const timeoutMinutes = userConfig.seguridad.sessionTimeout || 60;
    const timeoutMs = timeoutMinutes * 60 * 1000;
    let timerId;

    const resetTimer = () => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        logout();
      }, timeoutMs);
    };

    // Eventos de actividad
    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
    resetTimer();

    return () => {
      if (timerId) clearTimeout(timerId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, userConfig]);

  // Función para iniciar sesión con Google
  const loginWithGoogle = async (idToken) => {
    try {
      setLoading(true);
      const response = await authService.googleLogin(idToken);
      try {
        const profileModule = await import('../services/profile');
        const profileData = await profileModule.getMyProfile();
        setUser({ ...response.data.user, ...profileData });
      } catch {
        setUser(response.data.user);
      }
      return { success: true };
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      // Obtener perfil completo tras login
      try {
        const profileModule = await import('../services/profile');
        const profileData = await profileModule.getMyProfile();
        setUser({ ...response.data.user, ...profileData });
      } catch (err) {
        setUser(response.data.user);
      }
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
    loginWithGoogle,
    logout,
    userConfig,
    setUserConfig,
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