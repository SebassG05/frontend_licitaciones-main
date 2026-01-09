import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Euro, 
  ExternalLink, 
  Building2, 
  Tag, 
  Clock, 
  Briefcase, 
  FileText,
  ArrowLeft,
  Globe,
  Phone,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getLicitacionById } from '../services/licitaciones';

const LicitacionDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [licitacion, setLicitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLicitacion = async () => {
      try {
        setLoading(true);
        const response = await getLicitacionById(id);
        setLicitacion(response.data);
      } catch (err) {
        console.error('Error cargando licitación:', err);
        setError(err.message || 'Error al cargar la licitación');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLicitacion();
    }
  }, [id]);

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
      'bancoMundial': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      'comisionEuropea': 'from-amber-500/20 to-amber-600/20 border-amber-500/30',
      'nacionesUnidas': 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
      'contratacionEstadoEspana': 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    };
    return colors[source] || 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
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
      'open': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'closed': 'bg-red-500/10 text-red-400 border-red-500/30',
      'pending': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      'cancelled': 'bg-gray-500/10 text-gray-400 border-gray-500/30',
      'abierta': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'cerrada': 'bg-red-500/10 text-red-400 border-red-500/30',
      'en evaluación': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      'forthcoming': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/30';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#a1db87] mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando licitación...</p>
        </div>
      </div>
    );
  }

  if (error || !licitacion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error al cargar</h2>
          <p className="text-gray-400 mb-6">{error || 'No se encontró la licitación'}</p>
          <button
            onClick={() => navigate('/licitaciones')}
            className="px-6 py-3 bg-[#a1db87] text-[#0a0a0a] rounded-xl font-semibold hover:bg-[#8bc96e] transition-colors"
          >
            Volver a licitaciones
          </button>
        </div>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(licitacion.deadline || licitacion.fechaLimite);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Botón de volver */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-[#a1db87] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </motion.button>

        {/* Encabezado de la licitación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${getSourceColor(licitacion.source)} border rounded-2xl p-8 mb-6`}
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-semibold text-white">
              {getSourceLabel(licitacion.source)}
            </span>
            {(licitacion.status || licitacion.estado) && (
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(licitacion.status || licitacion.estado)}`}>
                {getStatusLabel(licitacion.status || licitacion.estado)}
              </span>
            )}
            {daysRemaining !== null && daysRemaining >= 0 && (
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                daysRemaining <= 3 ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                daysRemaining <= 7 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {daysRemaining === 0 ? '¡Hoy!' : daysRemaining === 1 ? 'Mañana' : `${daysRemaining} días restantes`}
              </span>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
            {licitacion.title || licitacion.titulo || 'Título no disponible'}
          </h1>

          {licitacion.referenceNumber && (
            <p className="text-gray-300 text-sm">
              <span className="font-semibold">Referencia:</span> {licitacion.referenceNumber}
            </p>
          )}
        </motion.div>

        {/* Grid de información principal */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Información financiera */}
          {(licitacion.budget || licitacion.presupuesto) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <Euro className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Presupuesto</h2>
              </div>
              <p className="text-3xl font-bold text-[#a1db87]">
                {formatCurrency(licitacion.budget || licitacion.presupuesto, licitacion.currency)}
              </p>
              {licitacion.currency && (
                <p className="text-gray-400 text-sm mt-2">Moneda: {licitacion.currency}</p>
              )}
            </motion.div>
          )}

          {/* Fechas importantes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Fechas</h2>
            </div>
            <div className="space-y-3">
              {(licitacion.deadline || licitacion.fechaLimite) && (
                <div>
                  <p className="text-gray-400 text-sm">Fecha límite</p>
                  <p className="text-white font-semibold">
                    {formatDate(licitacion.deadline || licitacion.fechaLimite)}
                  </p>
                </div>
              )}
              {(licitacion.publicationDate || licitacion.fechaPublicacion) && (
                <div>
                  <p className="text-gray-400 text-sm">Fecha de publicación</p>
                  <p className="text-white font-semibold">
                    {formatDate(licitacion.publicationDate || licitacion.fechaPublicacion)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Descripción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Descripción</h2>
          </div>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {licitacion.description || licitacion.descripcion || 'No hay descripción disponible'}
          </p>
        </motion.div>

        {/* Grid de detalles adicionales */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Ubicación */}
          {(licitacion.location || licitacion.country || licitacion.region) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <MapPin className="w-6 h-6 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Ubicación</h2>
              </div>
              <div className="space-y-2 text-gray-300">
                {licitacion.country && <p><span className="font-semibold">País:</span> {licitacion.country}</p>}
                {licitacion.region && <p><span className="font-semibold">Región:</span> {licitacion.region}</p>}
                {licitacion.location && <p>{licitacion.location}</p>}
              </div>
            </motion.div>
          )}

          {/* Categoría y Sector */}
          {(licitacion.category || licitacion.sector) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-pink-500/10 rounded-xl">
                  <Tag className="w-6 h-6 text-pink-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Categoría</h2>
              </div>
              <div className="space-y-2 text-gray-300">
                {licitacion.category && <p><span className="font-semibold">Categoría:</span> {licitacion.category}</p>}
                {licitacion.sector && <p><span className="font-semibold">Sector:</span> {licitacion.sector}</p>}
              </div>
            </motion.div>
          )}
        </div>

        {/* Información de contacto */}
        {(licitacion.organizacion || licitacion.contactEmail || licitacion.contactPhone) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <Building2 className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Información de contacto</h2>
            </div>
            <div className="space-y-3 text-gray-300">
              {licitacion.organizacion && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span>{licitacion.organizacion}</span>
                </div>
              )}
              {licitacion.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${licitacion.contactEmail}`} className="hover:text-[#a1db87] transition-colors">
                    {licitacion.contactEmail}
                  </a>
                </div>
              )}
              {licitacion.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{licitacion.contactPhone}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Enlace a la fuente original */}
        {licitacion.url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <a
              href={licitacion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#a1db87] to-[#8bc96e] text-[#0a0a0a] rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#a1db87]/20 transition-all duration-300 hover:scale-105"
            >
              <ExternalLink className="w-5 h-5" />
              Ver licitación original
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LicitacionDetalle;
