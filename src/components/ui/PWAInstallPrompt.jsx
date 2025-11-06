import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, Plus } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

const PWAInstallPrompt = () => {
  const {
    shouldShowInstallButton,
    shouldShowIOSInstructions,
    isIOS,
    handleInstall
  } = usePWAInstall();

  const [showIOSModal, setShowIOSModal] = useState(false);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else {
      const installed = await handleInstall();
      if (installed) {
        console.log('PWA instalada exitosamente');
      }
    }
  };

  const dismissIOSModal = () => {
    setShowIOSModal(false);
  };

  // Solo devolver el modal de iOS, sin popup automático
  return (
    <AnimatePresence>
      {showIOSModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={dismissIOSModal}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-[#333333] rounded-xl p-6 max-w-sm w-full border border-[#444]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Instalar en iOS</h3>
              <button
                onClick={dismissIOSModal}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#444] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-gray-300 text-sm">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#a1db87]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#a1db87] font-bold">1</span>
                </div>
                <div>
                  <p>Toca el botón <strong>Compartir</strong> <Share className="inline w-4 h-4" /> en la barra de navegación de Safari</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#a1db87]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#a1db87] font-bold">2</span>
                </div>
                <div>
                  <p>Desplázate hacia abajo y selecciona <strong>"Agregar a pantalla de inicio"</strong> <Plus className="inline w-4 h-4" /></p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-[#a1db87]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#a1db87] font-bold">3</span>
                </div>
                <div>
                  <p>Confirma tocando <strong>"Agregar"</strong> en la esquina superior derecha</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#444]">
              <button
                onClick={dismissIOSModal}
                className="w-full py-2 px-4 bg-[#a1db87] text-[#333333] rounded-lg hover:bg-[#90c977] transition-colors font-medium"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;