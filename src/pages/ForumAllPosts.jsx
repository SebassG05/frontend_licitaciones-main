import React, { useEffect, useState, useRef } from "react";
import { getAllForumPosts, marcarFavorito, desmarcarFavorito, getFavoritos, responderPost, deleteForumPost, eliminarRespuesta } from '../services/forum';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PremiumPopup from '../components/ui/PremiumPopup';
import RegisterCompanyPopup from '../components/ui/RegisterCompanyPopup';
import { Users, Award, MessageSquare, Info, Calendar, Building2, Heart, Reply, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForumAllPosts = () => {
    // Colores y etiquetas por tipo de post
    const tipoPostInfo = {
      busco_socios: {
        label: 'Buscan socios',
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        icon: <Users className="w-4 h-4" />
      },
      ofrezco_servicios: {
        label: 'Ofrecen servicios',
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        icon: <Award className="w-4 h-4" />
      },
      consulta_tecnica: {
        label: 'Consulta técnica',
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        icon: <MessageSquare className="w-4 h-4" />
      },
      informacion_general: {
        label: 'Información general',
        color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        icon: <Info className="w-4 h-4" />
      }
    };
  const [posts, setPosts] = useState([]);
  const [modalDelete, setModalDelete] = useState({ open: false, postId: null });
  const [modalDeleteRespuesta, setModalDeleteRespuesta] = useState({ open: false, postId: null, respuestaId: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [favLoading, setFavLoading] = useState(null); // postId que está cargando favorito
  const [postRespondiendo, setPostRespondiendo] = useState(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [respuestaPadreId, setRespuestaPadreId] = useState(null);
  const [cargandoRespuesta, setCargandoRespuesta] = useState(false);
  const [errorRespuesta, setErrorRespuesta] = useState('');
  const textareaRef = useRef(null);
  // Estado para el modal de error al eliminar post
  const [modalError, setModalError] = useState({ open: false, message: '' });
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [showRegisterCompanyPopup, setShowRegisterCompanyPopup] = useState(false);

  const { user, isAuthenticated } = useAuth();

  // Modal de confirmación para borrar post
  const handleDeletePost = async (postId) => {
    try {
      await deleteForumPost(postId);
      setPosts((prev) => prev.filter(p => p._id !== postId));
      setModalDelete({ open: false, postId: null });
    } catch (e) {
      setModalError({ open: true, message: e.message || 'Error al eliminar el post' });
      setModalDelete({ open: false, postId: null });
    }
  };

  const handleDeleteRespuesta = async (postId, respuestaId) => {
    try {
      const actualizado = await eliminarRespuesta(postId, respuestaId);
      setPosts((prev) => prev.map(p => p._id === postId ? actualizado : p));
      setModalDeleteRespuesta({ open: false, postId: null, respuestaId: null });
    } catch (e) {
      setModalError({ open: true, message: e.message || 'Error al eliminar la respuesta' });
      setModalDeleteRespuesta({ open: false, postId: null, respuestaId: null });
    }
  };

  useEffect(() => {
    // Mostrar inmediatamente el popup premium si el usuario no está autenticado.
    // Usuarios autenticados pueden acceder (aunque no sean premium).
    const shouldShowPremium = !isAuthenticated;
    setShowPremiumPopup(shouldShowPremium);

    // Si no está autenticado, bloquear la vista
    if (shouldShowPremium) return;

    // Verificar si el usuario tiene empresa registrada
    const hasCompany = user && (user.empresa || user.empresaProfileId);
    if (!hasCompany) {
      setShowRegisterCompanyPopup(true);
      return;
    }

    // Si llega aquí, el usuario está autenticado y tiene empresa, cargar posts
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const posts = await getAllForumPosts();
        setPosts(posts);
        // Cargar favoritos del usuario
        const favs = await getFavoritos();
        setFavoritos(favs.map(f => f._id));
      } catch (err) {
        // Si el backend indica que el usuario no tiene acceso por falta de suscripción
        const msg = (err && err.message) ? err.message : '';
        const isPremiumError = (err && err.status === 403) || /premium/.test(msg.toLowerCase());
        if (isPremiumError) {
          setShowPremiumPopup(true);
          setError('');
        } else {
          setError("Error al cargar los posts del foro.");
        }
      }
      setLoading(false);
    };
    fetchPosts();
  }, [isAuthenticated, user]);

  const toggleFavorito = async (postId) => {
    setFavLoading(postId);
    try {
      setPosts((prevPosts) => prevPosts.map(post => {
        if (post._id === postId) {
          const yaEsFavorito = favoritos.includes(postId);
          const count = post.empresasInteresadas?.length || 0;
          return {
            ...post,
            empresasInteresadas: yaEsFavorito
              ? (count > 0 ? Array(count - 1).fill('fake') : [])
              : Array(count + 1).fill('fake')
          };
        }
        return post;
      }));
      if (favoritos.includes(postId)) {
        await desmarcarFavorito(postId);
        setFavoritos(prev => prev.filter(f => f !== postId));
      } else {
        await marcarFavorito(postId);
        setFavoritos(prev => [...prev, postId]);
      }
    } catch (e) {
      // Manejo de error opcional
    }
    setFavLoading(null);
  };

  const handleAbrirResponder = (postId, respuestaId = null) => {
    setPostRespondiendo(postId);
    setRespuestaPadreId(respuestaId);
    setRespuestaTexto('');
    setErrorRespuesta('');
  };

  useEffect(() => {
    if (postRespondiendo) {
      // Pequeño retraso para esperar animación y luego enfocar
      setTimeout(() => textareaRef.current?.focus(), 120);
    }
  }, [postRespondiendo, respuestaPadreId]);

  const handleEnviarRespuesta = async (postId) => {
    if (!respuestaTexto.trim()) return;
    setCargandoRespuesta(true);
    setErrorRespuesta('');
    try {
      const actualizado = await responderPost(postId, respuestaTexto.trim(), respuestaPadreId);
      setPosts((prev) => prev.map(p => p._id === postId ? actualizado : p));
      setPostRespondiendo(null);
      setRespuestaPadreId(null);
      setRespuestaTexto('');
    } catch (e) {
      setErrorRespuesta(e.message || 'Error al responder el post');
    }
    setCargandoRespuesta(false);
  };

  const postsSorted = [...posts].sort((a, b) => {
    const aFav = favoritos.includes(a._id) ? 1 : 0;
    const bFav = favoritos.includes(b._id) ? 1 : 0;
    return (bFav - aFav) || (new Date(b.createdAt) - new Date(a.createdAt));
  });

  if (showRegisterCompanyPopup) {
    return (
      <RegisterCompanyPopup
        isOpen={true}
        onClose={() => setShowRegisterCompanyPopup(false)}
      />
    );
  }

  if (showPremiumPopup) {
    return (
      <PremiumPopup
        isOpen={true}
        onClose={() => setShowPremiumPopup(false)}
        onLoginClick={() => window.dispatchEvent(new CustomEvent('openLogin'))}
      />
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-16">
      <div className="max-w-5xl mx-auto pt-10 px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow">Todos los posts del foro</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Explora todas las conversaciones, ofertas y búsquedas de socios publicadas por empresas en la plataforma.</p>
        </div>
        {loading && <div className="text-center py-10 text-gray-300 animate-pulse">Cargando...</div>}
        {error && <div className="text-center py-10 text-red-400 font-semibold">{error}</div>}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-10 text-gray-400">No hay posts en el foro.</div>
        )}
        {/* Modal de error al eliminar post */}
        <AnimatePresence>
          {modalError.open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
              onClick={() => setModalError({ open: false, message: '' })}
            >
              <motion.div
                initial={{ scale: 0.95, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 40, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={e => e.stopPropagation()}
                className="bg-[#181818] border border-red-500/30 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <Info className="w-10 h-10 text-red-400 mb-2" />
                  <h2 className="text-xl font-bold text-white mb-2">No se puede eliminar el post</h2>
                  <p className="text-gray-300 mb-4">{modalError.message}</p>
                  <button
                    className="px-6 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-200 shadow cursor-pointer"
                    onClick={() => setModalError({ open: false, message: '' })}
                  >
                    Aceptar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-8">
          {postsSorted.map((post) => {
            const tipo = tipoPostInfo[post.tipoPost] || tipoPostInfo.informacion_general;
            // Preferir la bandera `canDelete` enviada por el backend si existe
            const isAuthor = (typeof post.canDelete !== 'undefined')
              ? Boolean(post.canDelete)
              : Boolean(user && post.autor && (
                (post.autor.user && String(post.autor.user) === String(user._id)) ||
                (post.autor._id && String(post.autor._id) === String(user._id)) ||
                (post.autor._id && user.empresa && String(post.autor._id) === String(user.empresa._id)) ||
                (post.autor._id && user.empresaProfileId && String(post.autor._id) === String(user.empresaProfileId))
              ));

            return (
              <div key={post._id} className="bg-[#181818] border border-[#232323] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 group relative">
                                {/* Icono de papelera roja solo para el autor */}
                {isAuthor && (
                  <button
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors z-10 cursor-pointer"
                    title="Eliminar post"
                    onClick={() => setModalDelete({ open: true, postId: post._id })}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                      {/* Modal de confirmación para borrar post */}
                      <AnimatePresence>
                        {modalDelete.open && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                            onClick={() => setModalDelete({ open: false, postId: null })}
                          >
                            <motion.div
                              initial={{ scale: 0.95, y: 40, opacity: 0 }}
                              animate={{ scale: 1, y: 0, opacity: 1 }}
                              exit={{ scale: 0.95, y: 40, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                              onClick={e => e.stopPropagation()}
                              className="bg-[#181818] border border-red-500/30 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
                            >
                              <div className="flex flex-col items-center gap-3">
                                <Trash2 className="w-10 h-10 text-red-400 mb-2" />
                                <h2 className="text-xl font-bold text-white mb-2">¿Eliminar post?</h2>
                                <p className="text-gray-300 mb-4">¿Seguro que quieres borrar este post? <span className="text-red-400 font-semibold">Esta acción no se puede deshacer.</span></p>
                                <div className="flex gap-4 justify-center mt-2">
                                  <button
                                    className="cursor-pointer px-6 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-200 shadow"
                                    onClick={() => handleDeletePost(modalDelete.postId)}
                                  >
                                    Sí, borrar
                                  </button>
                                  <button
                                    className="px-6 py-2 rounded-xl bg-[#232323] text-gray-300 font-semibold hover:bg-[#333] border border-[#333] transition-all duration-200 cursor-pointer"
                                    onClick={() => setModalDelete({ open: false, postId: null })}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {/* Modal de confirmación para borrar respuesta */}
                      <AnimatePresence>
                        {modalDeleteRespuesta.open && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                            onClick={() => setModalDeleteRespuesta({ open: false, postId: null, respuestaId: null })}
                          >
                            <motion.div
                              initial={{ scale: 0.95, y: 40, opacity: 0 }}
                              animate={{ scale: 1, y: 0, opacity: 1 }}
                              exit={{ scale: 0.95, y: 40, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                              onClick={e => e.stopPropagation()}
                              className="bg-[#181818] border border-red-500/30 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
                            >
                              <div className="flex flex-col items-center gap-3">
                                <Trash2 className="w-10 h-10 text-red-400 mb-2" />
                                <h2 className="text-xl font-bold text-white mb-2">¿Eliminar respuesta?</h2>
                                <p className="text-gray-300 mb-4">¿Seguro que quieres borrar esta respuesta? <span className="text-red-400 font-semibold">Esta acción no se puede deshacer.</span></p>
                                <div className="flex gap-4 justify-center mt-2">
                                  <button
                                    className="cursor-pointer px-6 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-200 shadow"
                                    onClick={() => handleDeleteRespuesta(modalDeleteRespuesta.postId, modalDeleteRespuesta.respuestaId)}
                                  >
                                    Sí, borrar
                                  </button>
                                  <button
                                    className="px-6 py-2 rounded-xl bg-[#232323] text-gray-300 font-semibold hover:bg-[#333] border border-[#333] transition-all duration-200 cursor-pointer"
                                    onClick={() => setModalDeleteRespuesta({ open: false, postId: null, respuestaId: null })}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-2 ${tipo.color}`}>
                    {tipo.icon}
                    <span>{tipo.label}</span>
                  </span>
                  <span className="px-2 py-1 rounded-lg text-xs font-medium border bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-300 border-green-500/20 flex items-center gap-1">
                    <Building2 className="w-4 h-4 mr-1" />
                    {post.autor?.nombreEmpresa || "Empresa desconocida"}
                  </span>
                  <span className="px-2 py-1 rounded-lg text-xs font-medium border bg-gray-500/10 text-gray-400 border-gray-500/20">
                    {new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#a1db87] transition-colors duration-200">{post.titulo}</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{post.contenido}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-2">
                  {post.autor?.sectores?.map((sector) => (
                    <span key={sector} className="px-2 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg text-xs">{sector}</span>
                  ))}
                </div>
                <div className="flex items-center gap-6 pt-4 border-t border-[#232323] mt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Reply className="w-4 h-4" />
                    <span>{post.numeroRespuestas || 0} respuestas</span>
                  </div>
                  <button
                    className={`flex items-center gap-2 text-xs ${favoritos.includes(post._id) ? 'text-pink-400' : 'text-gray-400'} transition-colors cursor-pointer`}
                    onClick={() => toggleFavorito(post._id)}
                    disabled={favLoading === post._id}
                    title={favoritos.includes(post._id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <Heart className={`w-4 h-4 ${favoritos.includes(post._id) ? 'fill-pink-400' : ''}`} />
                    <span>{post.empresasInteresadas?.length || 0} interesados</span>
                  </button>
                  <button
                    className="px-3 py-1.5 text-emerald-400 border border-emerald-500/20 rounded-lg bg-[#181818] hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-200 flex items-center gap-1 ml-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
                    aria-label="Responder a este post"
                    onClick={() => handleAbrirResponder(post._id)}
                  >
                    <Reply className="w-4 h-4" />
                    <span>Responder</span>
                  </button>
                </div>
                {/* Conversación y formulario de respuesta inline animados */}
                <AnimatePresence initial={false}>
                  {postRespondiendo === post._id && (
                    <motion.div
                      key="conversacion-respuesta"
                      initial={{ opacity: 0, y: 30, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: 30, height: 0 }}
                      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                      className="mt-6 bg-[#202020] border border-emerald-900/20 rounded-xl p-4 overflow-hidden"
                    >
                      <div className="mb-4">
                        <div className="font-semibold text-emerald-300 mb-2 flex items-center gap-2"><Reply className="w-4 h-4" /> Conversación</div>
                        {post.respuestas && post.respuestas.length > 0 ? (
                          <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                            {/* Renderizar respuestas en árbol: primero los que no tienen parentRespuesta */}
                            {(() => {
                              const respuestas = post.respuestas || [];
                              const mapChildren = (parentId) => {
                                return respuestas.filter(rr => {
                                  if (!parentId) return !rr.parentRespuesta;
                                  return rr.parentRespuesta && String(rr.parentRespuesta) === String(parentId);
                                });
                              };

                              const renderReply = (r, level = 0) => {
                                // DEBUG: inspeccionar flag de borrado por respuesta
                                try { console.log('DEBUG renderReply:', { replyId: r._id, canDeleteRespuesta: r.canDeleteRespuesta, empresa: r.empresa }); } catch(e){}
                                const children = mapChildren(r._id);
                                return (
                                  <div key={r._id} className={`relative bg-[#181818] rounded-lg p-3 border border-[#232323] ${level > 0 ? 'ml-4' : ''} ${r._id === respuestaPadreId ? 'ring-2 ring-emerald-500/30 bg-emerald-900/5' : ''}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Building2 className="w-3 h-3 text-gray-500" />
                                      <span className="text-xs font-medium text-gray-300">{r.empresa?.nombreEmpresa || 'Empresa'}</span>
                                      {r.empresa?.verificado && <CheckCircle className="w-3 h-3 text-[#a1db87]" />}
                                      <span className="text-xs text-gray-500 ml-2">{new Date(r.fechaRespuesta).toLocaleString('es-ES')}</span>
                                      <button
                                        className="ml-auto text-xs text-emerald-400 hover:underline cursor-pointer"
                                        onClick={() => handleAbrirResponder(post._id, r._id)}
                                      >
                                        Responder
                                      </button>
                                    </div>
                                    {/* Botón eliminar discreto en la esquina superior derecha */}
                                    {(() => {
                                      const canDeleteReply = (typeof r.canDeleteRespuesta !== 'undefined')
                                        ? Boolean(r.canDeleteRespuesta)
                                        : Boolean(user && r.empresa && (String(r.empresa._id) === String(user?.empresa?._id) || String(r.empresa._id) === String(user?.empresaProfileId)));
                                      return canDeleteReply ? (
                                        <button
                                          className="absolute bottom-2 right-2 text-red-400 hover:text-red-500 opacity-70 hover:opacity-100 p-1 rounded cursor-pointer"
                                          onClick={() => setModalDeleteRespuesta({ open: true, postId: post._id, respuestaId: r._id })}
                                          title="Eliminar respuesta"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      ) : null;
                                    })()}
                                    <div className="text-xs text-gray-400">{r.mensaje}</div>
                                    {children.length > 0 && (
                                      <div className="mt-2 space-y-2">
                                        {children.map(child => renderReply(child, level + 1))}
                                      </div>
                                    )}
                                  </div>
                                );
                              };

                              const topLevel = mapChildren(null);
                              if (topLevel.length === 0) return <div className="text-gray-500 text-xs">No hay respuestas aún.</div>;
                              return topLevel.map(r => renderReply(r, 0));
                            })()}
                          </div>
                        ) : (
                          <div className="text-gray-500 text-xs">No hay respuestas aún.</div>
                        )}
                      </div>
                      {/* Vista previa del comentario al que se responde (si aplica) */}
                      <AnimatePresence>
                        {respuestaPadreId && (() => {
                          const padre = post.respuestas.find(rr => String(rr._id) === String(respuestaPadreId));
                          if (!padre) return null;
                          return (
                            <motion.div
                              key="preview-parent"
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.18 }}
                              className="mb-2 border-l-4 border-emerald-500/40 bg-emerald-900/5 rounded-lg p-3 text-xs text-gray-200"
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1">
                                  <div className="font-medium text-emerald-300">Respondiendo a {padre.empresa?.nombreEmpresa || 'Empresa'}</div>
                                  <div className="text-gray-300 truncate">{padre.mensaje}</div>
                                </div>
                                <button
                                  className="text-xs text-gray-400 hover:text-white ml-3"
                                  onClick={() => setRespuestaPadreId(null)}
                                  aria-label="Cancelar respuesta específica"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </motion.div>
                          );
                        })()}
                      </AnimatePresence>

                      <motion.textarea
                        ref={textareaRef}
                        className="w-full min-h-[80px] bg-[#181818] border border-emerald-500/20 rounded-lg p-2 text-white placeholder-gray-500 focus:border-emerald-400 focus:outline-none resize-none mb-2"
                        placeholder={respuestaPadreId ? 'Escribe tu respuesta (respondiendo)...' : 'Escribe tu respuesta...'}
                        value={respuestaTexto}
                        onChange={e => setRespuestaTexto(e.target.value)}
                        maxLength={1000}
                        disabled={cargandoRespuesta}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25 }}
                      />
                      <div className="flex gap-2 items-center">
                        <button
                          className="px-4 py-2 bg-emerald-500 text-black rounded-lg font-semibold hover:bg-emerald-400 transition disabled:opacity-50 cursor-pointer"
                          onClick={() => handleEnviarRespuesta(post._id)}
                          disabled={cargandoRespuesta || !respuestaTexto.trim()}
                        >
                          {cargandoRespuesta ? 'Enviando...' : 'Enviar respuesta'}
                        </button>
                        <button
                          className="px-3 py-2 text-gray-400 hover:text-white text-xs cursor-pointer"
                          onClick={() => setPostRespondiendo(null)}
                          disabled={cargandoRespuesta}
                        >
                          Cancelar
                        </button>
                        <span className="ml-auto text-xs text-gray-500">{respuestaTexto.length}/1000</span>
                      </div>
                      {errorRespuesta && <div className="text-red-400 text-xs mt-2">{errorRespuesta}</div>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        {/* Premium Popup fuera del contenedor */}
        <PremiumPopup
          isOpen={showPremiumPopup}
          onClose={() => setShowPremiumPopup(false)}
          onLoginClick={() => {
            window.dispatchEvent(new CustomEvent('openLogin'));
          }}
        />
      </div>
    </div>
  );
};

export default ForumAllPosts;