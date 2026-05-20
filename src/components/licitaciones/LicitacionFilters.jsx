import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, X } from 'lucide-react';

const LicitacionFilters = ({ onFiltersChange, sources = [] }) => {
  const [filters, setFilters] = useState({
    search: '',
    source: '',
    status: '',
    sortBy: 'deadline',
    sortOrder: 'asc',
    keywords: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      source: '',
      status: '',
      sortBy: 'deadline',
      sortOrder: 'asc',
      keywords: ''
    });
  };

  const sourceLabels = {
    'bancoMundial': 'Banco Mundial',
    'comisionEuropea': 'Comisión Europea',
    'nacionesUnidas': 'Naciones Unidas',
    'contratacionEstadoEspana': 'Contratación del Estado España',
    'cascadeFunding': 'Cascade Funding',
    'juntaAndalucia': 'Junta de Andalucia',
  };

  const statusOptions = [
    { value: 'open', label: 'Abierta' },
    { value: 'closed', label: 'Cerrada' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'cancelled', label: 'Cancelada' },
  ];

  const sortOptions = [
    { value: 'deadline', label: 'Fecha límite' },
    { value: 'publishDate', label: 'Fecha de publicación' },
    { value: 'title', label: 'Título' },
    { value: 'budget', label: 'Presupuesto' },
    { value: 'createdAt', label: 'Fecha de creación' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden"
    >
      <div className="p-6 lg:p-8">
        {/* Barra de búsqueda principal */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500 group-focus-within:text-[#a1db87] transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Buscar licitaciones por título, descripción..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="
                  w-full pl-12 pr-4 py-4 bg-[#2a2a2a] border-2 border-gray-700 rounded-xl
                  text-white placeholder-gray-500 font-medium
                  focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] focus:bg-[#1e1e1e]
                  hover:border-gray-600 hover:bg-[#252525]
                  transition-all duration-300
                "
              />
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              cursor-pointer px-6 py-4 border-2 rounded-xl font-bold transition-all duration-300 
              flex items-center gap-3 whitespace-nowrap min-w-fit
              ${isExpanded 
                ? 'bg-[#a1db87] text-[#1a1a1a] border-[#a1db87] shadow-lg shadow-[#a1db87]/25' 
                : 'bg-[#2a2a2a] text-gray-300 border-gray-700 hover:text-white hover:bg-[#252525] hover:border-gray-600'
              }
            `}
          >
            <Filter className="h-5 w-5" />
            Filtros avanzados
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </motion.button>
        </div>

        {/* Filtros expandidos */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-700 pt-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Filtro por fuente */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Fuente
                  </label>
                  <select
                    value={filters.source}
                    onChange={(e) => handleFilterChange('source', e.target.value)}
                    className="
                      w-full px-4 py-3 bg-[#2a2a2a] border-2 border-gray-700 rounded-xl
                      text-white font-medium
                      focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] focus:bg-[#1e1e1e]
                      hover:border-gray-600 hover:bg-[#252525]
                      transition-all duration-300
                    "
                  >
                    <option value="">Todas las fuentes</option>
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {sourceLabels[source] || source}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por estado */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Estado
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="
                      w-full px-4 py-3 bg-[#2a2a2a] border-2 border-gray-700 rounded-xl
                      text-white font-medium
                      focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] focus:bg-[#1e1e1e]
                      hover:border-gray-600 hover:bg-[#252525]
                      transition-all duration-300
                    "
                  >
                    <option value="">Todos los estados</option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ordenar por */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Ordenar por
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="
                      w-full px-4 py-3 bg-[#2a2a2a] border-2 border-gray-700 rounded-xl
                      text-white font-medium
                      focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] focus:bg-[#1e1e1e]
                      hover:border-gray-600 hover:bg-[#252525]
                      transition-all duration-300
                    "
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Orden */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Orden
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                    className="
                      w-full px-4 py-3 bg-[#2a2a2a] border-2 border-gray-700 rounded-xl
                      text-white font-medium
                      focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] focus:bg-[#1e1e1e]
                      hover:border-gray-600 hover:bg-[#252525]
                      transition-all duration-300
                    "
                  >
                    <option value="asc">Ascendente</option>
                    <option value="desc">Descendente</option>
                  </select>
                </div>

                {/* Filtro por fecha límite */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Fecha límite (desde)
                  </label>
                  <input
                    type="date"
                    value={filters.deadline || ''}
                    onChange={e => handleFilterChange('deadline', e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border-2 border-gray-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] focus:bg-[#1e1e1e] hover:border-gray-600 hover:bg-[#252525] transition-all duration-300"
                  />
                </div>

                {/* Filtro por presupuesto mínimo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Presupuesto mínimo
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={filters.minBudget || ''}
                    onChange={e => handleFilterChange('minBudget', e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border-2 border-gray-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] focus:bg-[#1e1e1e] hover:border-gray-600 hover:bg-[#252525] transition-all duration-300"
                  />
                </div>
              </div>

              {/* Filtro por Keywords */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Palabras clave
                </label>
                <input
                  type="text"
                  placeholder="Ej: tecnología, salud, construcción..."
                  value={filters.keywords || ''}
                  onChange={e => handleFilterChange('keywords', e.target.value)}
                  className="
                    w-full px-4 py-3 bg-[#2a2a2a] border-2 border-gray-700 rounded-xl
                    text-white font-medium placeholder-gray-500
                    focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] focus:bg-[#1e1e1e]
                    hover:border-gray-600 hover:bg-[#252525]
                    transition-all duration-300
                  "
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separa múltiples palabras con comas para buscar cualquiera de ellas
                </p>
              </div>

              {/* Botón de reset */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="
                    cursor-pointer px-6 py-3 text-sm font-semibold text-gray-400 
                    border-2 border-gray-700 rounded-xl
                    hover:text-white hover:bg-[#252525] hover:border-gray-600
                    transition-all duration-300
                  "
                >
                  Limpiar filtros
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicadores de filtros activos */}
        {(filters.search || filters.source || filters.status || filters.keywords) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-700"
          >
            {filters.search && (
              <motion.span
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-[#a1db87]/10 text-[#a1db87] border border-[#a1db87]/20"
              >
                Búsqueda: {filters.search}
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-2 text-[#a1db87] hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.span>
            )}
            
            {filters.source && (
              <motion.span
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-blue-400/10 text-blue-400 border border-blue-400/20"
              >
                Fuente: {sourceLabels[filters.source] || filters.source}
                <button
                  onClick={() => handleFilterChange('source', '')}
                  className="ml-2 text-blue-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.span>
            )}
            
            {filters.status && (
              <motion.span
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
              >
                Estado: {statusOptions.find(s => s.value === filters.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-2 text-emerald-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.span>
            )}

            {filters.keywords && (
              <motion.span
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-purple-400/10 text-purple-400 border border-purple-400/20"
              >
                Keywords: {filters.keywords}
                <button
                  onClick={() => handleFilterChange('keywords', '')}
                  className="ml-2 text-purple-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.span>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LicitacionFilters;
