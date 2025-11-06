import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Briefcase, ChevronDown, ChevronLeft, ChevronRight,
  Calendar, Euro, TrendingUp, Building2, Clock, ArrowRight, Sparkles, ArrowUpRight
} from 'lucide-react';
import Container from '../ui/Container';

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [direction, setDirection] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerritory, setSelectedTerritory] = useState('Toda España');
  const [selectedSector, setSelectedSector] = useState('Todos los sectores');
  const [showTerritoryDropdown, setShowTerritoryDropdown] = useState(false);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [imageStates, setImageStates] = useState({});
  const imageCache = useRef(new Map());

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Licitaciones destacadas para el carrusel
  const featuredTenders = [
    {
      id: 1,
      title: 'Servicios de consultoría para proyectos de infraestructura sostenible',
      entity: 'Ministerio de Transición Ecológica',
      location: 'Madrid',
      sector: 'Consultoría',
      budget: '2.500.000',
      deadline: '2025-02-15',
      code: 'LIC-2025-001',
      status: 'Abierta',
      daysLeft: 45,
      badge: 'Destacada',
      subtitle: 'Licitación Pública',
      color: '#a1db87',
      backgroundImage: '/Corporatives/Images/BG/Background_1.jpg'
    },
    {
      id: 2,
      title: 'Suministro e instalación de sistemas de energía renovable',
      entity: 'Junta de Andalucía',
      location: 'Sevilla',
      sector: 'Energía',
      budget: '5.800.000',
      deadline: '2025-02-20',
      code: 'LIC-2025-002',
      status: 'Urgente',
      daysLeft: 30,
      badge: 'Urgente',
      subtitle: 'Plazo Corto',
      color: '#8bc96a',
      backgroundImage: '/Corporatives/Images/BG/Background_2.jpg'
    },
    {
      id: 3,
      title: 'Construcción de centro educativo con criterios de eficiencia energética',
      entity: 'Generalitat de Catalunya',
      location: 'Barcelona',
      sector: 'Construcción',
      budget: '8.200.000',
      deadline: '2025-03-01',
      code: 'LIC-2025-003',
      status: 'Nueva',
      daysLeft: 50,
      badge: 'Nueva',
      subtitle: 'Recién Publicada',
      color: '#7fb85d',
      backgroundImage: '/Corporatives/Images/BG/Background_3.jpg'
    }
  ];

  const territories = [
    'Toda España', 'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
    'Cantabria', 'Castilla y León', 'Castilla-La Mancha', 'Cataluña',
    'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid', 'Murcia',
    'Navarra', 'País Vasco', 'La Rioja'
  ];

  const sectors = [
    'Todos los sectores', 'Construcción', 'Servicios', 'Suministros',
    'Consultoría', 'Tecnología', 'Salud', 'Educación', 'Medio Ambiente',
    'Transporte', 'Energía'
  ];

  // Carga de imágenes lazy
  useEffect(() => {
    const loadImageLazy = (slideIndex) => {
      const slide = featuredTenders[slideIndex];
      if (imageCache.current.has(slideIndex) || imageStates[slideIndex]) return;

      const img = new Image();
      img.onload = () => {
        imageCache.current.set(slideIndex, img.src);
        setImageStates(prev => ({ ...prev, [slideIndex]: 'loaded' }));
      };
      img.onerror = () => {
        setImageStates(prev => ({ ...prev, [slideIndex]: 'error' }));
      };

      setImageStates(prev => ({ ...prev, [slideIndex]: 'loading' }));
      img.src = slide.backgroundImage;
    };

    loadImageLazy(activeSlide);
    const nextIndex = (activeSlide + 1) % featuredTenders.length;
    const preloadTimer = setTimeout(() => loadImageLazy(nextIndex), 100);

    return () => clearTimeout(preloadTimer);
  }, [activeSlide, featuredTenders]);

  // Navegación del carrusel
  const nextSlide = useCallback(() => {
    setDirection(1);
    setActiveSlide((prev) => (prev + 1) % featuredTenders.length);
  }, [featuredTenders.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setActiveSlide((prev) => (prev - 1 + featuredTenders.length) % featuredTenders.length);
  }, [featuredTenders.length]);

  const goToSlide = useCallback((index) => {
    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
  }, [activeSlide]);

  // Auto-play del carrusel
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovering]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Búsqueda:', { searchTerm, selectedTerritory, selectedSector });
  };

  // Variantes de animación
  const slideVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: isMobile ? 5 : 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * (isMobile ? 0.02 : 0.03),
        duration: isMobile ? 0.15 : 0.2,
        ease: "easeOut"
      }
    }),
  };

  const currentTender = featuredTenders[activeSlide];

  // Renderizado de fondo
  const renderBackground = (slide, slideIndex) => {
    const imageState = imageStates[slideIndex];
    const hasImage = imageState === 'loaded' && imageCache.current.has(slideIndex);

    return (
      <div className="absolute inset-0">
        {hasImage ? (
          <motion.img
            src={imageCache.current.get(slideIndex)}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]"></div>
        )}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
    );
  };

  return (
    <section className="relative pt-16 sm:pt-20 pb-8 sm:pb-12 overflow-hidden">
      <Container>
        {/* Badge superior centrado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#2a2a2a] border border-[#a1db87]/30 rounded-full">
            <TrendingUp className="w-4 h-4 text-[#a1db87]" />
            <span className="text-xs sm:text-sm font-semibold text-[#a1db87]">
              Licitaciones Destacadas
            </span>
          </div>
        </motion.div>

        {/* Layout de 2 columnas: Carrusel + Buscador */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA - CARRUSEL (8 columnas) - ESTILO EVENORTECH */}
          <div 
            className="lg:col-span-8 relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              className="relative min-h-[350px] xs:min-h-[400px] sm:min-h-[450px] overflow-hidden rounded-xl sm:rounded-2xl shadow-xl border border-[#444]"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeSlide}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ opacity: { duration: 0.1 } }}
                  className="absolute inset-0"
                >
                  {/* Fondo con imagen */}
                  {renderBackground(currentTender, activeSlide)}

                  <div className="h-full flex items-center justify-start relative z-10 p-4 xs:p-5 sm:p-6 md:p-8">
                    {/* Formas decorativas - solo desktop */}
                    {!isMobile && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                        <div className="absolute top-20 right-20 w-24 sm:w-32 md:w-48 h-24 sm:h-32 md:h-48 rounded-full border border-[#a1db87]/20" />
                        <div className="absolute bottom-20 left-1/3 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 rounded-full border border-[#a1db87]/15" />
                        <div className="absolute top-1/3 left-20 w-6 sm:w-8 md:w-12 h-6 sm:h-8 md:h-12 rounded-md border border-[#a1db87]/25 rotate-45" />
                      </div>
                    )}

                    {/* Contenedor con fondo para el texto */}
                    <div className="relative z-10 w-full max-w-xs xs:max-w-sm sm:max-w-md bg-black/50 backdrop-blur-sm p-4 xs:p-5 sm:p-6 rounded-xl sm:rounded-2xl">
                      {/* Badge de estado */}
                      <motion.span
                        className={`inline-flex items-center px-2.5 sm:px-3 py-1 mb-3 text-xs sm:text-sm font-semibold tracking-wider rounded-full shadow-md ${
                          currentTender.status === 'Urgente' 
                            ? 'bg-red-500 text-white'
                            : currentTender.status === 'Nueva'
                            ? 'bg-blue-500 text-white'
                            : 'bg-[#a1db87] text-[#333333]'
                        }`}
                        custom={0}
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {currentTender.subtitle}
                      </motion.span>

                      {/* Código */}
                      <motion.p
                        className="text-xs text-gray-300 mb-2"
                        custom={1}
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {currentTender.code}
                      </motion.p>

                      {/* Título */}
                      <motion.h1
                        className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-white leading-tight"
                        custom={2}
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {currentTender.title}
                        <span className="block h-1 w-12 xs:w-16 sm:w-20 bg-[#a1db87] mt-2 rounded-full" />
                      </motion.h1>

                      {/* Info rápida en grid */}
                      <motion.div
                        className="grid grid-cols-2 gap-2 mb-4"
                        custom={3}
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="flex items-center space-x-2 text-xs text-gray-200">
                          <MapPin className="w-3 h-3 text-[#a1db87]" />
                          <span>{currentTender.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-200">
                          <Euro className="w-3 h-3 text-[#a1db87]" />
                          <span>{currentTender.budget}€</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-200">
                          <Clock className="w-3 h-3 text-[#a1db87]" />
                          <span>{currentTender.daysLeft} días</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-200">
                          <Building2 className="w-3 h-3 text-[#a1db87]" />
                          <span className="truncate">{currentTender.entity}</span>
                        </div>
                      </motion.div>

                      {/* Botones de acción */}
                      <motion.div
                        custom={4}
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col xs:flex-row gap-2 xs:gap-3"
                      >
                        <Link
                          to={`/licitacion/${currentTender.code}`}
                          className="inline-flex items-center justify-center px-4 xs:px-5 py-2.5 bg-[#a1db87] text-[#333333] rounded-lg font-medium shadow-lg hover:shadow-xl transition-all group text-xs sm:text-sm"
                        >
                          Ver detalles
                          <motion.span
                            className="ml-2 p-0.5 xs:p-1 rounded-full bg-white"
                            whileHover={{ x: 3 }}
                          >
                            <ArrowUpRight size={12} className="xs:w-3 sm:w-4 xs:h-3 sm:h-4" />
                          </motion.span>
                        </Link>

                        <button className="inline-flex items-center justify-center px-4 xs:px-5 py-2.5 border border-[#a1db87] text-[#a1db87] hover:bg-[#a1db87]/10 rounded-lg font-medium transition-all text-xs sm:text-sm">
                          Guardar
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Indicador de carga */}
              {imageStates[activeSlide] === 'loading' && (
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#a1db87]/60 rounded-full animate-pulse" />
                </div>
              )}

              {/* Controles de navegación */}
              <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-[#a1db87]/90 shadow-md hover:bg-[#a1db87] text-[#333333] transition-all duration-200 hover:scale-105"
                aria-label="Slide anterior"
              >
                <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-[#a1db87]/90 shadow-md hover:bg-[#a1db87] text-[#333333] transition-all duration-200 hover:scale-105"
                aria-label="Siguiente slide"
              >
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
              </button>

              {/* Indicadores */}
              <div className="absolute left-0 right-0 bottom-3 sm:bottom-4 flex justify-center z-20 gap-1.5 xs:gap-2">
                {featuredTenders.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 xs:w-2.5 sm:w-3 h-2 xs:h-2.5 sm:h-3 rounded-full transition-all duration-200 ${
                      index === activeSlide
                        ? 'bg-[#a1db87] scale-110'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Ir al slide ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Decoraciones externas - solo desktop */}
            {!isMobile && (
              <>
                <div className="absolute -bottom-4 sm:-bottom-8 -right-4 sm:-right-8 w-10 sm:w-14 md:w-16 h-10 sm:h-14 md:h-16 rounded-xl bg-[#a1db87]/20 rotate-12" />
                <div className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 w-5 sm:w-8 h-5 sm:h-8 rounded-lg border border-[#a1db87] -rotate-12" />
              </>
            )}
          </div>

          {/* COLUMNA DERECHA - BUSCADOR (4 columnas) - CON OVERFLOW ARREGLADO */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="sticky top-24">
              <form onSubmit={handleSearch} className="bg-[#2a2a2a]/80 backdrop-blur-xl p-6 rounded-2xl border-2 border-[#333333] shadow-2xl space-y-4">
                {/* Header del buscador */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-[#a1db87]" />
                    <h3 className="text-lg font-bold text-white">Buscar</h3>
                  </div>
                  <span className="text-xs text-gray-400">15.000+ proyectos</span>
                </div>

                {/* Campo de búsqueda */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Palabra clave, título..."
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border-2 border-[#333333] rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#a1db87] focus:ring-2 focus:ring-[#a1db87]/20 transition-all"
                  />
                </div>

                {/* Selector de territorio */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTerritoryDropdown(!showTerritoryDropdown);
                      setShowSectorDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-3 bg-[#1a1a1a] border-2 border-[#333333] rounded-xl text-white hover:border-[#444444] focus:outline-none focus:border-[#a1db87] transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium truncate">{selectedTerritory}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${showTerritoryDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showTerritoryDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a2a] border-2 border-[#333333] rounded-xl shadow-2xl max-h-60 overflow-y-auto z-[100] custom-scrollbar"
                      >
                        {territories.map((territory) => (
                          <button
                            key={territory}
                            type="button"
                            onClick={() => {
                              setSelectedTerritory(territory);
                              setShowTerritoryDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#333333] transition-colors ${
                              selectedTerritory === territory ? 'bg-[#a1db87]/10 text-[#a1db87] font-semibold' : 'text-white'
                            }`}
                          >
                            {territory}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Selector de sector - CON Z-INDEX ARREGLADO */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSectorDropdown(!showSectorDropdown);
                      setShowTerritoryDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-3 bg-[#1a1a1a] border-2 border-[#333333] rounded-xl text-white hover:border-[#444444] focus:outline-none focus:border-[#a1db87] transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium truncate">{selectedSector}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${showSectorDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showSectorDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a2a] border-2 border-[#333333] rounded-xl max-h-60 overflow-y-auto z-[100] custom-scrollbar"
                      >
                        {sectors.map((sector) => (
                          <button
                            key={sector}
                            type="button"
                            onClick={() => {
                              setSelectedSector(sector);
                              setShowSectorDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#333333] transition-colors ${
                              selectedSector === sector ? 'bg-[#a1db87]/10 text-[#a1db87] font-semibold' : 'text-white'
                            }`}
                          >
                            {sector}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Botón de búsqueda */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-[#a1db87] to-[#8bc96a] text-[#1a1a1a] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Buscar</span>
                </motion.button>

                {/* Info adicional */}
                <div className="pt-3 border-t border-[#333333]">
                  <p className="text-xs text-gray-500 text-center">
                    ✓ Registro gratuito · ✓ Acceso básico sin coste
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;