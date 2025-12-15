import React, { useEffect, useState } from "react";
import { getAllForumPosts, marcarFavorito, desmarcarFavorito, getFavoritos, responderPost, deleteForumPost } from '../services/forum';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Users, Award, MessageSquare, Info, Calendar, Building2, Heart, Reply, CheckCircle } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [favLoading, setFavLoading] = useState(null); // postId que está cargando favorito
  const [postRespondiendo, setPostRespondiendo] = useState(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [cargandoRespuesta, setCargandoRespuesta] = useState(false);
  const [errorRespuesta, setErrorRespuesta] = useState('');

  const { user } = useAuth();

  useEffect(() => {
      const handleDeletePost = async (postId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este post? Esta acción no se puede deshacer.')) return;
        try {
          await deleteForumPost(postId);
          setPosts((prev) => prev.filter(p => p._id !== postId));
        } catch (e) {
          alert(e.message || 'Error al eliminar el post');
        }
      };
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
        setError("Error al cargar los posts del foro.");
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

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
        setFavoritos(favoritos.filter(f => f !== postId));
      } else {
        await marcarFavorito(postId);
        setFavoritos([...favoritos, postId]);
      }
    } catch (e) {
      // Manejo de error opcional
    }
    setFavLoading(null);
  };

  const handleAbrirResponder = (postId) => {
    setPostRespondiendo(postId);
    setRespuestaTexto('');
    setErrorRespuesta('');
  };

  const handleEnviarRespuesta = async (postId) => {
    if (!respuestaTexto.trim()) return;
    setCargandoRespuesta(true);
    setErrorRespuesta('');
    try {
      const actualizado = await responderPost(postId, respuestaTexto.trim());
      setPosts((prev) => prev.map(p => p._id === postId ? actualizado : p));
      setPostRespondiendo(null);
      setRespuestaTexto('');
    } catch (e) {
      setErrorRespuesta(e.message || 'Error al responder el post');
    }
    setCargandoRespuesta(false);
  };

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
        <div className="space-y-8">
          {posts.map((post) => {
            const tipo = tipoPostInfo[post.tipoPost] || tipoPostInfo.informacion_general;
            return (
              <div key={post._id} className="bg-[#181818] border border-[#232323] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 group relative">
                                {/* Icono de papelera roja solo para el autor */}
                                {user && post.autor && post.autor.user === user._id && (
                                  <button
                                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors z-10"
                                    title="Eliminar post"
                                    onClick={() => handleDeletePost(post._id)}
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                )}
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
                    className={`flex items-center gap-2 text-xs ${favoritos.includes(post._id) ? 'text-pink-400' : 'text-gray-400'} transition-colors`}
                    onClick={() => toggleFavorito(post._id)}
                    disabled={favLoading === post._id}
                    title={favoritos.includes(post._id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <Heart className={`w-4 h-4 ${favoritos.includes(post._id) ? 'fill-pink-400' : ''}`} />
                    <span>{post.empresasInteresadas?.length || 0} interesados</span>
                  </button>
                  <button
                    className="px-3 py-1.5 text-emerald-400 border border-emerald-500/20 rounded-lg bg-[#181818] hover:bg-emerald-500/10 hover:text-emerald-300 transition-all duration-200 flex items-center gap-1 ml-2 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    aria-label="Responder a este post"
                    onClick={() => handleAbrirResponder(post._id)}
                  >
                    <Reply className="w-4 h-4" />
                    <span>Responder</span>
                  </button>
                </div>
                {/* Conversación y formulario de respuesta inline */}
                {postRespondiendo === post._id && (
                  <div className="mt-6 bg-[#202020] border border-emerald-900/20 rounded-xl p-4">
                    <div className="mb-4">
                      <div className="font-semibold text-emerald-300 mb-2 flex items-center gap-2"><Reply className="w-4 h-4" /> Conversación</div>
                      {post.respuestas && post.respuestas.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {post.respuestas.map((r, idx) => (
                            <div key={idx} className="bg-[#181818] rounded-lg p-3 border border-[#232323]">
                              <div className="flex items-center gap-2 mb-1">
                                <Building2 className="w-3 h-3 text-gray-500" />
                                <span className="text-xs font-medium text-gray-300">{r.empresa?.nombreEmpresa || 'Empresa'}</span>
                                {r.empresa?.verificado && <CheckCircle className="w-3 h-3 text-[#a1db87]" />}
                                <span className="text-xs text-gray-500 ml-2">{new Date(r.fechaRespuesta).toLocaleString('es-ES')}</span>
                              </div>
                              <div className="text-xs text-gray-400">{r.mensaje}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-xs">No hay respuestas aún.</div>
                      )}
                    </div>
                    <textarea
                      className="w-full min-h-[80px] bg-[#181818] border border-emerald-500/20 rounded-lg p-2 text-white placeholder-gray-500 focus:border-emerald-400 focus:outline-none resize-none mb-2"
                      placeholder="Escribe tu respuesta..."
                      value={respuestaTexto}
                      onChange={e => setRespuestaTexto(e.target.value)}
                      maxLength={1000}
                      disabled={cargandoRespuesta}
                    />
                    <div className="flex gap-2 items-center">
                      <button
                        className="px-4 py-2 bg-emerald-500 text-black rounded-lg font-semibold hover:bg-emerald-400 transition disabled:opacity-50"
                        onClick={() => handleEnviarRespuesta(post._id)}
                        disabled={cargandoRespuesta || !respuestaTexto.trim()}
                      >
                        {cargandoRespuesta ? 'Enviando...' : 'Enviar respuesta'}
                      </button>
                      <button
                        className="px-3 py-2 text-gray-400 hover:text-white text-xs"
                        onClick={() => setPostRespondiendo(null)}
                        disabled={cargandoRespuesta}
                      >
                        Cancelar
                      </button>
                      <span className="ml-auto text-xs text-gray-500">{respuestaTexto.length}/1000</span>
                    </div>
                    {errorRespuesta && <div className="text-red-400 text-xs mt-2">{errorRespuesta}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForumAllPosts;