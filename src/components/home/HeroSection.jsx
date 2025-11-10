import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLicitacionesStats } from '../../services/licitaciones';
import { 
  Search, MapPin, Briefcase, ChevronDown, 
  Calendar, Euro, TrendingUp, Building2, Clock, ArrowRight, Sparkles, 
  Award, FileText
} from 'lucide-react';
import Container from '../ui/Container';

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerritory, setSelectedTerritory] = useState('Toda España');
  const [selectedSector, setSelectedSector] = useState('Todos los sectores');
  const [showTerritoryDropdown, setShowTerritoryDropdown] = useState(false);
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getLicitacionesStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        // Usar datos por defecto en caso de error
        setStats({
          total: 15000,
          breakdown: {
            bancoMundial: 2500,
            comisionEuropea: 8100,
            nacionesUnidas: 1800,
            contratacionEstadoEspana: 2600
          }
        });
      }
    };

    fetchStats();
  }, []);

  const territories = [
    'Toda España', 'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias',
    'Cantabria', 'Castilla y León', 'Castilla-La Mancha', 'Cataluña',
    'Comunidad Valenciana', 'Extremadura', 'Galicia', 'Madrid', 'Murcia',
    'Navarra', 'País Vasco', 'La Rioja'
  ];

  const sectors = [
    'Todos los sectores', 'Tecnología', 'Software', 'Programación', 'Desarrollo Web',
    'Inteligencia Artificial', 'Medioambiental', 'Biológico', 'Biotecnología', 'Sistemas de Información',
    'Big Data'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Búsqueda:', { searchTerm, selectedTerritory, selectedSector });
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

        {/* Layout de 2 columnas: Showcase de Fuentes + Buscador */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMNA IZQUIERDA - SHOWCASE DE FUENTES DE DATOS (8 columnas) */}
          <div className="lg:col-span-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-[#333333] shadow-2xl"
            >
              {/* Header del showcase */}
              <div className="text-center mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl sm:text-3xl font-bold text-white mb-3"
                >
                  Fuentes Institucionales
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-gray-400 text-sm sm:text-base"
                >
                  Acceso centralizado a las principales instituciones de licitaciones públicas
                </motion.p>
              </div>

              {/* Grid de fuentes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Banco Mundial */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`group bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 sm:p-6 hover:border-blue-400/40 transition-all duration-300 ${!stats ? 'animate-pulse' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm sm:text-base">Banco Mundial</h3>
                        <p className="text-xs text-gray-400">World Bank Group</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Activa</span>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed">
                    Proyectos de desarrollo e infraestructura a nivel internacional
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-semibold text-sm">
                      {stats?.breakdown?.bancoMundial ? `${stats.breakdown.bancoMundial.toLocaleString()}+ proyectos` : 'Cargando...'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>

                {/* Comisión Europea */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`group bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4 sm:p-6 hover:border-amber-400/40 transition-all duration-300 ${!stats ? 'animate-pulse' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <Euro className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm sm:text-base">Comisión Europea</h3>
                        <p className="text-xs text-gray-400">European Commission</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full">Activa</span>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed">
                    Contratos públicos y programas de la Unión Europea
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-semibold text-sm">
                      {stats?.breakdown?.comisionEuropea ? `${stats.breakdown.comisionEuropea.toLocaleString()}+ contratos` : 'Cargando...'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>

                {/* Naciones Unidas */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`group bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-4 sm:p-6 hover:border-emerald-400/40 transition-all duration-300 ${!stats ? 'animate-pulse' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm sm:text-base">Naciones Unidas</h3>
                        <p className="text-xs text-gray-400">United Nations</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full">Activa</span>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed">
                    Oportunidades de cooperación internacional y ayuda humanitaria
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-semibold text-sm">
                      {stats?.breakdown?.nacionesUnidas ? `${stats.breakdown.nacionesUnidas.toLocaleString()}+ anuncios` : 'Cargando...'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>

                {/* Contratación del Estado España */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`group bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4 sm:p-6 hover:border-orange-400/40 transition-all duration-300 ${!stats ? 'animate-pulse' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm sm:text-base">Contratación del Estado</h3>
                        <p className="text-xs text-gray-400">España</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">Activa</span>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed">
                    Licitaciones públicas del sector público español
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-400 font-semibold text-sm">
                      {stats?.breakdown?.contratacionEstadoEspana ? `${stats.breakdown.contratacionEstadoEspana.toLocaleString()}+ licitaciones` : 'Cargando...'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </div>

              {/* Footer con información adicional */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 pt-6 border-t border-[#333333] text-center"
              >
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-[#a1db87]" />
                    <span>Actualización diaria</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#a1db87]" />
                    <span>Acceso 24/7</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#a1db87]" />
                    <span>Datos verificados</span>
                  </div>
                </div>
              </motion.div>
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
                  <span className="text-xs text-gray-400">
                    {stats?.total ? `${stats.total.toLocaleString()}+ proyectos` : '15.000+ proyectos'}
                  </span>
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