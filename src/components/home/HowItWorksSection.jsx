import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  CreditCard, 
  CheckCircle, 
  Sparkles, 
  ArrowDown,
  PlayCircle,
  ChevronRight
} from 'lucide-react';
import Container from '../ui/Container';

const HowItWorksSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredStep, setHoveredStep] = useState(null);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const steps = [
    {
      id: 1,
      number: '01',
      icon: <Search className="w-8 h-8" />,
      title: 'Explora sin límites',
      description: 'Busca y visualiza títulos, ubicaciones e información resumida sin ningún coste',
      detail: 'Acceso gratuito a búsqueda básica de proyectos y licitaciones',
      color: '#a1db87',
      gradient: 'from-[#a1db87]/20 to-transparent'
    },
    {
      id: 2,
      number: '02',
      icon: <UserPlus className="w-8 h-8" />,
      title: 'Regístrate fácilmente',
      description: 'Crea tu cuenta en menos de 2 minutos y comienza a explorar proyectos avanzados',
      detail: 'Proceso de registro rápido y seguro',
      color: '#8bc96a',
      gradient: 'from-[#8bc96a]/20 to-transparent'
    },
    {
      id: 3,
      number: '03',
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Suscripción Premium',
      description: 'Desbloquea acceso completo a datos detallados, documentación y análisis territorial',
      detail: 'Planes flexibles adaptados a tus necesidades',
      color: '#7fb85d',
      gradient: 'from-[#7fb85d]/20 to-transparent'
    },
    {
      id: 4,
      number: '04',
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Accede sin límites',
      description: 'Disfruta de búsquedas avanzadas, alertas personalizadas y todas las herramientas',
      detail: 'Análisis completo y soporte prioritario',
      color: '#6fa550',
      gradient: 'from-[#6fa550]/20 to-transparent'
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-transparent relative overflow-hidden">
      {/* Decoración de fondo */}

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ 
              type: "spring",
              stiffness: 150,
              damping: 12
            }}
            className="inline-flex items-center px-4 py-2 bg-[#2a2a2a] border border-[#a1db87]/30 rounded-full mb-4"
          >
            <PlayCircle className="w-4 h-4 text-[#a1db87] mr-2" />
            <span className="text-xs sm:text-sm font-semibold text-[#a1db87]">
              Proceso Simple
            </span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Cómo funciona <span className="text-[#a1db87]">nuestra plataforma</span>
          </h2>
          
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Desde la exploración gratuita hasta el acceso completo en 4 pasos
          </p>
        </motion.div>

        {/* Timeline vertical con cards laterales */}
        <div className="relative max-w-4xl mx-auto">
          {/* Línea vertical central */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-[#333333] hidden md:block">
            <motion.div
              className="w-full bg-gradient-to-b from-[#a1db87] to-[#6fa550]"
              initial={{ height: 0 }}
              animate={isInView ? { height: '100%' } : {}}
              transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-12 relative">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  className={`relative grid md:grid-cols-2 gap-8 items-center ${!isLeft ? 'md:flex-row-reverse' : ''}`}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Card del paso */}
                  <motion.div
                    className={`${isLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-2'} relative`}
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Card principal */}
                    <div className="bg-[#1a1a1a] border-2 border-[#a1db87] rounded-2xl p-6 relative overflow-hidden group">
                      {/* Gradiente animado de fondo */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                      {/* Contenido */}
                      <div className="relative z-10">
                        {/* Número flotante */}
                        <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'md:justify-end' : ''}`}>
                          <motion.div
                            className="flex items-center justify-center w-12 h-12 bg-[#a1db87] rounded-xl text-[#1a1a1a] font-black"
                            animate={{
                              rotate: hoveredStep === step.id ? [0, 360] : 0
                            }}
                            transition={{ duration: 0.6 }}
                          >
                            {step.number}
                          </motion.div>
                          <div 
                            className="flex items-center justify-center w-12 h-12 rounded-xl"
                            style={{ backgroundColor: `${step.color}20` }}
                          >
                            <motion.div
                              style={{ color: step.color }}
                              animate={{
                                scale: hoveredStep === step.id ? [1, 1.2, 1] : 1
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              {step.icon}
                            </motion.div>
                          </div>
                        </div>

                        {/* Título */}
                        <h3 className="text-xl font-bold text-white mb-2">
                          {step.title}
                        </h3>

                        {/* Descripción */}
                        <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Detalle */}
                        <div className="flex items-center gap-2 text-xs text-[#a1db87]">
                          <ChevronRight className="w-4 h-4" />
                          <span>{step.detail}</span>
                        </div>
                      </div>

                      {/* Borde animado */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-[#a1db87]"
                        initial={{ width: 0 }}
                        animate={isInView ? { width: '100%' } : {}}
                        transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                      />
                    </div>
                  </motion.div>

                  {/* Punto central en la línea */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                      className="relative"
                    >
                      {/* Círculo exterior pulsante */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: `${step.color}40` }}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      />
                      
                      {/* Círculo principal */}
                      <div 
                        className="w-6 h-6 rounded-full border-4 border-[#2a2a2a] relative z-10"
                        style={{ backgroundColor: step.color }}
                      />
                    </motion.div>
                  </div>

                  {/* Flecha conectora móvil */}
                  <div className="md:hidden flex justify-center">
                    <motion.div
                      animate={{
                        y: [0, 8, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    >
                      <ArrowDown className="w-6 h-6 text-[#a1db87]" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#2a2a2a] border-2 border-[#a1db87] rounded-full">
            <Sparkles className="w-4 h-4 text-[#a1db87]" />
            <span className="text-sm text-gray-300">
              Comienza hoy mismo de forma <span className="text-[#a1db87] font-bold">gratuita</span>
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;