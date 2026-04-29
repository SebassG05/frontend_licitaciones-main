import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Euro, ExternalLink, Eye, EyeOff, Building2, Tag, Clock, Briefcase, FileText } from 'lucide-react';

const LicitacionCard = ({ licitacion, isUserAuthenticated, onShowPremiumPopup }) => {
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
      'contratacionEstadoEspana': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'juntaAndalucia': 'bg-lime-500/10 text-lime-400 border-lime-500/20',
    };
    return colors[source] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getSourceLabel = (source) => {
    const labels = {
      'bancoMundial': 'Banco Mundial',
      'comisionEuropea': 'Comisión Europea',
      'nacionesUnidas': 'Naciones Unidas',
      'contratacionEstadoEspana': 'Contratación del Estado España',
      'juntaAndalucia': 'Junta de Andalucia',
    };
    return labels[source] || source;
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'closed': 'bg-red-500/10 text-red-400 border-red-500/20',
      'pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'cancelled': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      'abierta': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'cerrada': 'bg-red-500/10 text-red-400 border-red-500/20',
      'en evaluación': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'forthcoming': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'open': 'Abierta',
      'closed': 'Cerrada',
      'pending': 'Pendiente',
      'cancelled': 'Cancelada',
      'abierta': 'Abierta',
      'cerrada': 'Cerrada',
      'en evaluación': 'En Evaluación',
      'forthcoming': 'Próxima',
    };
    return labels[status] || status;
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Función para verificar si un campo está borroso
  const isBlurred = (value) => {
    return typeof value === 'string' && value.includes('••');
  };

  // Función para renderizar campos con blur
  const renderBlurredField = (value, defaultText = 'No disponible', className = '') => {
    if (isBlurred(value)) {
      return (
        <span className={`filter blur-sm select-none relative ${className}`}>
          {defaultText}
        </span>
      );
    }
    return <span className={className}>{value || defaultText}</span>;
  };

  // Función para renderizar fechas con blur
  const renderBlurredDate = (dateValue) => {
    if (isBlurred(dateValue)) {
      return (
        <span className="filter blur-sm select-none">
          {formatDate(new Date())}
        </span>
      );
    }
    return formatDate(dateValue);
  };

  // Función para renderizar moneda con blur
  const renderBlurredCurrency = (amount, currency = 'EUR') => {
    if (isBlurred(amount)) {
      return (
        <span className="filter blur-sm select-none">
          {formatCurrency(50000, currency)}
        </span>
      );
    }
    return formatCurrency(amount, currency);
  };

  const calculateDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    
    // Resetear las horas para comparar solo fechas
    deadlineDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDeadlineWithDays = (deadline) => {
    const days = calculateDaysRemaining(deadline);
    const formattedDate = formatDate(deadline);
    
    if (days === null) return 'No disponible';
    if (days < 0) {
      return `${formattedDate} (Vencida)`;
    } else if (days === 0) {
      return `${formattedDate} (¡Hoy!)`;
    } else if (days === 1) {
      return `${formattedDate} (Mañana)`;
    } else if (days <= 7) {
      return `${formattedDate} (${days} días)`;
    } else {
      return `${formattedDate} (${days} días)`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.005 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.5)] backdrop-blur-sm overflow-hidden group will-change-transform"
    >
      {/* Layout vertical - todo abajo */}
      <div className="flex flex-col">
        {/* Sección principal con título y badges */}
        <div className="p-6">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg lg:text-xl font-bold text-white leading-tight mb-3 group-hover:text-[#a1db87] transition-colors duration-300"
          >
            {licitacion.title || licitacion.titulo || 'Título no disponible'}
          </motion.h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${getSourceColor(licitacion.source)} hover:scale-105 transition-transform duration-150`}
            >
              {getSourceLabel(licitacion.source)}
            </span>
            
            {(licitacion.status || licitacion.estado) && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${getStatusColor(licitacion.status || licitacion.estado)}`}
              >
                {getStatusLabel(licitacion.status || licitacion.estado)}
              </motion.span>
            )}

            {/* Badge de presupuesto destacado - oculto solo para contrataciones del estado */}
            {(licitacion.budget || licitacion.presupuesto) && licitacion.source !== 'contratacionEstadoEspana' && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30"
              >
                💰 {renderBlurredCurrency(licitacion.budget || licitacion.presupuesto, licitacion.currency)}
              </motion.span>
            )}

            {/* Badge de urgencia basado en fecha límite */}
            {(licitacion.deadline || licitacion.fechaLimite) && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  isBlurred(licitacion.deadline || licitacion.fechaLimite)
                    ? 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                    : new Date(licitacion.deadline || licitacion.fechaLimite) - new Date() < 7 * 24 * 60 * 60 * 1000
                    ? 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse'
                    : new Date(licitacion.deadline || licitacion.fechaLimite) - new Date() < 30 * 24 * 60 * 60 * 1000
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                }`}
              >
                ⏰ {
                  isBlurred(licitacion.deadline || licitacion.fechaLimite)
                    ? renderBlurredField(licitacion.deadline || licitacion.fechaLimite, 'Fecha límite')
                    : new Date(licitacion.deadline || licitacion.fechaLimite) - new Date() < 7 * 24 * 60 * 60 * 1000
                    ? 'Urgente'
                    : new Date(licitacion.deadline || licitacion.fechaLimite) - new Date() < 30 * 24 * 60 * 60 * 1000
                    ? 'Próxima'
                    : 'Abierta'
                }
              </motion.span>
            )}

            {/* Badge de tipo de licitación */}
            {(licitacion.tipoLicitacion || licitacion.type || licitacion.category) && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-purple-500/20 text-purple-300 border-purple-500/30"
              >
                🏷️ {renderBlurredField(licitacion.tipoLicitacion || licitacion.type || licitacion.category, 'Tipo no especificado')}
              </motion.span>
            )}

            {/* Badge de idioma */}
            {licitacion.idiomaRequerido && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
              >
                🌍 {licitacion.idiomaRequerido}
              </motion.span>
            )}
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              {isExpanded 
                ? (licitacion.description || licitacion.descripcion || 'Sin descripción disponible')
                : truncateText(licitacion.description || licitacion.descripcion, 200)
              }
            </p>
            
            {(licitacion.description || licitacion.descripcion) && (licitacion.description || licitacion.descripcion).length > 200 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="cursor-pointer flex items-center gap-2 text-[#a1db87] hover:text-white text-xs font-semibold mt-2 transition-colors duration-300"
              >
                {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isExpanded ? 'Ver menos' : 'Ver más'}
              </motion.button>
            )}
          </div>
        </div>

        {/* Sección de información detallada - ahora abajo en grid */}
        <div className="px-6 pb-6">
          {(() => {
            // Contar cuántos elementos de información tenemos (excluyendo presupuesto solo para contrataciones del estado)
            const infoElements = [
              licitacion.deadline || licitacion.fechaLimite,
              // Solo incluir presupuesto si no es contratación del estado
              (licitacion.source !== 'contratacionEstadoEspana') ? (licitacion.budget || licitacion.estimatedValue || licitacion.presupuesto) : null,
              licitacion.location || licitacion.paisRegion,
              licitacion.organoContratacion || licitacion.entity,
              licitacion.tipoLicitacion || licitacion.type || licitacion.category,
              licitacion.duracionMeses,
              licitacion.publishDate || licitacion.fechaPublicacion,
              licitacion.idiomaRequerido,
              licitacion.referenceId || licitacion.numeroReferenciaInterna
            ].filter(Boolean);
            
            // Ajustar grid según cantidad de elementos
            let gridClass = 'grid gap-4 text-sm';
            if (infoElements.length === 1) {
              gridClass += ' grid-cols-1 place-items-center max-w-xs mx-auto';
            } else if (infoElements.length === 2) {
              gridClass += ' grid-cols-2 max-w-lg mx-auto';
            } else if (infoElements.length === 3) {
              gridClass += ' grid-cols-2 md:grid-cols-3';
            } else if (infoElements.length === 4) {
              gridClass += ' grid-cols-2 md:grid-cols-4';
            } else {
              gridClass += ' grid-cols-2 md:grid-cols-3';
            }
            
            return <div className={gridClass}>
            {/* Fecha límite - PRIORITARIA */}
            {(licitacion.deadline || licitacion.fechaLimite) && (
              <div className={`p-3 lg:p-4 rounded-xl border transition-all duration-300 ${
                calculateDaysRemaining(licitacion.deadline || licitacion.fechaLimite) <= 7
                  ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30 hover:border-red-400/50'
                  : calculateDaysRemaining(licitacion.deadline || licitacion.fechaLimite) <= 30
                  ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30 hover:border-yellow-400/50'
                  : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-400/50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className={`w-4 h-4 ${
                    calculateDaysRemaining(licitacion.deadline || licitacion.fechaLimite) <= 7 
                      ? 'text-red-400' 
                      : calculateDaysRemaining(licitacion.deadline || licitacion.fechaLimite) <= 30
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`} />
                  <span className={`font-semibold text-xs ${
                    calculateDaysRemaining(licitacion.deadline || licitacion.fechaLimite) <= 7 
                      ? 'text-red-400' 
                      : calculateDaysRemaining(licitacion.deadline || licitacion.fechaLimite) <= 30
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`}>
                    Fecha límite
                  </span>
                </div>
                <span className={`font-bold text-sm ${
                  calculateDaysRemaining(licitacion.deadline || licitacion.fechaLimite) <= 7 
                    ? 'text-red-300' 
                    : calculateDaysRemaining(licitacion.deadline || licitacion.fechaLimite) <= 30
                    ? 'text-yellow-300'
                    : 'text-green-300'
                }`}>
                  {isBlurred(licitacion.deadline || licitacion.fechaLimite) 
                    ? renderBlurredDate(licitacion.deadline || licitacion.fechaLimite)
                    : formatDeadlineWithDays(licitacion.deadline || licitacion.fechaLimite)
                  }
                </span>
              </div>
            )}

            {/* Presupuesto - oculto solo para contrataciones del estado */}
            {(licitacion.budget || licitacion.estimatedValue || licitacion.presupuesto) && licitacion.source !== 'contratacionEstadoEspana' && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 group/item hover:border-[#a1db87]/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Euro className="w-4 h-4 text-[#a1db87]" />
                  <span className="font-semibold text-gray-400 text-xs">Presupuesto</span>
                </div>
                <span className="text-[#a1db87] font-bold text-sm lg:text-base">
                  {renderBlurredCurrency(licitacion.budget || licitacion.estimatedValue || licitacion.presupuesto, licitacion.currency)}
                </span>
              </div>
            )}

            {/* Ubicación */}
            {(licitacion.location || licitacion.paisRegion) && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 hover:border-blue-400/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-gray-400 text-xs">Ubicación</span>
                </div>
                <span className="text-white font-medium text-sm">
                  {licitacion.location || licitacion.paisRegion}
                </span>
              </div>
            )}

            {/* Entidad Convocante */}
            {(licitacion.organoContratacion || licitacion.entity) && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 hover:border-indigo-400/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-gray-400 text-xs">Entidad</span>
                </div>
                <span className="text-white font-medium text-sm truncate">
                  {licitacion.organoContratacion || licitacion.entity}
                </span>
              </div>
            )}

            {/* Tipo de Licitación */}
            {(licitacion.tipoLicitacion || licitacion.type || licitacion.category) && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 hover:border-purple-400/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-gray-400 text-xs">Tipo</span>
                </div>
                <span className="text-white font-medium text-sm">
                  {renderBlurredField(licitacion.tipoLicitacion || licitacion.type || licitacion.category, 'Tipo no especificado')}
                </span>
              </div>
            )}

            {/* Duración */}
            {licitacion.duracionMeses && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 hover:border-cyan-400/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-gray-400 text-xs">Duración</span>
                </div>
                <span className="text-cyan-400 font-bold text-sm">
                  {licitacion.duracionMeses} {licitacion.duracionMeses === 1 ? 'mes' : 'meses'}
                </span>
              </div>
            )}

            {/* Fecha de publicación */}
            {(licitacion.publishDate || licitacion.fechaPublicacion) && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 hover:border-purple-400/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-gray-400 text-xs">Publicado</span>
                </div>
                <span className="text-white font-medium text-sm">
                  {renderBlurredDate(licitacion.publishDate || licitacion.fechaPublicacion)}
                </span>
              </div>
            )}

            {/* Idioma Requerido */}
            {licitacion.idiomaRequerido && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 hover:border-yellow-400/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-gray-400 text-xs">Idioma</span>
                </div>
                <span className="text-white font-medium text-sm">
                  {licitacion.idiomaRequerido}
                </span>
              </div>
            )}

            {/* Referencia */}
            {(licitacion.referenceId || licitacion.numeroReferenciaInterna) && (
              <div className="bg-[#2a2a2a] p-3 lg:p-4 rounded-xl border border-gray-700 hover:border-amber-400/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-gray-400 text-xs">Referencia</span>
                </div>
                <span className={`text-white font-mono text-xs select-none ${!isUserAuthenticated ? 'blur-sm' : ''}`}>
                  {licitacion.referenceId || licitacion.numeroReferenciaInterna}
                </span>
              </div>
            )}

          </div>
          {/* Cerrar la función anónima */}
          })()}

          {/* Botón Ver detalles - ahora abajo y separado más pequeño */}
          {(licitacion.url || licitacion.enlace) && (
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-center">
              {isUserAuthenticated ? (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={licitacion.url || licitacion.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#a1db87] text-[#1a1a1a] 
                    text-sm font-bold rounded-xl hover:bg-white
                    transition-all duration-300 shadow-lg hover:shadow-xl
                    hover:shadow-[#a1db87]/25 max-w-xs
                  "
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver detalles completos
                </motion.a>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onShowPremiumPopup}
                  className="
                    cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#a1db87] text-[#1a1a1a] 
                    text-sm font-bold rounded-xl hover:bg-white
                    transition-all duration-300 shadow-lg hover:shadow-xl
                    hover:shadow-[#a1db87]/25 max-w-xs
                  "
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver detalles completos
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Memoizar el componente para evitar re-renders innecesarios
export default memo(LicitacionCard);
