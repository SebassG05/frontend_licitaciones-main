import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings2 } from 'lucide-react';

const COOKIE_KEY = 'licitaciones_cookies_pref';

export default function CookiesModal({ open, onClose }) {
  const [showConfig, setShowConfig] = useState(false);
  const [prefs, setPrefs] = useState({
    necessary: true,
    analytics: true,
    personalization: true,
  });

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...prefs, accepted: true }));
    onClose(true);
  };
  const handleRejectAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ necessary: true, analytics: false, personalization: false, accepted: false }));
    onClose(false);
  };
  const handleSaveConfig = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...prefs, accepted: true }));
    onClose(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="bg-[#232323] rounded-2xl shadow-2xl p-8 max-w-md w-full border border-[#a1db87] relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-8 h-8 text-[#a1db87]" />
              <h2 className="text-xl font-bold text-[#a1db87]">Política de Cookies</h2>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar el contenido. Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias.
            </p>
            <ul className="text-gray-400 text-xs mb-4 list-disc pl-5">
              <li><span className="text-[#a1db87]">Cookies necesarias:</span> Permiten el funcionamiento básico de la web y no pueden desactivarse.</li>
              <li><span className="text-[#a1db87]">Cookies de análisis:</span> Nos ayudan a entender cómo usas la plataforma.</li>
              <li><span className="text-[#a1db87]">Cookies de personalización:</span> Adaptan el contenido a tus intereses.</li>
            </ul>
            {!showConfig ? (
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  className="bg-[#a1db87] text-[#181818] font-bold px-6 py-2 rounded-xl shadow hover:bg-[#8bc96a] transition-all w-full"
                  onClick={handleAcceptAll}
                >
                  Aceptar todas
                </button>
                <button
                  className="bg-gray-700 text-gray-200 font-bold px-6 py-2 rounded-xl shadow hover:bg-gray-600 transition-all w-full"
                  onClick={handleRejectAll}
                >
                  Rechazar
                </button>
                <button
                  className="bg-[#232323] border border-[#a1db87] text-[#a1db87] font-bold px-6 py-2 rounded-xl shadow hover:bg-[#181818] transition-all w-full flex items-center justify-center gap-2"
                  onClick={() => setShowConfig(true)}
                >
                  <Settings2 className="w-4 h-4" /> Configurar
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <h3 className="text-[#a1db87] font-semibold mb-2 text-base flex items-center gap-2"><Settings2 className="w-5 h-5" /> Configuración de cookies</h3>
                <div className="flex flex-col gap-3 mb-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked disabled className="accent-[#a1db87]" />
                    <span className="text-gray-300">Cookies necesarias <span className="text-xs text-gray-500">(siempre activas)</span></span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={prefs.analytics} onChange={e => setPrefs(p => ({ ...p, analytics: e.target.checked }))} className="accent-[#a1db87]" />
                    <span className="text-gray-300">Cookies de análisis</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={prefs.personalization} onChange={e => setPrefs(p => ({ ...p, personalization: e.target.checked }))} className="accent-[#a1db87]" />
                    <span className="text-gray-300">Cookies de personalización</span>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    className="bg-[#a1db87] text-[#181818] font-bold px-6 py-2 rounded-xl shadow hover:bg-[#8bc96a] transition-all w-full"
                    onClick={handleSaveConfig}
                  >
                    Guardar configuración
                  </button>
                  <button
                    className="bg-gray-700 text-gray-200 font-bold px-6 py-2 rounded-xl shadow hover:bg-gray-600 transition-all w-full"
                    onClick={handleRejectAll}
                  >
                    Rechazar todas
                  </button>
                  <button
                    className="bg-[#232323] border border-[#a1db87] text-[#a1db87] font-bold px-6 py-2 rounded-xl shadow hover:bg-[#181818] transition-all w-full"
                    onClick={() => setShowConfig(false)}
                  >
                    Volver
                  </button>
                </div>
              </div>
            )}
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-[#a1db87] text-lg"
              onClick={() => onClose(false)}
              title="Cerrar"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
