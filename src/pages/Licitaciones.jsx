import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase, Calendar, Euro, Building2, TrendingUp, ArrowRight, FileText, Clock, Award } from 'lucide-react';
import { getLicitaciones, getSources, getLicitacionesStats } from '../services/licitaciones';
import LicitacionCard from '../components/licitaciones/LicitacionCard';
import LicitacionFilters from '../components/licitaciones/LicitacionFilters';
import Container from '../components/ui/Container';
import LicitacionSkeleton from '../components/ui/LicitacionSkeleton';
import PremiumPopup from '../components/ui/PremiumPopup';
import { useAuth } from '../context/AuthContext';

const Licitaciones = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [licitaciones, setLicitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });
  const [sources, setSources] = useState([]);
  const [stats, setStats] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [userInfo, setUserInfo] = useState({ isAuthenticated: false, isPremium: false });
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Función para obtener licitaciones con debouncing
  const fetchLicitaciones = useCallback(async (currentFilters = {}, page = 1, skipLoading = false) => {
    try {
      if (!skipLoading && !authLoading) {
        setLoading(true);
      }
      setError(null);

      const params = {
        ...currentFilters,
        page,
        limit: pagination.itemsPerPage
      };

      const response = await getLicitaciones(params);
      
      if (response.success) {
        setLicitaciones(response.data.licitaciones || []);
        setPagination({
          currentPage: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          totalItems: response.data.pagination?.totalItems || 0,
          itemsPerPage: response.data.pagination?.itemsPerPage || 20
        });
        
        // Capturar información del usuario del backend
        if (response.data.user) {
          setUserInfo(response.data.user);
        }
      } else {
        throw new Error(response.message || 'Error al cargar las licitaciones');
      }
    } catch (err) {
      console.error('Error fetching licitaciones:', err);
      setError(err.message || 'Error al cargar las licitaciones');
      setLicitaciones([]);
    } finally {
      if (!authLoading) {
        setLoading(false);
        if (initialLoad) {
          setInitialLoad(false);
        }
      }
    }
  }, [pagination.itemsPerPage, authLoading, initialLoad]);

  // Función para obtener fuentes disponibles
  const fetchSources = useCallback(async () => {
    try {
      const response = await getSources();
      if (response.success) {
        setSources(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching sources:', err);
    }
  }, []);

  // Función para obtener estadísticas
  const fetchStats = useCallback(async () => {
    try {
      const response = await getLicitacionesStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Efecto para cargar datos iniciales - esperar a que el auth esté listo
  useEffect(() => {
    if (!authLoading) {
      const loadInitialData = async () => {
        await Promise.all([
          fetchLicitaciones(),
          fetchSources(),
          fetchStats()
        ]);
      };
      loadInitialData();
    }
  }, [authLoading, fetchLicitaciones, fetchSources, fetchStats]);

  // Manejar cambios en filtros
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    fetchLicitaciones(newFilters, 1);
  }, [fetchLicitaciones]);

  // Manejar cambio de página
  const handlePageChange = (newPage) => {
    fetchLicitaciones(filters, newPage);
  };

  // Componente de paginación modernizado
  const Pagination = () => {
    if (pagination.totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxPages = isMobile ? 3 : 5;
      const half = Math.floor(maxPages / 2);
      
      let start = Math.max(1, pagination.currentPage - half);
      let end = Math.min(pagination.totalPages, start + maxPages - 1);
      
      if (end - start < maxPages - 1) {
        start = Math.max(1, end - maxPages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col items-center justify-center mt-12 lg:mt-16 gap-4"
      >
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`
              px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all duration-300
              ${pagination.currentPage === 1
                ? 'text-gray-600 bg-gray-800/50 border-gray-700 cursor-not-allowed opacity-50'
                : 'text-gray-300 bg-[#1a1a1a] border-[#2a2a2a] hover:text-white hover:bg-[#252525] hover:border-[#333333]'
              }
            `}
          >
            Anterior
          </motion.button>
          
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(page)}
                className={`
                  w-10 h-10 text-sm font-bold rounded-xl border-2 transition-all duration-300
                  ${page === pagination.currentPage
                    ? 'text-[#1a1a1a] bg-[#a1db87] border-[#a1db87] shadow-lg shadow-[#a1db87]/25'
                    : 'text-gray-300 bg-[#1a1a1a] border-[#2a2a2a] hover:text-white hover:bg-[#252525] hover:border-[#333333]'
                  }
                `}
              >
                {page}
              </motion.button>
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`
              px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all duration-300
              ${pagination.currentPage === pagination.totalPages
                ? 'text-gray-600 bg-gray-800/50 border-gray-700 cursor-not-allowed opacity-50'
                : 'text-gray-300 bg-[#1a1a1a] border-[#2a2a2a] hover:text-white hover:bg-[#252525] hover:border-[#333333]'
              }
            `}
          >
            Siguiente
          </motion.button>
        </div>
        
        {/* Información de resultados centrada debajo */}
        <div className="text-sm text-gray-400 text-center">
          Mostrando{' '}
          <span className="text-[#a1db87] font-semibold">
            {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}
          </span>
          {' '}-{' '}
          <span className="text-[#a1db87] font-semibold">
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
          </span>
          {' '}de{' '}
          <span className="text-[#a1db87] font-semibold">
            {pagination.totalItems}
          </span>
          {' '}licitaciones
        </div>
      </motion.div>
    );
  };

  // Componente de estadísticas modernizado
  const StatsSection = () => {
    if (!stats) return null;

    const statsData = [
      {
        icon: FileText,
        title: 'Total Licitaciones',
        value: stats.total || 0,
        color: 'text-[#a1db87]',
        bgColor: 'bg-[#a1db87]/10',
        borderColor: 'border-[#a1db87]/20'
      },
      {
        icon: TrendingUp,
        title: 'Abiertas',
        value: stats.open || 0,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-400/10',
        borderColor: 'border-emerald-400/20'
      },
      {
        icon: Building2,
        title: 'Fuentes',
        value: stats.sources || 0,
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        borderColor: 'border-blue-400/20'
      },
      {
        icon: Clock,
        title: 'Esta semana',
        value: stats.thisWeek || 0,
        color: 'text-amber-400',
        bgColor: 'bg-amber-400/10',
        borderColor: 'border-amber-400/20'
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12"
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`
              relative bg-[#1a1a1a] border ${stat.borderColor} rounded-2xl p-6
              backdrop-blur-sm shadow-2xl overflow-hidden group
              hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.5),0_10px_10px_-5px_rgba(0,0,0,0.2)]
              transition-all duration-300
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className={`
                  inline-flex items-center justify-center w-12 h-12 rounded-xl
                  ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300
                `}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
              </div>
            </div>
            <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/Corporatives/Images/BG/Background_1.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a]/90 via-[#1a1a1a]/80 to-[#0a0a0a]/90" />
      </div>

      <Container>
        <div className="relative z-10 py-8 lg:py-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#a1db87]/10 border border-[#a1db87]/20 rounded-full mb-6"
            >
              <Award className="w-5 h-5 text-[#a1db87]" />
              <span className="text-[#a1db87] text-sm font-medium">Plataforma de Licitaciones</span>
            </motion.div>
            
            <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-tight">
              <span className="block">Explora</span>
              <span className="block text-[#a1db87]">Licitaciones</span>
            </h1>
            
            <p className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Descubre y gestiona todas las oportunidades de licitación disponibles en nuestra plataforma. 
              Filtra por fuente, estado y más para encontrar las oportunidades perfectas.
            </p>
          </motion.div>

          {/* Estadísticas */}
          <StatsSection />

          {/* Filtros modernizados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 lg:mb-12"
          >
            <LicitacionFilters 
              onFiltersChange={handleFiltersChange}
              sources={sources}
            />
          </motion.div>

          {/* Contenido principal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 mb-8 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-red-400 font-semibold mb-2">Error de conexión</h3>
                    <p className="text-red-300 text-sm leading-relaxed">
                      {error}
                    </p>
                    <p className="text-red-300/70 text-xs mt-2">
                      Verifica que el backend esté ejecutándose en http://localhost:3000
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {(loading || authLoading) && initialLoad ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 lg:space-y-8"
              >
                {/* Mostrar skeletons mientras carga */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <LicitacionSkeleton key={i} />
                ))}
              </motion.div>
            ) : licitaciones.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 lg:py-24"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No hay licitaciones disponibles</h3>
                <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                  No se encontraron licitaciones que coincidan con los filtros seleccionados. 
                  Intenta ajustar los criterios de búsqueda.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Grid de licitaciones - una sola columna para diseño rectangular */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="space-y-6 lg:space-y-8"
                >
                  {(() => {
                    // Si no hay ningún filtro activo, mezclar las tarjetas
                    const noFilters = !filters.search && !filters.source && !filters.status && !filters.deadline && !filters.minBudget && !filters.keywords;
                    let licitacionesToShow = licitaciones;
                    if (noFilters) {
                      // Mezclar aleatoriamente las tarjetas
                      licitacionesToShow = [...licitaciones].sort(() => Math.random() - 0.5);
                    }
                    return licitacionesToShow.map((licitacion, index) => (
                      <motion.div
                        key={licitacion._id || licitacion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: Math.min(0.05 * index, 0.3) // Límite máximo de delay
                        }}
                      >
                        <LicitacionCard 
                          licitacion={licitacion}
                          isUserAuthenticated={isAuthenticated || userInfo.isAuthenticated}
                          onShowPremiumPopup={() => setShowPremiumPopup(true)}
                        />
                      </motion.div>
                    ));
                  })()}
                </motion.div>

                {/* Paginación modernizada */}
                <Pagination />
              </>
            )}
          </motion.div>
        </div>
      </Container>

      {/* Premium Popup fuera del contenedor */}
      <PremiumPopup 
        isOpen={showPremiumPopup} 
        onClose={() => setShowPremiumPopup(false)}
        onLoginClick={() => {
          // Disparar evento para que el header abra el dropdown de login
          window.dispatchEvent(new CustomEvent('openLogin'));
        }}
      />
    </motion.div>
  );
};

export default Licitaciones;