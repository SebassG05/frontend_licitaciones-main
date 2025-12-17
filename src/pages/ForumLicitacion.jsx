import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Plus, 
  Search,
  Filter,
  Clock,
  Building2,
  Award,
  CheckCircle,
  Euro,
  Calendar,
  MapPin,
  Eye,
  ArrowRight,
  Heart,
  Reply,
  Loader,
  ExternalLink,
  Tag,
  Edit3
} from 'lucide-react';
import Container from '../components/ui/Container';
import { eliminarRespuesta } from '../services/forum';
import { useAuth } from '../context/AuthContext';
import PremiumPopup from '../components/ui/PremiumPopup';

// Servicio API para el foro
const forumAPI = {
  // Obtener posts de una licitación usando el servicio global
  async getPostsByLicitacion(licitacionId) {
    try {
      const { getPostsByLicitacion } = await import('../services/forum');
      return await getPostsByLicitacion(licitacionId);
    } catch (error) {
      return { posts: [], total: 0 };
    }
  },

  // Obtener detalles de una licitación usando el servicio global
  async getLicitacion(licitacionId) {
    const { getLicitacionById } = await import('../services/licitaciones');
    return await getLicitacionById(licitacionId);
  },

  // Crear un nuevo post
  async crearPost(licitacionId, postData) {
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://dtas.evenor-tech.com/api';
    const response = await fetch(`${API_URL}/forum/licitacion/${licitacionId}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...postData, licitacion: licitacionId })
    });
    if (!response.ok) throw new Error('Error al crear post');
    return await response.json();
  },

  // Responder a un post
  async responderPost(postId, respuesta) {
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://dtas.evenor-tech.com/api';
    const response = await fetch(`${API_URL}/forum/posts/${postId}/responder`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mensaje: respuesta })
    });
    if (!response.ok) throw new Error('Error al responder post');
    return await response.json();
  },

  // Marcar interés en un post
  async marcarInteres(postId) {
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://dtas.evenor-tech.com/api';
    const response = await fetch(`${API_URL}/forum/posts/${postId}/interes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Error al marcar interés');
    return await response.json();
  },

  // Obtener perfil de empresa usando el servicio global
  async obtenerPerfilEmpresa() {
    const { getPerfilEmpresa } = await import('../services/forum');
    return await getPerfilEmpresa();
  },

  // Buscar licitaciones para el foro usando el servicio global
  async buscarLicitaciones(search = '', page = 1) {
    // Importar dinámicamente el servicio para evitar ciclos
    const { getLicitaciones } = await import('../services/licitaciones');
    // Usar el mismo formato de params que el servicio
    return await getLicitaciones({ search, page, limit: 10 });
  }
};

const ForumLicitacion = () => {
  const { licitacionId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showPremium, setShowPremium] = useState(false);
  
  const [licitacion, setLicitacion] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [perfilEmpresa, setPerfilEmpresa] = useState(null);
  const [postRespuesta, setPostRespuesta] = useState(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [cargandoRespuesta, setCargandoRespuesta] = useState(false);
  
  // Estados para el formulario de crear post
  const [formPost, setFormPost] = useState({
    titulo: '',
    contenido: '',
    tipoPost: 'busco_socios',
    presupuestoMin: '',
    presupuestoMax: '',
    fechaLimite: '',
    requisitos: '',
    contactoInfo: ''
  });
  const [creandoPost, setCreandoPost] = useState(false);
  
  // Estados para el buscador de licitaciones
  const [licitacionesBusqueda, setLicitacionesBusqueda] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [buscandoLicitaciones, setBuscandoLicitaciones] = useState(false);
  const [paginaBusqueda, setPaginaBusqueda] = useState(1);
  const [totalPaginasBusqueda, setTotalPaginasBusqueda] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Si no hay licitacionId, mostrar vista general del foro
        if (!licitacionId) {
          // Para la vista general, podríamos obtener todas las licitaciones con foros activos
          // Por ahora mantenemos vacío
          setLicitacion(null);
          setPosts([]);
          setLoading(false);
          return;
        }

        // Cargar datos en paralelo
        const [licitacionData, postsData, perfilData] = await Promise.all([
          forumAPI.getLicitacion(licitacionId).catch(() => null),
          forumAPI.getPostsByLicitacion(licitacionId).catch(() => ({ success: true, data: { posts: [] } })),
          forumAPI.obtenerPerfilEmpresa().catch(() => null)
        ]);

        setLicitacion(licitacionData?.data || licitacionData);
        setPosts(postsData?.data?.posts || []);
        setPerfilEmpresa(perfilData);
        
      } catch (err) {
        console.error('Error cargando datos del foro:', err);
        setError(err.message || 'Error al cargar los datos del foro');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [licitacionId]);

  // Funciones de manejo
  const handleCrearPost = async (e) => {
    e.preventDefault();
    try {
      setCreandoPost(true);
      const nuevoPost = await forumAPI.crearPost(licitacionId, formPost);
      setPosts(prevPosts => [nuevoPost.data, ...prevPosts]);
      setMostrarFormulario(false);
      setFormPost({
        titulo: '',
        contenido: '',
        tipoPost: 'busco_socios',
        presupuestoMin: '',
        presupuestoMax: '',
        fechaLimite: '',
        requisitos: '',
        contactoInfo: ''
      });
    } catch (err) {
      console.error('Error creando post:', err);
      setError('Error al crear el post');
    } finally {
      setCreandoPost(false);
    }
  };

  const handleResponder = async (postId, respuesta) => {
    try {
      setCargandoRespuesta(true);
      const postActualizado = await forumAPI.responderPost(postId, respuesta);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? postActualizado : post
        )
      );
      setPostRespuesta(null);
      setRespuestaTexto('');
    } catch (err) {
      console.error('Error respondiendo post:', err);
      setError('Error al responder el post');
    } finally {
      setCargandoRespuesta(false);
    }
  };

  const abrirFormularioRespuesta = (post) => {
    setPostRespuesta(post);
    setRespuestaTexto('');
  };

  const enviarRespuesta = async () => {
    if (!respuestaTexto.trim()) return;
    await handleResponder(postRespuesta._id, respuestaTexto.trim());
  };

  // Función para buscar licitaciones
  const buscarLicitaciones = async (termino = '', pagina = 1) => {
    try {
      setBuscandoLicitaciones(true);
      setError(null);
      
      console.log('Buscando licitaciones con término:', termino, 'página:', pagina);
      const resultado = await forumAPI.buscarLicitaciones(termino, pagina);
      console.log('Resultado de búsqueda:', resultado);
      
      // Manejar la estructura de respuesta del backend
      let licitaciones = [];
      let paginacion = {};
      
      if (resultado.success && resultado.data) {
        licitaciones = resultado.data.licitaciones || [];
        paginacion = resultado.data.pagination || {};
      } else if (resultado.licitaciones) {
        licitaciones = resultado.licitaciones;
      } else if (Array.isArray(resultado)) {
        licitaciones = resultado;
      }
      
      if (pagina === 1) {
        setLicitacionesBusqueda(licitaciones);
      } else {
        setLicitacionesBusqueda(prev => [...prev, ...licitaciones]);
      }
      
      setTotalPaginasBusqueda(paginacion.totalPages || resultado.totalPages || 1);
      setPaginaBusqueda(pagina);
    } catch (err) {
      console.error('Error buscando licitaciones:', err);
      setError(`Error al buscar licitaciones: ${err.message}`);
      setLicitacionesBusqueda([]);
    } finally {
      setBuscandoLicitaciones(false);
    }
  };

  // Efecto para buscar licitaciones en la vista general
  useEffect(() => {
    if (!licitacionId) {
      buscarLicitaciones('', 1);
    }
  }, [licitacionId]);

  // Función para manejar la búsqueda con debouncing
  useEffect(() => {
    if (!licitacionId) {
      const timer = setTimeout(() => {
        buscarLicitaciones(terminoBusqueda, 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [terminoBusqueda, licitacionId]);

  const handleMarcarInteres = async (postId) => {
    try {
      const postActualizado = await forumAPI.marcarInteres(postId);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? postActualizado : post
        )
      );
    } catch (err) {
      console.error('Error marcando interés:', err);
      setError('Error al marcar interés');
    }
  };

  const tiposPost = {
    todos: 'Todos los posts',
    busco_socios: 'Buscan socios',
    ofrezco_servicios: 'Ofrecen servicios',
    consulta_tecnica: 'Consultas técnicas',
    informacion_general: 'Información general'
  };

  const postsFiltrados = filtroTipo === 'todos' 
    ? posts 
    : posts.filter(post => post.tipoPost === filtroTipo);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatearFechaRelativa = (fecha) => {
    const ahora = new Date();
    const diferencia = ahora - new Date(fecha);
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `Hace ${dias} días`;
    return formatearFecha(fecha);
  };

  const obtenerColorTipoPost = (tipo) => {
    const colores = {
      busco_socios: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      ofrezco_servicios: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      consulta_tecnica: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      informacion_general: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    };
    return colores[tipo] || colores.informacion_general;
  };

  const obtenerIconoTipoPost = (tipo) => {
    const iconos = {
      busco_socios: Users,
      ofrezco_servicios: Award,
      consulta_tecnica: MessageSquare,
      informacion_general: MessageSquare
    };
    const Icono = iconos[tipo] || MessageSquare;
    return <Icono className="w-4 h-4" />;
  };

  const obtenerColorTamañoEmpresa = (tamaño) => {
    const colores = {
      micro: 'bg-green-500/10 text-green-400 border-green-500/20',
      pequeña: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      mediana: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      grande: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    };
    return colores[tamaño] || colores.pequeña;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Container className="py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-[#2a2a2a] rounded w-3/4"></div>
            <div className="h-32 bg-[#2a2a2a] rounded"></div>
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-40 bg-[#2a2a2a] rounded"></div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <Container className="py-8">
          <div className="bg-[#1a1a1a] border border-red-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <ExternalLink className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Error al cargar el foro</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all duration-200"
            >
              Reintentar
            </motion.button>
          </div>
        </Container>
      </div>
    );
  }

  // Vista general del foro cuando no hay licitacionId específica
  if (!licitacionId) {

    return (
      <div className="min-h-screen bg-black">
        <Container className="py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Foro de Colaboración
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Encuentra socios, comparte servicios y colabora en licitaciones públicas. 
              Selecciona una licitación para acceder a su foro específico.
            </p>
          </motion.div>

          {/* Buscador de licitaciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar licitaciones por título, descripción o sector..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
              />
              {buscandoLicitaciones && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-[#a1db87] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Botón para ver todos los posts del foro */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 flex justify-center"
          >
              <motion.button
              whileHover={{ scale: 1.07, boxShadow: '0 8px 32px -8px #a1db87', y: -2, transition: { duration: 0.7, ease: 'easeOut' } }}
              whileTap={{ scale: 0.98, transition: { duration: 0.25 } }}
              onClick={() => {
                // Si el usuario no está autenticado, abrir modal premium aquí
                const notPremium = !isAuthenticated;
                if (notPremium) {
                  setShowPremium(true);
                  return;
                }

                // Animación de transición de página al navegar
                const container = document.querySelector('.min-h-screen.bg-black');
                if (container) {
                  container.animate([
                    { opacity: 1, transform: 'translateY(0px)' },
                    { opacity: 0, transform: 'translateY(-40px)' }
                  ], {
                    duration: 700,
                    easing: 'ease-in-out',
                    fill: 'forwards'
                  });
                  setTimeout(() => {
                    navigate('/foro/todos');
                  }, 650);
                } else {
                  navigate('/foro/todos');
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#a1db87] to-[#7cc85f] text-[#1a1a1a] rounded-xl font-semibold shadow-lg hover:shadow-[#a1db87]/25 transition-all duration-700 cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              Ver todos los posts del foro
            </motion.button>
          </motion.div>

          {/* Premium popup abierto desde la vista general del foro */}
          <PremiumPopup
            isOpen={showPremium}
            onClose={() => setShowPremium(false)}
            onLoginClick={() => window.dispatchEvent(new CustomEvent('openLogin'))}
          />

          {/* Lista de licitaciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {licitacionesBusqueda.length > 0 ? (
              <AnimatePresence>
                {licitacionesBusqueda.map((licitacion, index) => (
                  <motion.div
                    key={licitacion._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#a1db87]/30 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      const notAllowed = !isAuthenticated;
                      if (notAllowed) {
                        setShowPremium(true);
                        return;
                      }
                      navigate(`/foro/${licitacion._id}`);
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2 hover:text-[#a1db87] transition-colors">
                          {licitacion.title || licitacion.titulo}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-3">
                          {(licitacion.description || licitacion.descripcion)?.length > 200 
                            ? `${(licitacion.description || licitacion.descripcion).substring(0, 200)}...`
                            : (licitacion.description || licitacion.descripcion) || 'Sin descripción disponible'
                          }
                        </p>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-xl text-xs font-semibold border ${
                            (licitacion.status || licitacion.estado) === 'open' || (licitacion.status || licitacion.estado) === 'abierta'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}>
                            {(licitacion.status || licitacion.estado) === 'open' ? 'Abierta' : (licitacion.status || licitacion.estado)}
                          </span>
                          
                          {(licitacion.budget || licitacion.presupuesto) && (
                            <span className="px-3 py-1 rounded-xl text-xs font-semibold border bg-green-500/10 text-green-400 border-green-500/20">
                              💰 {typeof (licitacion.budget || licitacion.presupuesto) === 'number' 
                                ? (licitacion.budget || licitacion.presupuesto).toLocaleString('es-ES') + (licitacion.currency || '€')
                                : (licitacion.budget || licitacion.presupuesto)
                              }
                            </span>
                          )}
                          
                          {licitacion.source && (
                            <span className="px-3 py-1 rounded-xl text-xs font-semibold border bg-blue-500/10 text-blue-400 border-blue-500/20">
                              {licitacion.source === 'comisionEuropea' ? '🏛️ Comisión Europea' :
                               licitacion.source === 'bancoMundial' ? '🏦 Banco Mundial' :
                               licitacion.source === 'nacionesUnidas' ? '🌍 Naciones Unidas' :
                               licitacion.source === 'cascadeFunding' ? '🚀 Cascade Funding' :
                               licitacion.source === 'contratacionEstadoEspana' ? '🇪🇸 España' :
                               licitacion.source}
                            </span>
                          )}
                        </div>

                        {/* Información adicional */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          {licitacion.deadline && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Deadline: {formatearFecha(licitacion.deadline)}</span>
                            </div>
                          )}
                          {(licitacion.location || licitacion.paisRegion) && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{licitacion.location || licitacion.paisRegion}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex items-center text-[#a1db87]">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                  <MessageSquare className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {terminoBusqueda ? 'No se encontraron licitaciones' : 'Cargando licitaciones...'}
                </h3>
                <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                  {terminoBusqueda 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Buscando licitaciones disponibles para colaborar...'
                  }
                </p>
              </motion.div>
            )}

            {/* Botón cargar más */}
            {licitacionesBusqueda.length > 0 && paginaBusqueda < totalPaginasBusqueda && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center pt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => buscarLicitaciones(terminoBusqueda, paginaBusqueda + 1)}
                  disabled={buscandoLicitaciones}
                  className="px-6 py-3 bg-[#2a2a2a] text-white border border-[#3a3a3a] rounded-xl hover:bg-[#3a3a3a] hover:border-[#a1db87]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {buscandoLicitaciones ? 'Cargando...' : 'Cargar más licitaciones'}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Container className="py-8">
        {/* Botón para volver a todos los posts */}
        <div className="mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/foro/todos')}
            className="px-4 py-2 bg-[#2a2a2a] text-gray-300 border border-[#3a3a3a] rounded-xl hover:bg-[#333333] transition-all duration-200 flex items-center gap-2"
          >
            <Reply className="w-4 h-4" />
            Ver todos los posts
          </motion.button>
        </div>
        {/* Header de la licitación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-xl lg:text-2xl font-bold text-white leading-tight mb-3">
                  {licitacion?.titulo || licitacion?.title || 'Título no disponible'}
                </h1>
                
                {/* Badges principales */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                    (licitacion?.estado || licitacion?.status) === 'abierta' || (licitacion?.estado || licitacion?.status) === 'open'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>
                    {(licitacion?.estado || licitacion?.status)?.toUpperCase()}
                  </span>
                  {/* Mostrar presupuesto solo si existe */}
                  {(licitacion?.budget || licitacion?.presupuesto) > 0 && (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30">
                      💰 {(licitacion?.budget || licitacion?.presupuesto)?.toLocaleString('es-ES')}{licitacion?.currency || '€'}
                    </span>
                  )}
                  {/* Mostrar fuente solo si existe */}
                  {(licitacion?.source || licitacion?.fuente) && (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-amber-500/10 text-amber-400 border-amber-500/20">
                      🏛️ {(() => {
                        const src = licitacion?.source || licitacion?.fuente;
                        if (src === 'comisionEuropea') return 'Comisión Europea';
                        if (src === 'bancoMundial') return 'Banco Mundial';
                        if (src === 'nacionesUnidas') return 'Naciones Unidas';
                        if (src === 'cascadeFunding') return 'Cascade Funding';
                        if (src === 'contratacionEstadoEspana') return 'España';
                        return src;
                      })()}
                    </span>
                  )}
                  {/* Mostrar tipo de licitación solo si existe */}
                  {(licitacion?.category || licitacion?.tipoLicitacion) && (
                    <span className="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-purple-500/10 text-purple-400 border-purple-500/20">
                      🏷️ {licitacion?.category || licitacion?.tipoLicitacion}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Deadline: {formatearFecha(licitacion?.deadline)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{licitacion?.paisRegion}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{posts.length} posts en el foro</span>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-gray-300 leading-relaxed">
                  {licitacion?.descripcion}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMostrarFormulario(true)}
                className="bg-gradient-to-r from-[#a1db87] to-[#7cc85f] text-[#1a1a1a] px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#a1db87]/25 flex items-center gap-2 font-semibold transition-all duration-300 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Crear Post
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Información del perfil de empresa */}
        {perfilEmpresa && perfilEmpresa.success !== false ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-[#1a1a1a] to-[#252525] border border-[#2a2a2a] rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#a1db87] to-[#7cc85f] rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#1a1a1a]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {perfilEmpresa?.data?.nombreEmpresa || 'Tu empresa'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {perfilEmpresa?.data?.sectores?.join(', ') || 'Sectores de especialización'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {perfilEmpresa?.data?.verificado && (
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Verificado
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/perfil-empresa')}
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-300 px-4 py-2 rounded-lg border border-[#3a3a3a] flex items-center gap-2 transition-all duration-300 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar perfil
                </motion.button>
              </div>
            </div>
            
            {perfilEmpresa?.data?.descripcion && (
              <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                {perfilEmpresa.data.descripcion.length > 150 
                  ? `${perfilEmpresa.data.descripcion.substring(0, 150)}...` 
                  : perfilEmpresa.data.descripcion
                }
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Building2 className="w-6 h-6 text-amber-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-400 mb-1">
                    Completa tu perfil de empresa
                  </h3>
                  <p className="text-sm text-amber-300 leading-relaxed">
                    Para participar activamente en el foro, crea tu perfil con información de tu empresa y servicios.
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/perfil-empresa')}
                className="bg-gradient-to-r from-[#a1db87] to-[#7cc85f] text-[#1a1a1a] px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#a1db87]/25 font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear perfil
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Estadísticas del foro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{posts.length}</div>
            <div className="text-xs text-gray-400">Posts totales</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{posts.filter(p => p.tipoPost === 'busco_socios').length}</div>
            <div className="text-xs text-gray-400">Buscan socios</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{posts.filter(p => p.tipoPost === 'ofrezco_servicios').length}</div>
            <div className="text-xs text-gray-400">Ofrecen servicios</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{posts.reduce((total, post) => total + post.numeroRespuestas, 0)}</div>
            <div className="text-xs text-gray-400">Respuestas totales</div>
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {Object.entries(tiposPost).map(([tipo, label]) => (
              <motion.button
                key={tipo}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFiltroTipo(tipo)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border flex items-center gap-2 ${
                  filtroTipo === tipo
                    ? 'bg-[#a1db87] text-[#1a1a1a] border-[#a1db87] shadow-lg shadow-[#a1db87]/25'
                    : 'bg-[#1a1a1a] text-gray-300 border-[#2a2a2a] hover:text-white hover:bg-[#252525] hover:border-[#333333]'
                }`}
              >
                {obtenerIconoTipoPost(tipo)}
                <span>{label}</span>
                {tipo !== 'todos' && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filtroTipo === tipo ? 'bg-black/20' : 'bg-white/10'
                  }`}>
                    {posts.filter(p => p.tipoPost === tipo).length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Lista de posts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {postsFiltrados.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">No hay posts para mostrar</h3>
              <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                {filtroTipo === 'todos' 
                  ? 'Sé el primero en iniciar una conversación en este foro.'
                  : `No hay posts del tipo "${tiposPost[filtroTipo]}". Prueba con otros filtros.`
                }
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {postsFiltrados.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.005 }}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.5)] p-6 group will-change-transform"
                >
                  {/* Header del post */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
                          obtenerColorTipoPost(post.tipoPost)
                        }`}>
                          {obtenerIconoTipoPost(post.tipoPost)}
                          <span>{tiposPost[post.tipoPost]}</span>
                        </span>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-300">{post.autor.nombreEmpresa}</span>
                          {post.autor.verificado && (
                            <CheckCircle className="w-4 h-4 text-[#a1db87]" />
                          )}
                        </div>

                        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${
                          obtenerColorTamañoEmpresa(post.autor.tamañoEmpresa)
                        }`}>
                          {post.autor.tamañoEmpresa}
                        </span>
                      </div>
                      
                      <h3 className="text-lg lg:text-xl font-bold text-white leading-tight mb-3 group-hover:text-[#a1db87] transition-colors duration-300">
                        {post.titulo}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-500 ml-4">
                      {formatearFechaRelativa(post.createdAt)}
                    </div>
                  </div>

                  {/* Contenido del post */}
                  <p className="text-gray-300 leading-relaxed mb-4">{post.contenido}</p>

                  {/* Sectores de la empresa */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.autor.sectores.map(sector => (
                      <span key={sector} className="px-2 py-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 rounded-lg text-xs">
                        {sector}
                      </span>
                    ))}
                  </div>

                  {/* Información específica según el tipo de post */}
                  {post.tipoPost === 'busco_socios' && post.requisitos && (
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-4">
                      <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Requisitos para socios
                      </h4>
                      <div className="space-y-2 text-sm text-blue-300">
                        {post.requisitos.sectoresNecesarios?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-gray-400">Sectores necesarios:</span>
                            {post.requisitos.sectoresNecesarios.map(sector => (
                              <span key={sector} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs">{sector}</span>
                            ))}
                          </div>
                        )}
                        {post.requisitos.experienciaMinimaAnios > 0 && (
                          <div><span className="text-gray-400">Experiencia mínima:</span> {post.requisitos.experienciaMinimaAnios} años</div>
                        )}
                        {post.requisitos.paisesPreferidos?.length > 0 && (
                          <div><span className="text-gray-400">Países preferidos:</span> {post.requisitos.paisesPreferidos.join(', ')}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {post.tipoPost === 'ofrezco_servicios' && post.serviciosOfrecidos && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-4">
                      <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Servicios disponibles
                      </h4>
                      <div className="space-y-2 text-sm text-emerald-300">
                        {post.serviciosOfrecidos.sectoresEspecializados?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-gray-400">Especialidades:</span>
                            {post.serviciosOfrecidos.sectoresEspecializados.map(sector => (
                              <span key={sector} className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs">{sector}</span>
                            ))}
                          </div>
                        )}
                        {post.serviciosOfrecidos.rolPreferido && (
                          <div><span className="text-gray-400">Rol preferido:</span> {post.serviciosOfrecidos.rolPreferido}</div>
                        )}
                        <div><span className="text-gray-400">Disponibilidad:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-lg text-xs ${
                            post.serviciosOfrecidos.disponibilidad 
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {post.serviciosOfrecidos.disponibilidad ? 'Disponible' : 'No disponible'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Respuestas recientes */}
                  {post.respuestas.length > 0 && (
                    <div className="bg-[#2a2a2a]/50 rounded-xl p-4 mb-4">
                      <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Reply className="w-4 h-4" />
                        Respuestas recientes ({post.respuestas.length})
                      </h4>
                      <div className="space-y-3">
                        {post.respuestas.slice(0, 2).map((respuesta, idx) => (
                          <div key={idx} className="relative bg-[#1a1a1a] rounded-lg p-3 border border-[#2a2a2a]">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-3 h-3 text-gray-500" />
                                <span className="text-sm font-medium text-gray-300">{respuesta.empresa.nombreEmpresa}</span>
                                {respuesta.empresa.verificado && (
                                  <CheckCircle className="w-3 h-3 text-[#a1db87]" />
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{formatearFechaRelativa(respuesta.fechaRespuesta)}</span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">{respuesta.mensaje}</p>
                            {(() => {
                              const canDeleteReply = (typeof respuesta.canDeleteRespuesta !== 'undefined')
                                ? Boolean(respuesta.canDeleteRespuesta)
                                : Boolean(perfilEmpresa && respuesta.empresa && (String(respuesta.empresa._id || respuesta.empresa) === String(perfilEmpresa._id)));
                              if (!canDeleteReply) return null;
                              return (
                                <button
                                  className="absolute bottom-2 right-2 text-red-400 hover:text-red-500 opacity-80 p-1 rounded"
                                  onClick={async () => {
                                    const ok = confirm('¿Eliminar esta respuesta?');
                                    if (!ok) return;
                                    try {
                                      const actualizado = await eliminarRespuesta(post._id, respuesta._id || respuesta._id);
                                      setPosts(prev => prev.map(p => p._id === post._id ? actualizado : p));
                                    } catch (err) {
                                      console.error('Error al eliminar respuesta:', err);
                                    }
                                  }}
                                  title="Eliminar respuesta"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              );
                            })()}
                          </div>
                        ))}
                        {post.respuestas.length > 2 && (
                          <div className="text-center">
                            <button className="text-sm text-[#a1db87] hover:text-white transition-colors">
                              Ver todas las respuestas (+{post.respuestas.length - 2})
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer del post */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.numeroRespuestas} respuestas</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{post.empresasInteresadas?.length || 0} interesados</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>{post.vistas || 0} vistas</span>
                      </div>
                    </div>
                    {/* Botones de interés y responder eliminados para vista detalle */}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Modal para crear nuevo post */}
        <AnimatePresence>
          {mostrarFormulario && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setMostrarFormulario(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full p-6 shadow-2xl ${
                  perfilEmpresa && perfilEmpresa.success !== false ? 'max-w-5xl' : 'max-w-md'
                }`}
              >
                {/* Si no tiene perfil de empresa, mostrar mensaje */}
                {(!perfilEmpresa || perfilEmpresa.success === false) ? (
                  <>
                    <h3 className="text-xl font-bold text-white mb-4">Participar en el foro</h3>
                    <div className="space-y-4">
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-amber-400 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-400 mb-1">Perfil de empresa requerido</h4>
                            <p className="text-sm text-amber-300 leading-relaxed">
                              Para participar en el foro de colaboración, primero necesitas completar tu perfil de empresa con información sobre tus servicios y especialidades.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setMostrarFormulario(false);
                            navigate('/perfil-empresa');
                          }}
                          className="flex-1 bg-gradient-to-r from-[#a1db87] to-[#7cc85f] text-[#1a1a1a] py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-[#a1db87]/25 font-semibold transition-all duration-300"
                        >
                          Completar perfil
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setMostrarFormulario(false)}
                          className="flex-1 bg-[#2a2a2a] text-gray-300 py-3 px-4 rounded-xl hover:bg-[#333333] border border-[#2a2a2a] transition-all duration-300"
                        >
                          Cancelar
                        </motion.button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Si tiene perfil, mostrar formulario para crear post */
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Crear nuevo post</h3>
                      <button
                        onClick={() => setMostrarFormulario(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleCrearPost} className="space-y-4">
                      {/* Título del post - ancho completo */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Título del post *
                        </label>
                        <input
                          type="text"
                          value={formPost.titulo}
                          onChange={(e) => setFormPost(prev => ({ ...prev, titulo: e.target.value }))}
                          className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#a1db87] transition-colors"
                          placeholder="Describe brevemente tu propuesta o búsqueda"
                          required
                        />
                      </div>

                      {/* Grid de dos columnas */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Columna izquierda */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Tipo de post *
                            </label>
                            <select
                              value={formPost.tipoPost}
                              onChange={(e) => setFormPost(prev => ({ ...prev, tipoPost: e.target.value }))}
                              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-white focus:outline-none focus:border-[#a1db87] transition-colors"
                            >
                              <option value="busco_socios">Busco socios</option>
                              <option value="ofrezco_servicios">Ofrezco servicios</option>
                              <option value="consulta_tecnica">Consulta técnica</option>
                              <option value="informacion_general">Información general</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Presupuesto mín. (€)
                              </label>
                              <input
                                type="number"
                                value={formPost.presupuestoMin}
                                onChange={(e) => setFormPost(prev => ({ ...prev, presupuestoMin: e.target.value }))}
                                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#a1db87] transition-colors"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Presupuesto máx. (€)
                              </label>
                              <input
                                type="number"
                                value={formPost.presupuestoMax}
                                onChange={(e) => setFormPost(prev => ({ ...prev, presupuestoMax: e.target.value }))}
                                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#a1db87] transition-colors"
                                placeholder="Sin límite"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Fecha límite
                            </label>
                            <input
                              type="date"
                              value={formPost.fechaLimite}
                              onChange={(e) => setFormPost(prev => ({ ...prev, fechaLimite: e.target.value }))}
                              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-white focus:outline-none focus:border-[#a1db87] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Información de contacto
                            </label>
                            <input
                              type="text"
                              value={formPost.contactoInfo}
                              onChange={(e) => setFormPost(prev => ({ ...prev, contactoInfo: e.target.value }))}
                              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#a1db87] transition-colors"
                              placeholder="Email, teléfono, o método de contacto preferido"
                            />
                          </div>
                        </div>

                        {/* Columna derecha */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Descripción *
                            </label>
                            <textarea
                              value={formPost.contenido}
                              onChange={(e) => setFormPost(prev => ({ ...prev, contenido: e.target.value }))}
                              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#a1db87] transition-colors resize-none"
                              rows={6}
                              placeholder="Describe en detalle lo que buscas o ofreces..."
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Requisitos específicos
                            </label>
                            <textarea
                              value={formPost.requisitos}
                              onChange={(e) => setFormPost(prev => ({ ...prev, requisitos: e.target.value }))}
                              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#a1db87] transition-colors resize-none"
                              rows={4}
                              placeholder="Experiencia requerida, certificaciones, ubicación geográfica..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <motion.button
                          type="submit"
                          disabled={creandoPost}
                          whileHover={{ scale: creandoPost ? 1 : 1.05 }}
                          whileTap={{ scale: creandoPost ? 1 : 0.95 }}
                          className="flex-1 bg-gradient-to-r from-[#a1db87] to-[#7cc85f] text-[#1a1a1a] py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-[#a1db87]/25 font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {creandoPost ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Creando...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Publicar post
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setMostrarFormulario(false)}
                          className="px-6 py-3 bg-[#2a2a2a] text-gray-300 rounded-xl hover:bg-[#333333] border border-[#2a2a2a] transition-all duration-300"
                        >
                          Cancelar
                        </motion.button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal para responder post */}
        <AnimatePresence>
          {postRespuesta && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setPostRespuesta(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Responder a post</h3>
                  <button
                    onClick={() => setPostRespuesta(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Post original resumido */}
                <div className="bg-[#2a2a2a]/50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
                      obtenerColorTipoPost(postRespuesta.tipoPost)
                    }`}>
                      {obtenerIconoTipoPost(postRespuesta.tipoPost)}
                      <span>{tiposPost[postRespuesta.tipoPost]}</span>
                    </span>
                    <span className="text-sm text-gray-400">por {postRespuesta.autor.nombreEmpresa}</span>
                  </div>
                  <h4 className="font-bold text-white mb-2">{postRespuesta.titulo}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {postRespuesta.contenido.length > 200 
                      ? `${postRespuesta.contenido.substring(0, 200)}...`
                      : postRespuesta.contenido
                    }
                  </p>
                </div>

                {/* Formulario de respuesta */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tu respuesta
                    </label>
                    <textarea
                      value={respuestaTexto}
                      onChange={(e) => setRespuestaTexto(e.target.value)}
                      placeholder="Escribe tu respuesta al post..."
                      className="w-full min-h-[120px] bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-4 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none resize-none"
                      maxLength={1000}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {respuestaTexto.length}/1000 caracteres
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={enviarRespuesta}
                      disabled={!respuestaTexto.trim() || cargandoRespuesta}
                      className="flex-1 bg-gradient-to-r from-[#a1db87] to-[#7cc85f] text-[#1a1a1a] py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-[#a1db87]/25 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {cargandoRespuesta ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Reply className="w-4 h-4" />
                          Enviar respuesta
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPostRespuesta(null)}
                      className="flex-1 bg-[#2a2a2a] text-gray-300 py-3 px-4 rounded-xl hover:bg-[#333333] border border-[#2a2a2a] transition-all duration-300"
                    >
                      Cancelar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default ForumLicitacion;