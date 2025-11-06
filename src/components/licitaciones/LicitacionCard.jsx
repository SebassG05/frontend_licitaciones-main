import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Euro, ExternalLink, Eye, EyeOff, Building2, Tag, Clock } from 'lucide-react';

const LicitacionCard = ({ licitacion }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'EUR') => {
    if (!amount) return 'No especificado';
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSourceColor = (source) => {
    const colors = {
      'bancoMundial': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'comisionEuropea': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'nacionesUnidas': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'contratacionEstadoEspana': 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return colors[source] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getSourceLabel = (source) => {
    const labels = {
      'bancoMundial': 'Banco Mundial',
      'comisionEuropea': 'Comisión Europea',
      'nacionesUnidas': 'Naciones Unidas',
      'contratacionEstadoEspana': 'Contratación del Estado España',
    };
    return labels[source] || source;
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'closed': 'bg-red-500/10 text-red-400 border-red-500/20',
      'pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'cancelled': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'open': 'Abierta',
      'closed': 'Cerrada',
      'pending': 'Pendiente',
      'cancelled': 'Cancelada',
    };
    return labels[status] || status;
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return 'Sin descripción disponible';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.5)] backdrop-blur-sm overflow-hidden group"
    >
      {/* Layout horizontal en pantallas grandes, vertical en móviles */}
      <div className="flex flex-col lg:flex-row lg:items-center">
        {/* Sección principal con título y badges */}
        <div className="p-6 lg:flex-1">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg lg:text-xl font-bold text-white leading-tight mb-3 group-hover:text-[#a1db87] transition-colors duration-300"
          >
            {licitacion.title || 'Título no disponible'}
          </motion.h3>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${getSourceColor(licitacion.source)}`}
            >
              {getSourceLabel(licitacion.source)}
            </motion.span>
            
            {licitacion.status && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${getStatusColor(licitacion.status)}`}
              >
                {getStatusLabel(licitacion.status)}
              </motion.span>
            )}
          </div>

          {/* Descripción */}
          <div className="mb-4 lg:mb-0">
            <p className="text-gray-300 text-sm leading-relaxed">
              {isExpanded 
                ? (licitacion.description || 'Sin descripción disponible')
                : truncateText(licitacion.description, 200)
              }
            </p>
            
            {licitacion.description && licitacion.description.length > 200 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-[#a1db87] hover:text-white text-xs font-semibold mt-2 transition-colors duration-300"
              >
                {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isExpanded ? 'Ver menos' : 'Ver más'}
              </motion.button>
            )}
          </div>
        </div>

        {/* Sección de información compacta - en fila horizontal para pantallas grandes */}
        <div className="px-6 pb-6 lg:p-6 lg:w-auto lg:flex-shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 lg:space-y-3 gap-4 lg:gap-0 text-sm">
            {/* Presupuesto */}
            {(licitacion.budget || licitacion.estimatedValue) && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 group/item hover:border-[#a1db87]/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Euro className="w-4 h-4 text-[#a1db87]" />
                  <span className="font-semibold text-gray-400 text-xs">Presupuesto</span>
                </div>
                <span className="text-[#a1db87] font-bold text-sm lg:text-base">
                  {formatCurrency(licitacion.budget || licitacion.estimatedValue, licitacion.currency)}
                </span>
              </div>
            )}

            {/* Ubicación */}
            {licitacion.location && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 hover:border-blue-400/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-gray-400 text-xs">Ubicación</span>
                </div>
                <span className="text-white font-medium text-sm">
                  {licitacion.location}
                </span>
              </div>
            )}

            {/* Fecha límite */}
            {licitacion.deadline && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 hover:border-emerald-400/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-gray-400 text-xs">Fecha límite</span>
                </div>
                <span className="text-emerald-400 font-bold text-sm">
                  {formatDate(licitacion.deadline)}
                </span>
              </div>
            )}

            {/* Fecha de publicación */}
            {licitacion.publishDate && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 hover:border-purple-400/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-gray-400 text-xs">Publicado</span>
                </div>
                <span className="text-white font-medium text-sm">
                  {formatDate(licitacion.publishDate)}
                </span>
              </div>
            )}

            {/* Referencia */}
            {licitacion.referenceId && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 hover:border-amber-400/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-gray-400 text-xs">Referencia</span>
                </div>
                <span className="text-white font-mono text-xs">
                  {licitacion.referenceId}
                </span>
              </div>
            )}

            {/* Enlace */}
            {licitacion.url && (
              <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={licitacion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-3 bg-[#a1db87] text-[#1a1a1a] 
                    text-xs lg:text-sm font-bold rounded-xl hover:bg-white
                    transition-all duration-300 shadow-lg hover:shadow-xl
                    hover:shadow-[#a1db87]/25 w-full justify-center
                  "
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver detalles
                </motion.a>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LicitacionCard;