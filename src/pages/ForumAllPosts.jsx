import React, { useEffect, useState } from "react";
import { getAllForumPosts } from '../services/forum';
import { Users, Award, MessageSquare, Info, Calendar, Building2, Heart, Reply } from 'lucide-react';

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

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const posts = await getAllForumPosts();
        setPosts(posts);
      } catch (err) {
        setError("Error al cargar los posts del foro.");
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

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
              <div key={post._id} className="bg-[#181818] border border-[#232323] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 group">
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
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Heart className="w-4 h-4" />
                    <span>{post.empresasInteresadas?.length || 0} interesados</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForumAllPosts;