import { motion, AnimatePresence } from 'framer-motion';
import { Building2, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterCompanyPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToRegister = () => {
    if (onClose) onClose();
    // Navegar a la página de perfil de empresa o registro
    navigate('/perfil-empresa');
  };

  const handleClose = () => {
    if (onClose) onClose();
    // Redirigir a la página principal
    navigate('/');
  };

  const requirements = [
    'Registra información básica de tu empresa',
    'Valida tus datos de contacto',
    'Completa el perfil de tu empresa',
    'Accede a todas las funciones del foro'
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
          {/* Cabecera */}
          <div className="bg-gradient-to-r from-[#a1db87] to-[#8ac573] p-5 relative">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-7 h-7 text-white" />
                <h2 className="text-2xl font-bold text-white">Registrar Empresa</h2>
              </div>
              <p className="text-white/90 text-sm">
                Necesario para acceder al foro de empresas
              </p>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Debes registrar tu empresa primero
              </h3>
              <p className="text-gray-400 text-sm">
                Para participar en el foro y acceder a todas las oportunidades, necesitas completar el registro de tu empresa
              </p>
            </div>

            {/* Requerimientos */}
            <div className="space-y-3 mb-6">
              {requirements.map((requirement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-[#a1db87] flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{requirement}</span>
                </motion.div>
              ))}
            </div>

            {/* Botones */}
            <div className="space-y-3">
              <motion.button
                onClick={handleGoToRegister}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#a1db87] to-[#8ac573] hover:from-[#8ac573] hover:to-[#6dc042] text-[#1a1a1a] font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-[#a1db87]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                Registrar Empresa
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Cerrar
              </motion.button>
            </div>

            {/* Texto de información */}
            <p className="text-gray-500 text-xs text-center mt-4">
              El registro de tu empresa te permitirá participar completamente en nuestra comunidad
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RegisterCompanyPopup;
