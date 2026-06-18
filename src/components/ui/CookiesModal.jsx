import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings2, Link } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const COOKIE_KEY = 'licitaciones_cookies_pref';

export default function CookiesModal({ open, onClose }) {
  const [showConfig, setShowConfig] = useState(false);
  const [prefs, setPrefs] = useState({
    necessary: true,
    analytics: true,
    advertising: true,
  });
  const [closing, setClosing] = useState(false);

  const closeWithAnimation = (cb) => {
    setClosing(true);
    setTimeout(() => {
      cb();
      setClosing(false);
    }, 350);
  };

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...prefs, analytics: true, advertising: true, accepted: true }));
    closeWithAnimation(() => onClose(true));
  };
  const handleRejectAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ necessary: true, analytics: false, advertising: false, accepted: false }));
    closeWithAnimation(() => onClose(false));
  };
  const handleSaveConfig = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...prefs, accepted: true }));
    closeWithAnimation(() => onClose(true));
  };

  return (
    <AnimatePresence>
      {open && !closing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        >
          {/* Fondo borroso */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" />
          <motion.div
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="bg-[#1a1a1a] rounded-2xl shadow-2xl p-6 max-w-lg w-full border border-[#a1db87]/40 relative"
            style={{ zIndex: 51 }}
          >
            {!showConfig ? (
              <>
                {/* Cabecera */}
                <div className="flex items-center gap-3 mb-4">
                  <Cookie className="w-7 h-7 text-[#a1db87] flex-shrink-0" />
                  <h2 className="text-lg font-bold text-white">PolÃ­tica de Cookies</h2>
                </div>

                {/* Texto legal â€” escenario: propias + terceros + publicidad + anÃ¡lisis */}
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  Este sitio web utiliza <strong className="text-white">Cookies propias y de terceros</strong>,
                  para recopilar informaciÃ³n con la finalidad de mejorar nuestros servicios y mostrarle
                  publicidad relacionada con sus preferencias, en base a un perfil elaborado a partir de sus
                  hÃ¡bitos de navegaciÃ³n. Puede obtener mÃ¡s informaciÃ³n en nuestra{' '}
                  <RouterLink to="/cookies" className="text-[#a1db87] underline hover:text-[#8bc96a] transition-colors" onClick={() => closeWithAnimation(() => onClose(false))}>
                    PolÃ­tica de Cookies
                  </RouterLink>.
                </p>

                {/* Responsable */}
                <p className="text-xs text-gray-500 mb-5">
                  <strong className="text-gray-400">Responsable:</strong> EVENOR TECH, S.L.U. Â· NIF B91790527 Â·{' '}
                  <strong className="text-gray-400">Finalidad:</strong> GestiÃ³n e instalaciÃ³n de las cookies. Â·{' '}
                  <strong className="text-gray-400">Derechos:</strong> Acceder, rectificar y suprimir los datos,
                  y otros derechos explicados en la{' '}
                  <RouterLink to="/privacidad" className="text-[#a1db87] underline hover:text-[#8bc96a] transition-colors" onClick={() => closeWithAnimation(() => onClose(false))}>
                    PolÃ­tica de Privacidad
                  </RouterLink>.
                </p>

                {/* Tres botones */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    className="cursor-pointer bg-[#a1db87] text-[#181818] font-bold px-4 py-2.5 rounded-xl shadow hover:bg-[#8bc96a] transition-all duration-200 text-sm"
                    onClick={handleAcceptAll}
                  >
                    ACEPTAR TODO
                  </button>
                  <button
                    className="cursor-pointer bg-[#2a2a2a] border border-[#444444] text-gray-300 font-bold px-4 py-2.5 rounded-xl shadow hover:border-[#a1db87] hover:text-white transition-all duration-200 text-sm"
                    onClick={handleRejectAll}
                  >
                    RECHAZAR TODO
                  </button>
                  <button
                    className="cursor-pointer bg-[#1a1a1a] border border-[#a1db87] text-[#a1db87] font-bold px-4 py-2.5 rounded-xl shadow hover:bg-[#232323] transition-all duration-200 text-sm flex items-center justify-center gap-1.5"
                    onClick={() => setShowConfig(true)}
                  >
                    <Settings2 className="w-4 h-4" /> CONFIGURACIÃ“N
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Panel de configuraciÃ³n */}
                <div className="flex items-center gap-3 mb-4">
                  <Settings2 className="w-6 h-6 text-[#a1db87] flex-shrink-0" />
                  <h2 className="text-lg font-bold text-white">ConfiguraciÃ³n de cookies</h2>
                </div>
                <p className="text-gray-400 text-xs mb-4">
                  Puede habilitar y deshabilitar las cookies segÃºn sus finalidades:
                </p>

                <div className="space-y-3 mb-5">
                  {/* TÃ©cnicas â€” siempre activas */}
                  <div className="flex items-start gap-3 bg-[#232323] border border-[#2a2a2a] rounded-xl p-3">
                    <input type="checkbox" checked disabled className="accent-[#a1db87] mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-semibold text-white">TÃ©cnicas</span>
                      <span className="text-xs text-gray-500 ml-1">(siempre activas)</span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Permiten al usuario la navegaciÃ³n a travÃ©s del sitio web y la utilizaciÃ³n de las
                        diferentes opciones o servicios que en Ã©l existan.
                      </p>
                    </div>
                  </div>

                  {/* AnalÃ­ticas */}
                  <label className="flex items-start gap-3 bg-[#232323] border border-[#2a2a2a] rounded-xl p-3 cursor-pointer hover:border-[#a1db87]/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={prefs.analytics}
                      onChange={e => setPrefs(p => ({ ...p, analytics: e.target.checked }))}
                      className="accent-[#a1db87] mt-0.5 flex-shrink-0"
                    />
                    <div className="text-sm">
                      <span className="font-semibold text-white">AnalÃ­ticas</span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Permiten el seguimiento y anÃ¡lisis del comportamiento de los usuarios de los sitios
                        web a los que estÃ¡n vinculadas.
                      </p>
                    </div>
                  </label>

                  {/* Publicidad comportamental */}
                  <label className="flex items-start gap-3 bg-[#232323] border border-[#2a2a2a] rounded-xl p-3 cursor-pointer hover:border-[#a1db87]/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={prefs.advertising}
                      onChange={e => setPrefs(p => ({ ...p, advertising: e.target.checked }))}
                      className="accent-[#a1db87] mt-0.5 flex-shrink-0"
                    />
                    <div className="text-sm">
                      <span className="font-semibold text-white">Publicidad comportamental</span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Almacenan informaciÃ³n del comportamiento de los usuarios obtenida a travÃ©s de la
                        observaciÃ³n continuada de sus hÃ¡bitos de navegaciÃ³n, permitiendo mostrar publicidad
                        personalizada.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    className="cursor-pointer bg-[#a1db87] text-[#181818] font-bold px-4 py-2.5 rounded-xl shadow hover:bg-[#8bc96a] transition-all duration-200 text-sm"
                    onClick={handleAcceptAll}
                  >
                    ACEPTAR TODO
                  </button>
                  <button
                    className="cursor-pointer bg-[#2a2a2a] border border-[#444444] text-gray-300 font-bold px-4 py-2.5 rounded-xl shadow hover:border-[#a1db87] hover:text-white transition-all duration-200 text-sm"
                    onClick={handleRejectAll}
                  >
                    RECHAZAR TODO
                  </button>
                  <button
                    className="cursor-pointer bg-[#1a1a1a] border border-[#a1db87] text-[#a1db87] font-bold px-4 py-2.5 rounded-xl shadow hover:bg-[#232323] transition-all duration-200 text-sm"
                    onClick={handleSaveConfig}
                  >
                    GUARDAR
                  </button>
                </div>

                <button
                  className="cursor-pointer mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors w-full text-center"
                  onClick={() => setShowConfig(false)}
                >
                  â† Volver
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
