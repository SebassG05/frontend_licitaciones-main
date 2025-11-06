import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, LogIn, LogOut, User, Shield, 
  AlertCircle, Loader, ArrowRight, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginDropdown = ({ isOpen, onClose, isMobile = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { login, logout, user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMobile && dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.closest('.auth-btn')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, isMobile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        setEmail('');
        setPassword('');
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setError(result.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const preventClickPropagation = (e) => {
    e.stopPropagation();
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      onClose();
    } catch (err) {
      setError('Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.175, 0.885, 0.32, 1.275]
      }
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: { duration: 0.15 }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.3
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-full right-0 mt-2 w-80 bg-[#2a2a2a] border-2 border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
          onClick={preventClickPropagation}
        >
          {/* Contenido */}
          <div className="p-4">
            {isAuthenticated ? (
              // Usuario autenticado
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Info del usuario */}
                <div className="flex items-center space-x-3 p-3 bg-[#333333]/50 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a1db87]/30 to-[#a1db87]/50 flex items-center justify-center border-2 border-[#a1db87]/40">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{user?.name || 'Usuario'}</p>
                    <p className="text-gray-400 text-sm truncate">{user?.email || 'email@ejemplo.com'}</p>
                  </div>
                </div>

                {/* Opciones de usuario */}
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ x: 4 }}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#333333] transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400 group-hover:text-[#a1db87] transition-colors" />
                      <span className="text-gray-300 group-hover:text-white transition-colors">Mi Perfil</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#a1db87] transition-colors" />
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 4 }}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#333333] transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-400 group-hover:text-[#a1db87] transition-colors" />
                      <span className="text-gray-300 group-hover:text-white transition-colors">Configuración</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#a1db87] transition-colors" />
                  </motion.button>
                </div>

                {/* Botón de cerrar sesión */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-semibold transition-all duration-300 border-2 border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <LogOut className="w-5 h-5" />
                      <span>Cerrar Sesión</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              // Formulario de login
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <motion.div
                  custom={0}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-[#333333] border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a1db87] focus:ring-2 focus:ring-[#a1db87]/20 transition-all"
                      placeholder="tu@email.com"
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div
                  custom={1}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-12 py-3 bg-[#333333] border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#a1db87] focus:ring-2 focus:ring-[#a1db87]/20 transition-all"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#a1db87] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-2 p-3 bg-red-500/10 border-2 border-red-500/30 rounded-xl"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botón de login */}
                <motion.button
                  custom={2}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-[#a1db87] to-[#8bc96a] text-[#1a1a1a] rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Iniciar Sesión</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginDropdown;