import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, CheckCircle } from 'lucide-react';

const PremiumPopup = ({ isOpen, onClose, onLoginClick }) => {
  if (!isOpen) return null;

  const handleLoginClick = () => {
    onClose(); // Cerrar el popup premium
    if (onLoginClick) {
      onLoginClick(); // Ejecutar callback para abrir login
    } else {
      // Fallback: disparar evento personalizado para que el header lo capture
      window.dispatchEvent(new CustomEvent('openLogin'));
    }
  };

  const premiumFeatures = [
    'Acceso completo a todas las licitaciones',
    'Información detallada sin restricciones',
    'Alertas personalizadas por email',
    'Filtros avanzados de búsqueda'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#a1db87]/20 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#a1db87] to-[#8ac573] p-5 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 z-20"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-7 h-7 text-white" />
                <h2 className="text-2xl font-bold text-white">Acceso Premium</h2>
              </div>
              <p className="text-white/90 text-sm">
                Desbloquea el potencial completo de nuestra plataforma
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Esta funcionalidad requiere una cuenta Premium
              </h3>
              <p className="text-gray-400 text-sm">
                Accede a información completa y detalles exclusivos de las licitaciones
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-[#a1db87] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <motion.a
                href="/contacto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#a1db87] to-[#8ac573] hover:from-[#8ac573] hover:to-[#6dc042] text-[#1a1a1a] font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-[#a1db87]/25 text-center text-sm inline-block"
              >
                Contáctanos
              </motion.a>
              
              <button
                onClick={onClose}
                className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 font-medium py-3 rounded-xl transition-colors duration-200 text-sm border border-gray-600 hover:border-gray-500"
              >
                Continuar con versión gratuita
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-gray-500 text-sm">
                ¿Ya tienes una cuenta Premium?{' '}
                <button 
                  onClick={handleLoginClick}
                  className="text-[#a1db87] cursor-pointer hover:underline font-medium hover:text-[#90c977] transition-colors"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PremiumPopup;