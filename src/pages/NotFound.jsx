import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Home, ArrowLeft, Search, FileText, Mail, AlertTriangle, Compass } from 'lucide-react';
import Container from '../components/ui/Container';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [isMobile, setIsMobile] = useState(false);
  
  // Verificar si estamos en la ruta de agente-vigilancia
  const isAgenteVigilancia = location.pathname.includes('agente-vigilancia');

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const suggestedLinks = [
    {
      path: '/',
      title: 'Inicio',
      description: 'Volver a la página principal',
      icon: <Home className="w-5 h-5" />,
      color: '#a1db87'
    },
    {
      path: '/servicios',
      title: 'Servicios',
      description: 'Planes y suscripciones',
      icon: <FileText className="w-5 h-5" />,
      color: '#8bc96a'
    },
    {
      path: '/contacto',
      title: 'Contacto',
      description: 'Habla con nuestro equipo',
      icon: <Mail className="w-5 h-5" />,
      color: '#7fb85d'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Decoraciones de fondo */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#a1db87]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#a1db87]/5 rounded-full blur-3xl" />

      <Container>
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Contenedor principal en dos columnas */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Columna izquierda: Error y mensaje */}
            <div className="text-center lg:text-left">
              {/* Icono */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  delay: 0.2
                }}
                className="inline-flex items-center justify-center w-20 h-20 bg-[#2a2a2a] border-2 border-[#a1db87] rounded-full mb-6"
              >
                {isAgenteVigilancia ? (
                  <Compass className="w-10 h-10 text-[#a1db87]" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-[#a1db87]" />
                )}
              </motion.div>

              {/* Código o mensaje principal */}
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 }}
                className={`font-black text-[#a1db87] mb-4 leading-tight ${
                  isAgenteVigilancia 
                    ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl' 
                    : 'text-6xl md:text-7xl lg:text-8xl'
                }`}
              >
                {isAgenteVigilancia ? 'Próximamente' : '404'}
              </motion.h1>

              {/* Título */}
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-white mb-4"
              >
                {isAgenteVigilancia ? 'Estamos trabajando en ello' : 'Página no encontrada'}
              </motion.h2>

              {/* Descripción */}
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="text-base text-gray-300 mb-6"
              >
                {isAgenteVigilancia 
                  ? 'Nuestro equipo está desarrollando esta funcionalidad. ¡Mantente atento para las novedades!'
                  : 'La página que buscas no existe o ha sido movida'
                }
              </motion.p>

              {/* Ruta actual */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="inline-block mb-6 px-4 py-2 bg-[#1a1a1a] border border-[#a1db87]/30 rounded-lg"
              >
                <p className="text-xs text-gray-400">
                  Ruta: <span className="text-[#a1db87] font-mono text-sm">{location.pathname}</span>
                </p>
              </motion.div>

              {/* Botones de acción */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              >
                <motion.button
                  onClick={handleGoHome}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#a1db87] text-[#1a1a1a] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Volver al inicio
                </motion.button>

                <motion.button
                  onClick={handleGoBack}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-[#a1db87] text-[#a1db87] font-bold rounded-xl hover:bg-[#a1db87]/10 transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver atrás
                </motion.button>
              </motion.div>
            </div>

            {/* Columna derecha: Enlaces sugeridos */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="bg-[#2a2a2a] border-2 border-[#a1db87] rounded-2xl p-6 lg:p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Compass className="w-5 h-5 text-[#a1db87] mr-2" />
                {isAgenteVigilancia ? '¡Mientras tanto, explora!' : '¿Qué estás buscando?'}
              </h3>

              <div className="space-y-3">
                {suggestedLinks.map((link, index) => (
                  <motion.button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-4 p-4 bg-[#1a1a1a] border border-[#444444] rounded-xl hover:border-[#a1db87] hover:bg-[#1a1a1a]/80 transition-all group"
                  >
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${link.color}20`, color: link.color }}
                    >
                      {link.icon}
                    </div>

                    <div className="flex-grow text-left">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#a1db87] transition-colors">
                        {link.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {link.description}
                      </p>
                    </div>

                    <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-[#a1db87] transform rotate-180 transition-colors" />
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-[#444444]">
                {isAgenteVigilancia ? (
                  <div className="text-center">
                    <p className="text-sm text-[#a1db87] font-medium mb-2">
                      🚀 Agente de Vigilancia
                    </p>
                    <p className="text-xs text-gray-400">
                      Esta funcionalidad estará disponible muy pronto. <br/>
                      <a href="/contacto" className="text-[#a1db87] hover:underline">Contáctanos</a> si tienes alguna consulta
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center">
                    ¿No encuentras lo que buscas? <a href="/contacto" className="text-[#a1db87] hover:underline">Contáctanos</a>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default NotFound;