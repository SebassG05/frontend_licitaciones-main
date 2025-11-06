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
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.5)] backdrop-blur-sm overflow-hidden group"
    >
      {/* Header de la tarjeta */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold text-white leading-tight mb-3 group-hover:text-[#a1db87] transition-colors duration-300"
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
          </div>

          {/* Información de fechas */}
          {licitacion.deadline && (
            <div className="text-right flex-shrink-0 bg-[#2a2a2a] p-4 rounded-xl border border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Fecha límite:</span>
              </div>
              <span className="text-[#a1db87] font-bold text-lg">
                {formatDate(licitacion.deadline)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {/* Descripción */}
        <div className="mb-6">
          <p className="text-gray-300 text-sm leading-relaxed">
            {isExpanded 
              ? (licitacion.description || 'Sin descripción disponible')
              : truncateText(licitacion.description)
            }
          </p>
          
          {licitacion.description && licitacion.description.length > 150 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-[#a1db87] hover:text-white text-xs font-semibold mt-3 transition-colors duration-300"
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </motion.button>
          )}
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
          {/* Presupuesto */}
          {(licitacion.budget || licitacion.estimatedValue) && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[#2a2a2a] p-4 rounded-xl border border-gray-700 group/item hover:border-[#a1db87]/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <Euro className="w-4 h-4 text-[#a1db87]" />
                <span className="font-semibold text-gray-400">Presupuesto</span>
              </div>
              <span className="text-[#a1db87] font-bold text-lg">
                {formatCurrency(licitacion.budget || licitacion.estimatedValue, licitacion.currency)}
              </span>
            </motion.div>
          )}

          {/* Ubicación */}
          {licitacion.location && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[#2a2a2a] p-4 rounded-xl border border-gray-700 hover:border-blue-400/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-gray-400">Ubicación</span>
              </div>
              <span className="text-white font-medium">
                {licitacion.location}
              </span>
            </motion.div>
          )}

          {/* Fecha de publicación */}
          {licitacion.publishDate && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[#2a2a2a] p-4 rounded-xl border border-gray-700 hover:border-emerald-400/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-gray-400">Publicado</span>
              </div>
              <span className="text-white font-medium">
                {formatDate(licitacion.publishDate)}
              </span>
            </motion.div>
          )}

          {/* ID de referencia */}
          {licitacion.referenceId && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[#2a2a2a] p-4 rounded-xl border border-gray-700 hover:border-purple-400/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-gray-400">Referencia</span>
              </div>
              <span className="text-white font-mono text-xs">
                {licitacion.referenceId}
              </span>
            </motion.div>
          )}

          {/* Categoría */}
          {licitacion.category && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[#2a2a2a] p-4 rounded-xl border border-gray-700 hover:border-amber-400/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-gray-400">Categoría</span>
              </div>
              <span className="text-white font-medium">
                {licitacion.category}
              </span>
            </motion.div>
          )}

          {/* Tipo de contrato */}
          {licitacion.contractType && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[#2a2a2a] p-4 rounded-xl border border-gray-700 hover:border-cyan-400/30 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-gray-400">Tipo</span>
              </div>
              <span className="text-white font-medium">
                {licitacion.contractType}
              </span>
            </motion.div>
          )}
        </div>

        {/* Enlaces */}
        {licitacion.url && (
          <div className="pt-4 border-t border-gray-800">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={licitacion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-3 px-6 py-3 bg-[#a1db87] text-[#1a1a1a] 
                text-sm font-bold rounded-xl hover:bg-white
                transition-all duration-300 shadow-lg hover:shadow-xl
                hover:shadow-[#a1db87]/25
              "
            >
              <ExternalLink className="w-4 h-4" />
              Ver detalles completos
            </motion.a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LicitacionCard;