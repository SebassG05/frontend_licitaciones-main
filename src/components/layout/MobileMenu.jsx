import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  Home, Globe, Wrench, BookOpen, Phone, ChevronDown,
  LogIn, User, X, Crown, ExternalLink, ArrowRight,
  Mail, Eye, EyeOff, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import GoogleLoginButton from '../auth/GoogleLoginButton';

const MobileMenu = ({
  isOpen,
  menuItems,
  onClose,
  onNavigation
}) => {
  const location = useLocation();
  const { login, logout, user, isAuthenticated } = useAuth();
  const { shouldShowInstallButton, handleInstall, isIOS } = usePWAInstall();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ AÑADIR: Estado para la altura del header
  const [headerHeight, setHeaderHeight] = useState(80); // Altura por defecto

  // ✅ AÑADIR: Efecto para calcular la altura del header
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        const height = header.offsetHeight;
        setHeaderHeight(height);
      }
    };

    // Calcular inicialmente
    updateHeaderHeight();

    // Recalcular cuando cambie el tamaño de la ventana o la ruta
    window.addEventListener('resize', updateHeaderHeight);

    // Usar MutationObserver para detectar cambios en el header (breadcrumbs)
    const header = document.querySelector('header');
    if (header) {
      const observer = new MutationObserver(updateHeaderHeight);
      observer.observe(header, {
        attributes: true,
        childList: true,
        subtree: true
      });

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', updateHeaderHeight);
      };
    }

    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [location.pathname]);

  useEffect(() => {
    if (location) {
      setActiveDropdown(null);
      setShowLoginForm(false);
    }
  }, [location]);

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setShowLoginForm(false);
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(prevActive => prevActive === name ? null : name);

    if (name !== 'login') {
      setShowLoginForm(false);
    }
  };

  const handleNavigation = (path) => {
    closeAllDropdowns();
    setTimeout(() => {
      onClose();
      onNavigation(path);
    }, 10);
  };

  const handlePWAInstall = async () => {
    if (isIOS) {
      alert('Lorem ipsum dolor iOS:\n1. Lorem ipsum Lorem ipsum Safari\n2. Lorem ipsum "Lorem ipsum dolor"\n3. Lorem ipsum "Lorem"');
      return;
    }

    const installed = await handleInstall();
    if (installed) {
      console.log('PWA instalada desde el menú móvil');
      onClose();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email || !password) {
      setLoginError('Lorem ipsum, consectetur email lorem ipsum');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        setShowLoginForm(false);
        setEmail('');
        setPassword('');
      } else {
        setLoginError(result.message || 'Lorem ipsum consectetur');
      }
    } catch (error) {
      setLoginError('Lorem ipsum dolor consectetur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setShowLoginForm(false);
      setActiveDropdown(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMenuIcon = (name) => {
    switch (name) {
      case 'Inicio': return <Home className="w-5 h-5" />;
      case 'Proyectos': return <Globe className="w-5 h-5" />;
      case 'Herramientas': return <Wrench className="w-5 h-5" />;
      case 'Publicaciones': return <BookOpen className="w-5 h-5" />;
      case 'Contacto': return <Phone className="w-5 h-5" />;
      default: return null;
    }
  };

  const safeClick = (callback) => (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setTimeout(() => callback(e), 5);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            // ✅ MODIFICAR: Usar la altura calculada dinámicamente
            style={{
              top: `${headerHeight}px`,
              bottom: 0
            }}
            className="absolute right-0 w-full max-w-[90%] sm:max-w-[360px] bg-gradient-to-br from-[#1e1e1e] to-[#262626] border-l border-[#a1db87]/30 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ...resto del código sin cambios... */}
            <div className="h-1 bg-gradient-to-r from-[#a1db87]/60 via-[#a1db87] to-[#a1db87]/60" />

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-2">
              {menuItems.map((item, index) => (
                <div key={`mobile-${item.name}`} className="rounded-xl overflow-hidden">
                  {item.dropdown ? (
                    <div className="bg-[#2a2a2a] rounded-xl">
                      <button
                        onClick={safeClick(() => toggleDropdown(item.name))}
                        className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium transition-all duration-200 ${activeDropdown === item.name
                          ? 'bg-[#a1db87] text-[#222222] shadow-xl'
                          : 'text-white hover:bg-[#333333]'
                          }`}
                      >
                        <div className="flex items-center min-w-0">
                          {getMenuIcon(item.name)}
                          <span className="ml-3 truncate">{item.name}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden bg-[#222]/70"
                          >
                            <div className="p-2 sm:p-3 space-y-1">
                              {item.dropdown.map((subItem) => {
                                const isActive = location.pathname === subItem.path;
                                return (
                                  <motion.button
                                    key={subItem.path}
                                    onClick={safeClick(() => handleNavigation(subItem.path))}
                                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-all duration-200 ${isActive
                                      ? 'bg-[#a1db87] text-[#222222] font-semibold shadow-lg'
                                      : 'text-gray-300 hover:bg-[#333333] hover:text-white'
                                      }`}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="truncate">{subItem.name}</span>
                                      {isActive && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="w-1.5 h-1.5 rounded-full bg-[#222222] flex-shrink-0 ml-2"
                                        />
                                      )}
                                    </div>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.button
                      onClick={safeClick(() => handleNavigation(item.path))}
                      className={`w-full flex items-center px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 ${location.pathname === item.path
                        ? 'bg-[#a1db87] text-[#222222] shadow-xl'
                        : 'text-white bg-[#2a2a2a] hover:bg-[#333333]'
                        }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {getMenuIcon(item.name)}
                      <span className="ml-3">{item.name}</span>
                    </motion.button>
                  )}
                </div>
              ))}

              {shouldShowInstallButton && (
                <div className="pt-2 sm:pt-3">
                  <motion.button
                    onClick={safeClick(handlePWAInstall)}
                    className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5 bg-[#2a2a2a] hover:bg-[#333333] rounded-xl font-medium transition-all duration-200 border border-[#a1db87]/20 hover:border-[#a1db87]/40 group relative overflow-hidden"
                    whileHover={{
                      y: -2,
                      transition: { type: "spring", stiffness: 400, damping: 25 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a1db87]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    <div className="flex items-center relative z-10">
                      <div className="relative mr-3">
                        <motion.img
                          src="/Corporatives/Images/Logo/Logo.png"
                          alt="Lorem ipsum Lorem"
                          className="w-5 h-5 sm:w-6 sm:h-6 object-contain filter transition-all duration-300"
                          style={{
                            filter: "brightness(1.1) contrast(1.1) drop-shadow(0 0 3px rgba(161,219,135,0.4))"
                          }}
                          animate={{
                            filter: "brightness(1.1) contrast(1.1) drop-shadow(0 0 3px rgba(161,219,135,0.4))"
                          }}
                          whileHover={{
                            filter: "brightness(1.3) contrast(1.2) drop-shadow(0 0 6px rgba(161,219,135,0.7))",
                            rotate: [0, -3, 3, 0],
                            transition: {
                              rotate: { duration: 0.5, ease: "easeInOut" },
                              filter: { duration: 0.3 }
                            }
                          }}
                        />

                        <motion.div
                          className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-[#a1db87] rounded-full"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.6, 1, 0.6]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>

                      <div className="flex-1 text-left">
                        <span className="text-white text-sm sm:text-base font-medium">
                          {isIOS ? 'Lorem ipsum Lorem' : 'Lorem ipsum Lorem'}
                        </span>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Lorem ipsum dolor consectetur adipiscing
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <motion.div
                        className="text-xs bg-[#a1db87]/20 text-[#a1db87] px-2 py-1 rounded-full border border-[#a1db87]/30"
                        whileHover={{
                          backgroundColor: "rgba(161, 219, 135, 0.3)",
                          borderColor: "rgba(161, 219, 135, 0.5)"
                        }}
                      >
                        PWA
                      </motion.div>
                    </div>
                  </motion.button>
                </div>
              )}

              <div className="h-20 sm:h-24" />
            </div>

            <div className="border-t border-[#444444]/60 px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-b from-[#1a1a1a] to-[#111111]">
              <button
                onClick={safeClick(() => toggleDropdown('login'))}
                className={`
                  w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm sm:text-base font-medium 
                  transition-all duration-300 border-2 backdrop-blur-sm
                  ${activeDropdown === 'login'
                    ? 'border-[#a1db87] bg-gradient-to-r from-[#a1db87]/15 via-[#a1db87]/10 to-[#a1db87]/5 text-[#a1db87] shadow-[0_0_20px_rgba(161,219,135,0.3)]'
                    : 'border-[#595959]/50 bg-[#2a2a2a]/50 text-white hover:border-[#a1db87]/70 hover:bg-[#a1db87]/5 hover:shadow-[0_0_15px_rgba(161,219,135,0.2)]'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  {isAuthenticated ? (
                    <>
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a1db87] to-[#7fb85d] flex items-center justify-center border-2 border-[#a1db87]/40 shadow-lg">
                          <User className="w-5 h-5 text-[#1a1a1a]" />
                        </div>
                        <motion.div
                          className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1a1a1a]"
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      </motion.div>
                      <div className="text-left flex-1 min-w-0">
                        <span className="block text-sm font-bold truncate">
                          {user?.name?.split(' ')[0] || 'Usuario'}
                        </span>
                        <span className="block text-xs text-gray-400">
                          {user?.position || 'Ver perfil'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2.5 bg-gradient-to-br from-[#a1db87]/20 to-[#a1db87]/5 rounded-xl border border-[#a1db87]/30">
                        <LogIn className="w-5 h-5 text-[#a1db87]" />
                      </div>
                      <div className="text-left flex-1">
                        <span className="block text-sm font-bold">Acceder</span>
                        <span className="block text-xs text-gray-400">Mi cuenta</span>
                      </div>
                    </>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: activeDropdown === 'login' ? 180 : 0 }}
                  transition={{ duration: 0.3, type: "spring" }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeDropdown === 'login' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden rounded-2xl border-2 border-[#a1db87]/30 bg-gradient-to-br from-[#2a2a2a] via-[#252525] to-[#1e1e1e] shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isAuthenticated ? (
                      /* PERFIL DE USUARIO - SIMPLIFICADO */
                      <div className="p-5 space-y-4">
                        {/* Info del usuario */}
                        <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-br from-[#333333]/50 to-[#2a2a2a]/30 border border-[#444444]/40">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#a1db87]/30 to-[#a1db87]/10 flex items-center justify-center border border-[#a1db87]/20">
                            <User className="w-7 h-7 text-[#a1db87]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-white text-base truncate">{user?.name}</div>
                            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                          </div>
                        </div>

                        {/* Badges - más compactos */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-lg bg-[#333333]/30 border border-[#444444]/30">
                            <div className="text-xs text-gray-500 mb-1">Departamento</div>
                            <div className="text-sm text-white font-semibold truncate">
                              {user?.department || 'General'}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-[#333333]/30 border border-[#444444]/30">
                            <div className="text-xs text-gray-500 mb-1">Cargo</div>
                            <div className="text-sm text-white font-semibold truncate">
                              {user?.position || 'Empleado'}
                            </div>
                          </div>
                        </div>

                        {/* Botón cerrar sesión - más simple */}
                        <motion.button
                          onClick={safeClick(handleLogout)}
                          disabled={isLoading}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/15 hover:bg-red-500/25 border-2 border-red-500/30 hover:border-red-500/50 text-red-300 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Cerrando...</span>
                            </>
                          ) : (
                            <>
                              <LogOut className="w-5 h-5" />
                              <span>Salir</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    ) : (
                      /* FORMULARIO DE LOGIN - ULTRA SIMPLE */
                      <form onSubmit={handleLogin} className="p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
                        {/* Error */}
                        <AnimatePresence>
                          {loginError && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2"
                            >
                              <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                              <p className="text-red-300 text-xs flex-1">{loginError}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Email */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1.5 block font-semibold">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-[#333333]/50 border-2 border-[#444444]/50 text-white rounded-xl focus:border-[#a1db87] focus:ring-2 focus:ring-[#a1db87]/20 outline-none transition-all text-sm placeholder:text-gray-500"
                            placeholder="tu@ejemplo.com"
                            required
                          />
                        </div>

                        {/* Contraseña */}
                        <div>
                          <label className="text-xs text-gray-400 mb-1.5 block font-semibold">Contraseña</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full px-4 py-3 pr-11 bg-[#333333]/50 border-2 border-[#444444]/50 text-white rounded-xl focus:border-[#a1db87] focus:ring-2 focus:ring-[#a1db87]/20 outline-none transition-all text-sm placeholder:text-gray-500"
                              placeholder="••••••••"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#a1db87] transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Botón */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-[#a1db87] to-[#8bc96a] hover:from-[#8bc96a] hover:to-[#7fb85d] text-[#1a1a1a] px-4 py-3 rounded-xl font-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Entrando...</span>
                            </>
                          ) : (
                            <>
                              <span>Entrar</span>
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </button>

                        {/* Badge acceso exclusivo */}
                        <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#a1db87]/10 border border-[#a1db87]/25 rounded-lg">
                          <svg className="w-3.5 h-3.5 text-[#a1db87] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-[10px] text-[#a1db87]/80 font-medium">Acceso con Google disponible para miembros registrados</span>
                        </div>

                        {/* Separador */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-px bg-[#444444]" />
                          <span className="text-xs text-gray-500 font-medium">o</span>
                          <div className="flex-1 h-px bg-[#444444]" />
                        </div>

                        {/* Login con Google */}
                        <GoogleLoginButton
                          onSuccess={() => {
                            setLoginError('');
                            setActiveDropdown(null);
                          }}
                          onError={(msg) => setLoginError(msg)}
                        />
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;