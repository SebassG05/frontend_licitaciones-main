import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, Briefcase, GraduationCap, Users, University, Building, Sparkles } from 'lucide-react';
import Container from '../ui/Container';

const TargetAudienceSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const entities = [
    {
      id: 1,
      icon: <Building2 className="w-6 h-6" />,
      title: 'Administración Pública',
      description: 'Gestión eficiente de licitaciones públicas y contratación territorial con transparencia total',
      stats: '500+ entidades',
      color: '#a1db87'
    },
    {
      id: 2,
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Sector Privado',
      description: 'Acceso a oportunidades de negocio en proyectos territoriales con análisis detallado',
      stats: '3.000+ empresas',
      color: '#8bc96a'
    },
    {
      id: 3,
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Investigación Académica',
      description: 'Datos territoriales para estudios académicos y análisis científico con rigor metodológico',
      stats: '100+ centros',
      color: '#7fb85d'
    }
  ];

  const users = [
    { icon: <Building className="w-5 h-5" />, label: 'Gobiernos Locales', count: '300+' },
    { icon: <University className="w-5 h-5" />, label: 'Universidades', count: '50+' },
    { icon: <Users className="w-5 h-5" />, label: 'Empresas', count: '5.000+' }
  ];

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-transparent relative">
      {/* Patrón de puntos animado */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(161, 219, 135, 0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <Container>
        {/* Header con badge animado */}
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
              damping: 15
            }}
            className="inline-flex items-center px-4 py-2 bg-[#2a2a2a] border border-[#a1db87]/30 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4 text-[#a1db87] mr-2" />
            <span className="text-xs sm:text-sm font-semibold text-[#a1db87]">
              Para Todos los Sectores
            </span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Soluciones adaptadas para <span className="text-[#a1db87]">cada sector</span>
          </h2>
        </motion.div>

        {/* Grid de entidades con efectos diferentes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
          {entities.map((entity, index) => (
            <motion.div
              key={entity.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, rotateY: -20 }}
              animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 80
              }}
              onHoverStart={() => setHoveredCard(entity.id)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ 
                y: -12, 
                scale: 1.03,
                rotateZ: index % 2 === 0 ? 1 : -1
              }}
              className="relative group"
            >
              {/* Card con gradiente animado en hover */}
              <div className="bg-[#2a2a2a] border-2 border-[#a1db87] rounded-2xl p-6 sm:p-8 h-full transition-all duration-300 hover:shadow-lg hover:shadow-[#a1db87]/20 relative overflow-hidden">
                
                {/* Efecto de onda en hover */}
                {hoveredCard === entity.id && (
                  <motion.div
                    className="absolute inset-0 bg-[#a1db87]/10"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}

                {/* Decoración esquina con diferentes rotaciones */}
                <motion.div 
                  className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl"
                  animate={{
                    rotate: hoveredCard === entity.id ? 45 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div 
                    className="absolute top-0 right-0 w-full h-full transform rotate-45 translate-x-10 -translate-y-10"
                    style={{ background: `linear-gradient(135deg, ${entity.color}20, transparent)` }}
                  />
                </motion.div>

                {/* Contenido */}
                <div className="relative z-10">
                  {/* Icono con rotación en hover */}
                  <motion.div 
                    className="inline-flex items-center justify-center w-14 h-14 bg-[#a1db87] rounded-full mb-4 text-[#2a2a2a]"
                    animate={{
                      rotate: hoveredCard === entity.id ? 360 : 0
                    }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    {entity.icon}
                  </motion.div>

                  {/* Título */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-tight">
                    {entity.title}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {entity.description}
                  </p>

                  {/* Badge de estadísticas */}
                  <motion.div
                    className="inline-flex items-center px-3 py-1 bg-[#1a1a1a] border border-[#333333] rounded-full"
                    animate={{
                      scale: hoveredCard === entity.id ? 1.05 : 1
                    }}
                  >
                    <span className="text-xs font-medium text-[#a1db87]">
                      {entity.stats}
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Usuarios objetivo con animación de entrada escalonada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center relative z-10"
        >
          <motion.p 
            className="text-gray-400 mb-6 text-sm sm:text-base"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            Usuarios a los que va dirigida:
          </motion.p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {users.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ 
                  delay: 0.8 + index * 0.15,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  rotate: 5
                }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-5 py-3 bg-[#2a2a2a] border-2 border-[#a1db87] rounded-xl hover:shadow-lg hover:shadow-[#a1db87]/20 transition-all cursor-pointer"
              >
                <motion.div 
                  className="text-[#a1db87]"
                  animate={{
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                >
                  {user.icon}
                </motion.div>
                <div>
                  <div className="text-sm font-bold text-[#a1db87]">
                    {user.count}
                  </div>
                  <span className="text-xs font-medium text-white">
                    {user.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default TargetAudienceSection;