import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Bell, ArrowDown, Leaf } from 'lucide-react';

const NewsletterPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const hasInitializedRef = useRef(false);
  const newsletterFormRef = useRef(null);

  // Detectar dispositivo para optimizar experiencia
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Efecto para encontrar y almacenar referencia al formulario del newsletter
  useEffect(() => {
    const footerForm = document.querySelector('footer form');
    if (footerForm) {
      newsletterFormRef.current = footerForm;
    }
  }, []);

  // Efecto para mostrar la notificación con un retraso después de cargar la página
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const shouldShowPrompt = () => {
      try {
        // No mostrar si el usuario la cerró permanentemente
        if (localStorage.getItem('newsletterClosed') === 'true') {
          return false;
        }

        // No mostrar si estamos en la misma sesión y ya se mostró
        if (sessionStorage.getItem('newsletterShown') === 'true') {
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error al verificar el estado del newsletter:', error);
        return false;
      }
    };

    // Mostrar con retraso para no interferir con la carga inicial
    const timer = setTimeout(() => {
      if (shouldShowPrompt()) {
        setIsVisible(true);
        try {
          sessionStorage.setItem('newsletterShown', 'true');
        } catch (error) {
          console.error('Error al guardar estado de sesión:', error);
        }
      }
    }, 4000); // 4 segundos de retraso

    return () => clearTimeout(timer);
  }, []);

  // Cierre permanente de la notificación
  const handleClose = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('newsletterClosed', 'true');
    } catch (error) {
      console.error('Error al guardar preferencia:', error);
    }
  };

  // Navegar al formulario del newsletter
  const handleSubscribe = () => {
    setIsVisible(false);

    // Usar la referencia al formulario si está disponible
    if (newsletterFormRef.current) {
      // Hacer scroll al formulario suavemente
      newsletterFormRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });

      // Destacar el formulario con animación
      setTimeout(() => {
        const newsletterSection = newsletterFormRef.current.closest('div');
        if (newsletterSection) {
          // Agregar clase de highlight temporal
          newsletterSection.style.transform = 'scale(1.02)';
          newsletterSection.style.boxShadow = '0 0 30px rgba(161, 219, 135, 0.4)';
          newsletterSection.style.border = '1px solid rgba(161, 219, 135, 0.7)';
          newsletterSection.style.borderRadius = '12px';
          newsletterSection.style.transition = 'all 0.4s ease';

          // Enfocar el campo de email
          const emailInput = newsletterFormRef.current.querySelector('input[type="email"]');
          if (emailInput) {
            emailInput.focus();
            emailInput.style.boxShadow = '0 0 15px rgba(161, 219, 135, 0.5)';
          }

          // Quitar el highlight después de un tiempo
          setTimeout(() => {
            newsletterSection.style.transform = '';
            newsletterSection.style.boxShadow = '';
            newsletterSection.style.border = '';
            if (emailInput) {
              emailInput.style.boxShadow = '';
            }
          }, 3000);
        }
      }, 800);
    } else {
      // Fallback: scroll al footer
      const footer = document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay sutil para móvil */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 sm:hidden"
            onClick={handleClose}
          />

          {/* Prompt principal */}
          <motion.div
            initial={{ 
              opacity: 0, 
              y: isMobile ? 100 : 50, 
              scale: 0.9,
              x: isMobile ? 0 : 50
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              x: 0
            }}
            exit={{ 
              opacity: 0, 
              y: isMobile ? 100 : 30, 
              scale: 0.95,
              x: isMobile ? 0 : 50
            }}
            transition={{ 
              type: "spring", 
              stiffness: isMobile ? 300 : 400, 
              damping: isMobile ? 20 : 25,
              duration: isMobile ? 0.4 : 0.5
            }}
            className={`
              fixed z-50 
              ${isMobile 
                ? 'bottom-4 left-4 right-4 max-w-none' 
                : isTablet 
                  ? 'bottom-6 right-6 w-80'
                  : 'bottom-8 right-8 w-96'
              }
            `}
          >
            {/* Card principal con estilo de la web */}
            <div className="relative bg-[#333333] border border-[#a1db87]/30 rounded-xl shadow-2xl overflow-hidden">
              {/* Línea superior decorativa */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a1db87] via-[#90c977] to-[#a1db87]"></div>
              
              {/* Elementos decorativos de fondo */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#a1db87]/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#a1db87]/5 rounded-full blur-lg"></div>
              
              {/* Contenido */}
              <div className={`relative ${isMobile ? 'p-5' : 'p-6'}`}>
                <div className="flex items-start space-x-4">
                  {/* Icono principal */}
                  <motion.div 
                    className={`
                      flex-shrink-0 rounded-full p-3 shadow-lg
                      bg-gradient-to-br from-[#a1db87] to-[#90c977]
                      ${isMobile ? 'p-2.5' : 'p-3'}
                    `}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Bell size={isMobile ? 16 : 18} className="text-[#333333]" />
                  </motion.div>

                  {/* Contenido de texto */}
                  <div className="flex-1 min-w-0">
                    <motion.div
                      className="flex items-center justify-between mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className={`
                        text-white font-semibold flex items-center
                        ${isMobile ? 'text-sm' : 'text-base'}
                      `}>
                        <Leaf size={isMobile ? 14 : 16} className="text-[#a1db87] mr-2" />
                        ¡Mantente informado!
                      </h4>
                      
                      {/* Botón cerrar */}
                      <motion.button
                        onClick={handleClose}
                        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10"
                        aria-label="Cerrar notificación"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <X size={isMobile ? 14 : 16} />
                      </motion.button>
                    </motion.div>
                    
                    <motion.p 
                      className={`
                        text-gray-300 leading-relaxed mb-4
                        ${isMobile ? 'text-xs' : 'text-sm'}
                      `}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Recibe las últimas noticias sobre nuestros proyectos de investigación e innovaciones en tecnología sostenible.
                    </motion.p>

                    {/* Botones de acción */}
                    <motion.div 
                      className={`
                        flex gap-3
                        ${isMobile ? 'flex-col' : 'flex-row'}
                      `}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {/* Botón suscribirse */}
                      <motion.button
                        onClick={handleSubscribe}
                        className={`
                          flex-1 bg-gradient-to-r from-[#a1db87] to-[#90c977] 
                          hover:from-[#90c977] hover:to-[#7fb863] 
                          text-[#333333] rounded-lg font-medium 
                          transition-all duration-300 shadow-lg hover:shadow-xl 
                          flex items-center justify-center space-x-2 group
                          ${isMobile ? 'py-2.5 px-4 text-sm' : 'py-2 px-4 text-sm'}
                        `}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Mail size={isMobile ? 14 : 16} />
                        <span>Suscribirme</span>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ x: -5 }}
                          animate={{ x: 0 }}
                        >
                          <ArrowDown size={12} />
                        </motion.div>
                      </motion.button>

                      {/* Botón no gracias */}
                      <motion.button
                        onClick={handleClose}
                        className={`
                          bg-transparent border border-[#444444] hover:border-[#a1db87]/50 
                          hover:bg-[#a1db87]/10 text-gray-300 hover:text-white 
                          rounded-lg transition-all duration-300
                          ${isMobile 
                            ? 'py-2.5 px-4 text-sm flex-1' 
                            : 'py-2 px-4 text-sm flex-none'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        No, gracias
                      </motion.button>
                    </motion.div>
                  </div>
                </div>

                {/* Indicador de sostenibilidad */}
                <motion.div
                  className="mt-4 pt-3 border-t border-[#444444]/50 flex items-center text-xs text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Leaf size={12} className="text-[#a1db87] mr-1.5" />
                  <span>Compromiso con la innovación sostenible</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPrompt;