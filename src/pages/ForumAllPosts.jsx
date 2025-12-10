import React, { useEffect, useState } from "react";
import axios from "axios";

const ForumAllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("/api/forum/posts");
        setPosts(res.data.data || []);
      } catch (err) {
        setError("Error al cargar los posts del foro.");
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <section className="max-w-4xl mx-auto mt-8 p-4 bg-gray-900 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-200">Todos los posts del foro</h2>
      {loading && <p className="text-gray-300">Cargando...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="text-gray-400">No hay posts en el foro.</p>
      )}
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post._id} className="bg-gray-800 p-4 rounded shadow hover:bg-gray-700 transition">
            <h3 className="text-lg font-semibold text-green-100">{post.titulo}</h3>
            <p className="text-gray-300 mb-2">{post.contenido}</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
              <span>
                <b>Autor:</b> {post.autor?.nombreEmpresa || "Desconocido"}
              </span>
              <span>
                <b>Tipo:</b> {post.tipoPost}
              </span>
              <span>
                <b>Fecha:</b> {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ForumAllPosts;