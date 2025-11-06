import { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GoogleTranslateSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ];

  useEffect(() => {
    const checkGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        setIsReady(true);
      } else {
        setTimeout(checkGoogleTranslate, 500);
      }
    };
    checkGoogleTranslate();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (langCode) => {
    try {
      if (langCode === 'es') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.reload();
      } else {
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
          combo.value = langCode;
          combo.dispatchEvent(new Event('change'));
        } else {
          document.cookie = `googtrans=/es/${langCode}; path=/; domain=${window.location.hostname}`;
          setTimeout(() => window.location.reload(), 500);
        }
      }
    } catch (error) {
      console.error('Error cambiando idioma:', error);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDropdown}
        className={`
          flex items-center p-2 rounded-lg transition-all duration-200
          ${isOpen
            ? 'bg-[#a1db87]/20 text-[#a1db87]'
            : 'hover:bg-[#333333] text-gray-400 hover:text-[#a1db87]'
          }
        `}
        title="Cambiar idioma"
      >
        <Globe className="w-4.5 h-4.5" />
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-1"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-[#2a2a2a] border-2 border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Lista de idiomas - Sin indicador de selección */}
            <div className="p-2">
              {languages.map((lang, idx) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: idx * 0.05 }
                  }}
                  whileHover={{ x: 2 }}
                  onClick={() => changeLanguage(lang.code)}
                  disabled={!isReady}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#333333]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Footer con estado - Minimalista */}
            <div className="p-2 border-t border-gray-700 bg-[#1e1e1e]">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <span>{isReady ? 'Listo' : 'Cargando...'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoogleTranslateSelector;