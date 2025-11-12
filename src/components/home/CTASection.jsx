import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const benefits = [
    'Registro gratuito',
    'Acceso inmediato',
    'Sin compromiso'
  ];

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-transparent">
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative bg-[#2a2a2a] border-2 border-[#a1db87] rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden"
        >
          {/* Decoración de fondo sutil */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#a1db87]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a1db87]/5 rounded-full blur-3xl" />

          {/* Contenido */}
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            {/* Título */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6"
            >
              ¿Listo para encontrar tu próxima{' '}
              <span className="text-[#a1db87]">oportunidad</span>?
            </motion.h2>

            {/* Descripción */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-gray-300 mb-8"
            >
              Únete a miles de empresas que ya están aprovechando nuestras herramientas
            </motion.p>

            {/* Lista de beneficios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#1a1a1a] border border-[#333333] rounded-full"
                >
                  <CheckCircle className="w-4 h-4 text-[#a1db87]" />
                  <span className="text-sm text-gray-300 font-medium">{benefit}</span>
                </div>
              ))}
            </motion.div>

            {/* Botón CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link to="/servicios">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer inline-flex items-center space-x-2 px-8 py-4 bg-[#a1db87] text-[#1a1a1a] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <span>Comenzar ahora</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <p className="mt-4 text-xs text-gray-400">
                No se requiere tarjeta de crédito
              </p>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTASection;