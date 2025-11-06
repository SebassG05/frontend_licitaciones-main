import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const [showButton, setShowButton] = useState(false);

    // Esta función maneja el reseteo del scroll cuando cambia la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Esta función controla la visibilidad del botón basado en el scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Renderizamos el botón solo si showButton es true
    return (
        <AnimatePresence>
            {showButton && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={scrollToTop}
                    className="fixed right-6 bottom-6 z-50 p-3 bg-[#a1db87] text-[#333333] rounded-full shadow-lg hover:bg-[#a1db87]/90 transition-colors"
                    aria-label="Volver arriba"
                >
                    <ChevronUp size={20} />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;