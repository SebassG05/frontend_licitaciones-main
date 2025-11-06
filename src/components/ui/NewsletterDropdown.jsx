import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle, AlertCircle, X } from 'lucide-react';

const NewsletterDropdown = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.closest('.newsletter-btn')) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setErrorMessage('');
        
        // Validación básica
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage('Por favor, introduce un email válido');
            setStatus('error');
            return;
        }

        setStatus('loading');

        try {
            // Aquí iría tu llamada al API
            // const response = await subscribeToNewsletter(email);
            
            // Simulación de llamada API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setStatus('success');
            setEmail('');
            
            // Cerrar después de 2 segundos
            setTimeout(() => {
                setStatus('idle');
                onClose();
            }, 2000);
            
        } catch (error) {
            setStatus('error');
            setErrorMessage('Error al suscribirse. Por favor, intenta de nuevo.');
        }
    };

    const preventClickPropagation = (e) => {
        e.stopPropagation();
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.2,
                ease: [0.175, 0.885, 0.32, 1.275]
            }
        },
        exit: {
            opacity: 0,
            y: 10,
            scale: 0.95,
            transition: { duration: 0.15 }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dropdownRef}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full right-0 mt-2 w-80 bg-[#2a2a2a] border-2 border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
                    onClick={preventClickPropagation}
                >
                    {status === 'success' ? (
                        // Vista de éxito
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 15, delay: 0.1 }}
                                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </motion.div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                ¡Suscripción exitosa!
                            </h3>
                            <p className="text-sm text-gray-400">
                                Te enviaremos las mejores oportunidades de licitaciones
                            </p>
                        </motion.div>
                    ) : (
                        // Formulario de suscripción
                        <div className="p-5">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-[#a1db87]/20 rounded-lg border border-[#a1db87]/30">
                                        <Mail className="w-5 h-5 text-[#a1db87]" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">
                                            Newsletter
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            Recibe alertas de licitaciones
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-1 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </div>

                            {/* Formulario */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Input de email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setErrorMessage('');
                                                setStatus('idle');
                                            }}
                                            required
                                            disabled={status === 'loading'}
                                            className={`
                                                w-full pl-11 pr-4 py-3 bg-[#333333] border-2 rounded-xl 
                                                text-white placeholder-gray-500 
                                                focus:outline-none focus:ring-2 transition-all
                                                ${status === 'error' 
                                                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                                                    : 'border-gray-700 focus:border-[#a1db87] focus:ring-[#a1db87]/20'
                                                }
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                            `}
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Mensaje de error */}
                                <AnimatePresence>
                                    {status === 'error' && errorMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center space-x-2 p-3 bg-red-500/10 border-2 border-red-500/30 rounded-xl"
                                        >
                                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                            <p className="text-sm text-red-400">{errorMessage}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Botón de envío */}
                                <motion.button
                                    whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
                                    whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className={`
                                        w-full flex items-center justify-center space-x-2 
                                        py-3 px-4 rounded-xl font-bold shadow-lg 
                                        transition-all duration-300
                                        ${status === 'loading'
                                            ? 'bg-[#a1db87]/50 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-[#a1db87] to-[#8bc96a] hover:shadow-xl'
                                        }
                                        text-[#1a1a1a]
                                    `}
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Send className="w-5 h-5" />
                                            </motion.div>
                                            <span>Suscribiendo...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Suscribirme Gratis</span>
                                        </>
                                    )}
                                </motion.button>

                                {/* Footer con info */}
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">
                                        ✓ Sin spam · ✓ Cancela cuando quieras
                                    </p>
                                </div>
                            </form>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NewsletterDropdown;