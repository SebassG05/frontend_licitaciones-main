import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  Check, 
  X, 
  Crown, 
  Sparkles, 
  Building2, 
  Briefcase, 
  GraduationCap,
  ArrowRight,
  Star,
  Zap,
  Mail
} from 'lucide-react';
import Container from '../components/ui/Container';

const Services = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const plansRef = useRef(null);
  const ctaRef = useRef(null);
  const targetRef = useRef(null);
  
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const plansInView = useInView(plansRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });
  const targetInView = useInView(targetRef, { once: true, margin: "-100px" });
  
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const plans = [
    {
      id: 'free',
      name: 'Acceso Gratuito',
      subtitle: 'Explora información básica de proyectos',
      price: '0€',
      period: 'siempre',
      isPremium: false,
      features: [
        { text: 'Búsqueda básica de proyectos', included: true },
        { text: 'Vista limitada del título', included: true },
        { text: 'Información limitada', included: true },
        { text: 'Acceso a documentación', included: false },
        { text: 'Alertas personalizadas', included: false },
        { text: 'Exportación de datos', included: false }
      ],
      color: '#6fa550'
    },
    {
      id: 'premium',
      name: 'Suscripción Premium',
      subtitle: 'Acceso completo a toda la información',
      price: 'Consultar',
      period: 'precio',
      isPremium: true,
      recommended: true,
      features: [
        { text: 'Búsqueda avanzada sin límites', included: true },
        { text: 'Información completa de proyectos', included: true },
        { text: 'Presupuestos y datos detallados', included: true },
        { text: 'Descarga de documentación', included: true },
        { text: 'Visor de mapa interactivo', included: true },
        { text: 'Alertas en tiempo real', included: true },
        { text: 'Análisis territorial avanzado', included: true },
        { text: 'Exportación de datos', included: true },
        { text: 'Soporte técnico prioritario', included: true }
      ],
      color: '#a1db87'
    }
  ];

  const targetAudience = [
    {
      id: 1,
      icon: <Building2 className="w-6 h-6" />,
      title: 'Administración',
      description: 'Gestión eficiente de licitaciones públicas y contratación territorial',
      color: '#a1db87'
    },
    {
      id: 2,
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Sector Privado',
      description: 'Acceso a oportunidades de negocio en proyectos territoriales',
      color: '#8bc96a'
    },
    {
      id: 3,
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Investigación',
      description: 'Datos territoriales para estudios académicos y análisis científico',
      color: '#7fb85d'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent py-12 sm:py-16 md:py-20">
      {/* Decoraciones de fondo */}
      <div className="absolute top-40 left-10 w-96 h-96 bg-[#a1db87]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-[#a1db87]/5 rounded-full blur-3xl" />

      <Container>
        {/* Header Principal */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-10"
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
            className="inline-flex items-center px-4 py-2 bg-[#2a2a2a] border border-[#a1db87]/30 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#a1db87] mr-2" />
            <span className="text-xs sm:text-sm font-semibold text-[#a1db87]">
              Planes y Tarifas
            </span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Elige el plan que mejor se <span className="text-[#a1db87]">adapte a ti</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
            Comienza gratis y actualiza cuando lo necesites. Sin compromisos, sin sorpresas.
          </p>
        </motion.div>

        {/* Tarjetas de Planes */}
        <div ref={plansRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 relative z-10 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50, rotateY: index === 0 ? -15 : 15 }}
              animate={plansInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 80
              }}
              onHoverStart={() => setHoveredPlan(plan.id)}
              onHoverEnd={() => setHoveredPlan(null)}
              whileHover={{ 
                y: -15, 
                scale: 1.02
              }}
              className="relative group"
            >
              {/* Badge "RECOMENDADO" */}
              {plan.recommended && (
                <motion.div
                  initial={{ scale: 0, y: -20 }}
                  animate={plansInView ? { scale: 1, y: 0 } : {}}
                  transition={{ 
                    type: "spring",
                    delay: 0.5
                  }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                >
                  <div className="flex items-center space-x-1 px-4 py-2 bg-[#a1db87] rounded-full shadow-lg">
                    <Star className="w-4 h-4 text-[#1a1a1a]" />
                    <span className="text-xs font-bold text-[#1a1a1a]">RECOMENDADO</span>
                  </div>
                </motion.div>
              )}

              {/* Card */}
              <div 
                className={`bg-[#2a2a2a] rounded-3xl p-8 sm:p-10 h-full transition-all duration-300 relative overflow-hidden ${
                  plan.isPremium 
                    ? 'border-2 border-[#a1db87] shadow-lg shadow-[#a1db87]/20' 
                    : 'border-2 border-[#555555]'
                }`}
              >
                {/* Efecto de brillo animado */}
                {hoveredPlan === plan.id && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `radial-gradient(circle at center, ${plan.color}15, transparent)`
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 2, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                )}

                {/* Decoración esquina */}
                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-3xl">
                  <motion.div
                    className="absolute top-0 right-0 w-full h-full transform rotate-45 translate-x-16 -translate-y-16"
                    style={{ background: `linear-gradient(135deg, ${plan.color}20, transparent)` }}
                    animate={{
                      scale: hoveredPlan === plan.id ? 1.3 : 1
                    }}
                  />
                </div>

                {/* Contenido */}
                <div className="relative z-10">
                  {/* Icono del plan */}
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                      plan.isPremium ? 'bg-[#a1db87]' : 'bg-[#555555]'
                    }`}
                    animate={{
                      y: hoveredPlan === plan.id ? [-3, 0, -3] : 0
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: hoveredPlan === plan.id ? Infinity : 0
                    }}
                  >
                    {plan.isPremium ? (
                      <Crown className="w-8 h-8 text-[#1a1a1a]" />
                    ) : (
                      <Zap className="w-8 h-8 text-[#1a1a1a]" />
                    )}
                  </motion.div>

                  {/* Nombre del plan */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>

                  {/* Subtítulo */}
                  <p className="text-sm text-gray-400 mb-6">
                    {plan.subtitle}
                  </p>

                  {/* Precio */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl sm:text-6xl font-black text-white">
                        {plan.price}
                      </span>
                      <span className="text-lg text-gray-400">
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Separador */}
                  <div className="h-px bg-[#333333] mb-8" />

                  {/* Lista de características */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={plansInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 + index * 0.2 + idx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`flex-shrink-0 mt-0.5 ${
                          feature.included ? 'text-[#a1db87]' : 'text-gray-600'
                        }`}>
                          {feature.included ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <X className="w-5 h-5" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          feature.included ? 'text-gray-200' : 'text-gray-500 line-through'
                        }`}>
                          {feature.text}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botón CTA General */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-20 relative z-10"
        >
          <motion.button
            onClick={() => navigate('/contacto')}
            onHoverStart={() => setIsHoveringCTA(true)}
            onHoverEnd={() => setIsHoveringCTA(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#a1db87] text-[#1a1a1a] font-bold text-lg rounded-xl shadow-2xl overflow-hidden group"
          >
            {/* Efecto de brillo que se mueve */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: '-100%', opacity: 0.3 }}
              animate={isHoveringCTA ? { x: '100%' } : {}}
              transition={{ duration: 0.6 }}
            />
            
            {/* Icono con animación */}
            <motion.div
              className="relative z-10"
              animate={{
                rotate: isHoveringCTA ? [0, -10, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <Mail className="w-6 h-6" />
            </motion.div>

            {/* Texto */}
            <span className="relative z-10">Solicitar Información</span>

            {/* Flecha con movimiento */}
            <motion.div
              className="relative z-10"
              animate={{
                x: isHoveringCTA ? [0, 5, 0] : 0
              }}
              transition={{
                duration: 0.8,
                repeat: isHoveringCTA ? Infinity : 0
              }}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.div>

          </motion.button>

          {/* Texto informativo debajo del botón */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-4 text-sm text-gray-400"
          >
            Nuestro equipo te ayudará a elegir el mejor plan para ti
          </motion.p>
        </motion.div>

        {/* Sección "¿A quién va dirigido?" */}
        <motion.div
          ref={targetRef}
          initial={{ opacity: 0, y: 30 }}
          animate={targetInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          {/* Header de sección */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={targetInView ? { scale: 1 } : {}}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-[#2a2a2a] border border-[#a1db87]/30 rounded-full mb-6"
            >
              <span className="text-xs sm:text-sm font-semibold text-[#a1db87]">
                ¿A quién va dirigido?
              </span>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Soluciones adaptadas para <span className="text-[#a1db87]">cada sector</span>
            </h2>
          </div>

          {/* Grid de sectores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {targetAudience.map((sector, index) => (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, y: 50 }}
                animate={targetInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  delay: 0.3 + index * 0.15,
                  duration: 0.6
                }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="bg-[#2a2a2a] border-2 border-[#a1db87] rounded-2xl p-8 transition-all hover:shadow-lg hover:shadow-[#a1db87]/20 relative overflow-hidden group"
              >
                {/* Decoración esquina */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                  <div 
                    className="absolute top-0 right-0 w-full h-full transform rotate-45 translate-x-10 -translate-y-10"
                    style={{ background: `linear-gradient(135deg, ${sector.color}20, transparent)` }}
                  />
                </div>

                {/* Contenido */}
                <div className="relative z-10">
                  <motion.div
                    className="inline-flex items-center justify-center w-14 h-14 bg-[#a1db87] rounded-full mb-4 text-[#2a2a2a]"
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {sector.icon}
                  </motion.div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {sector.title}
                  </h3>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    {sector.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Services;