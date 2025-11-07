import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, CheckCircle } from 'lucide-react';

const PremiumPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
          className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-4 relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Acceso Premium</h2>
              </div>
              <p className="text-amber-100 text-xs">
                Desbloquea el potencial completo de nuestra plataforma
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="text-center mb-4">
              <h3 className="text-base font-semibold text-white mb-1">
                Esta funcionalidad requiere una cuenta Premium
              </h3>
              <p className="text-gray-400 text-xs">
                Accede a información completa y detalles exclusivos de las licitaciones
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-4">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-xs">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <motion.a
                href="/contacto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-500/25 text-center text-sm inline-block"
              >
                Contáctanos
              </motion.a>
              
              <button
                onClick={onClose}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2.5 rounded-xl transition-colors duration-200 text-sm"
              >
                Continuar con versión gratuita
              </button>
            </div>

            <div className="text-center mt-3">
              <p className="text-gray-500 text-xs">
                ¿Ya tienes una cuenta Premium?{' '}
                <span className="text-amber-400 cursor-pointer hover:underline">
                  Inicia sesión aquí
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PremiumPopup;