import { motion } from 'framer-motion';
import { Settings, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Configuration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent py-8 md:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            <Settings className="w-8 h-8 md:w-10 md:h-10 inline mr-3 text-[#a1db87]" />
            Configuración
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Esta página estará disponible próximamente
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#333333] border border-[#a1db87]/30 rounded-xl lg:rounded-2xl shadow-2xl p-8 text-center"
        >
          <div className="mb-6">
            <Settings className="w-16 h-16 mx-auto text-[#a1db87] mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Próximamente</h2>
            <p className="text-gray-300">
              La página de configuración estará disponible en futuras actualizaciones.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/perfil')}
            className="inline-flex items-center px-6 py-3 bg-[#a1db87] hover:bg-[#90c977] text-[#333333] rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Perfil
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Configuration;