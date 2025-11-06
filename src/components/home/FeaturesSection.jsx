import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Map, FileBarChart, Bell, Lock, Crown, Sparkles } from 'lucide-react';
import Container from '../ui/Container';

const FeaturesSection = () => {
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

  const features = [
    {
      id: 1,
      icon: <Search className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: 'Búsqueda Avanzada',
      description: 'Filtros inteligentes por territorio, sector y presupuesto',
      isPremium: false,
      color: '#a1db87'
    },
    {
      id: 2,
      icon: <Map className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: 'Visor Territorial',
      description: 'Mapa interactivo con datos geoespaciales en tiempo real',
      isPremium: true,
      color: '#8bc96a'
    },
    {
      id: 3,
      icon: <FileBarChart className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: 'Análisis Completo',
      description: 'Datos completos, presupuestos y documentación técnica',
      isPremium: true,
      color: '#7fb85d'
    },
    {
      id: 4,
      icon: <Bell className="w-8 h-8 sm:w-10 sm:h-10" />,
      title: 'Alertas Personalizadas',
      description: 'Notificaciones automáticas de proyectos relevantes',
      isPremium: true,
      color: '#6fa550'
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-transparent relative overflow-hidden">
      {/* Decoración de fondo - similar a Tools */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#a1db87]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#a1db87]/5 rounded-full blur-3xl" />
      </div>

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16 relative z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="inline-flex items-center px-4 py-2 bg-[#2a2a2a] border border-[#a1db87]/30 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4 text-[#a1db87] mr-2" />
            <span className="text-xs sm:text-sm font-semibold text-[#a1db87]">
              Funcionalidades Clave
            </span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Herramientas <span className="text-[#a1db87]">poderosas</span> para tu éxito
          </h2>
          
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Encuentra, analiza y gestiona licitaciones con las mejores herramientas del mercado
          </p>
        </motion.div>

        {/* Grid de círculos - Estilo Tools */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 justify-items-center relative z-10"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: isMobile ? 0.1 : 0.15
              }
            }
          }}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.8 },
                show: { opacity: 1, y: 0, scale: 1 }
              }}
              className="w-full flex flex-col items-center group"
            >
              {/* Círculo con icono - Igual que Tools */}
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: isMobile ? 300 : 400, damping: 10 }}
                className="relative mb-4"
              >
                {/* Resplandor de fondo */}
                <div 
                  className="absolute inset-0 rounded-full blur-lg transform group-hover:scale-110 transition-all duration-300"
                  style={{ backgroundColor: `${feature.color}30` }}
                />
                
                {/* Círculo principal */}
                <div 
                  className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center bg-white rounded-full overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl"
                  style={{
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    borderColor: `${feature.color}80`
                  }}
                >
                  {/* Icono */}
                  <motion.div
                    className="text-[#333333]"
                    animate={{
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                </div>
              </motion.div>

              {/* Título */}
              <motion.h3
                className="text-sm sm:text-base md:text-lg font-bold text-white text-center mb-2 group-hover:text-[#a1db87] transition-colors"
                animate={{ y: [0, -2, 0] }}
                transition={{
                  duration: isMobile ? 1.8 : 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {feature.title}
              </motion.h3>

              {/* Descripción */}
              <p className="text-xs sm:text-sm text-gray-400 text-center max-w-[200px] leading-relaxed">
                {feature.description}
              </p>

              {/* Indicador Premium debajo */}
              {feature.isPremium && (
                <motion.div
                  className="mt-2 flex items-center space-x-1 px-3 py-1 bg-[#a1db87]/20 border border-[#a1db87]/30 rounded-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Lock className="w-3 h-3 text-[#a1db87]" />
                  <span className="text-xs font-bold text-[#a1db87]">Premium</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Línea divisoria decorativa - Como en Tools */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: "100%" } : {}}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          className="h-px bg-gradient-to-r from-transparent via-[#a1db87]/30 to-transparent mt-12 sm:mt-16"
        />
      </Container>
    </section>
  );
};

export default FeaturesSection;