import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { Star, User, Send } from 'lucide-react';

// API endpoints
const API_URL = 'http://localhost:3007/api/reviews';


export default function ReviewsSection({ user }) {
  const [reviews, setReviews] = useState([]);
  const [confirmIdx, setConfirmIdx] = useState(null);
  const [deletedMsg, setDeletedMsg] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(() => setReviews([]));
  }, []);

  // Eliminar reseña (solo para admin)
  const isAdmin = user?.email === 's.gandia@evenor-tech.com';
  const handleDelete = idx => {
    setConfirmIdx(idx);
  };
  const confirmDelete = idx => {
    const newReviews = reviews.filter((_, i) => i !== idx);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newReviews));
    setReviews(newReviews);
    setConfirmIdx(null);
    setDeletedMsg(true);
    setTimeout(() => setDeletedMsg(false), 1800);
  };

  const [emailSent, setEmailSent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!user && !name.trim()) {
      setError('Debes poner un nombre');
      return;
    }
    if (!user && !email.trim()) {
      setError('Debes poner un email');
      return;
    }
    if (!user && !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Email no válido');
      return;
    }
    if (!text.trim()) {
      setError('La reseña no puede estar vacía');
      return;
    }
    if (rating < 1) {
      setError('Selecciona una puntuación');
      return;
    }
    setSubmitting(true);
    const review = {
      name: user?.name || name,
      email: user?.email || email,
      text,
      rating
    };
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      const data = await res.json();
      if (res.ok) {
        setEmailSent(true);
        setText('');
        setRating(0);
        setHoverRating(0);
        if (!user) setEmail('');
      } else {
        setError(data.error || 'Error al enviar reseña');
      }
    } catch {
      setError('Error de red');
    }
    setSubmitting(false);
  };

  // Animación de estrellas más fluida y elegante
  const starVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.25, rotate: -10, transition: { type: 'spring', stiffness: 200, damping: 12 } },
    selected: { scale: 1.18, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 12 } }
  };

  // Estadísticas
  const total = reviews.length;
  const avg = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(2) : '0.00';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between bg-[#232323] rounded-xl px-6 py-4 mb-8 border border-[#333333] shadow"
      >
        <div className="flex items-center gap-3">
          <span className="text-[#a1db87] font-bold text-lg">{total}</span>
          <span className="text-gray-400 text-sm">reseñas publicadas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#a1db87] font-bold text-lg">{avg}</span>
          <span className="text-gray-400 text-sm">/ 5 media</span>
        </div>
      </motion.div>

      {/* Mensaje de borrado */}
      <AnimatePresence>
        {deletedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 bg-[#232323] border border-[#a1db87] text-[#a1db87] px-6 py-3 rounded-xl shadow-lg z-50 font-bold text-lg"
          >
            Reseña eliminada
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crear reseña */}
      <AnimatePresence>
        {emailSent && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 bg-[#232323] border border-[#a1db87] text-[#a1db87] px-6 py-3 rounded-xl shadow-lg z-50 font-bold text-lg"
          >
            Para publicar tu reseña, confirma tu email.<br />
            <span className="text-[#a1db87]">Revisa tu Gmail y haz clic en el enlace de confirmación.</span>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#232323] rounded-2xl p-8 border border-[#333333] shadow-lg mb-12"
      >
        <h2 className="text-2xl font-bold text-[#a1db87] mb-4 flex items-center gap-2">
          <Send className="w-6 h-6" /> Escribe tu reseña
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {!user && (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[#181818] border border-[#333333] text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#a1db87]"
                  placeholder="Tu nombre"
                  maxLength={32}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[#181818] border border-[#333333] text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#a1db87]"
                  placeholder="Tu email"
                  maxLength={64}
                  required
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Reseña</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#181818] border border-[#333333] text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#a1db87]"
              rows={4}
              maxLength={400}
              placeholder="¿Qué te ha parecido la plataforma?"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Puntuación</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(star => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  variants={starVariants}
                  initial="initial"
                  animate={hoverRating === star ? 'hover' : rating === star ? 'selected' : 'initial'}
                  className="focus:outline-none"
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  <Star className={`w-9 h-9 ${star <= (hoverRating || rating) ? 'text-[#a1db87]' : 'text-gray-600'}`} fill={star <= (hoverRating || rating) ? '#a1db87' : 'none'} />
                </motion.button>
              ))}
            </div>
          </div>
          {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#a1db87] text-[#181818] font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-[#8bc96a] transition-all w-full mt-2"
          >
            {submitting ? 'Enviando...' : 'Publicar reseña'}
          </motion.button>
        </form>
      </motion.div>

      {/* Ver reseñas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-[#232323] rounded-2xl p-8 border border-[#333333] shadow-lg"
      >
        <h2 className="text-2xl font-bold text-[#a1db87] mb-8 flex items-center gap-2">
          <User className="w-6 h-6" /> Reseñas de usuarios
        </h2>
        <div className="space-y-8">
          {reviews.length === 0 ? (
            <div className="text-gray-400 text-center py-8">Todavía no hay reseñas. ¡Sé el primero en opinar!</div>
          ) : (
            reviews.map((r, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-[#181818] rounded-xl p-6 border border-[#333333] shadow flex flex-col relative"
              >
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-[#a1db87]" />
                  <span className="font-bold text-white text-base">{r.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{r.email}</span>
                  <span className="text-xs text-gray-500 ml-auto">{new Date(r.date).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className={`w-5 h-5 ${star <= r.rating ? 'text-[#a1db87]' : 'text-gray-600'}`} fill={star <= r.rating ? '#a1db87' : 'none'} />
                  ))}
                </div>
                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">{r.text}</p>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(idx)}
                    className="absolute top-4 right-4 bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg shadow transition-all"
                    title="Eliminar reseña"
                  >
                    Eliminar
                  </button>
                )}
                {isAdmin && confirmIdx === idx && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute top-12 right-4 bg-[#232323] border border-[#a1db87] rounded-lg shadow-lg p-4 z-10 flex flex-col items-center"
                  >
                    <span className="text-[#a1db87] font-bold mb-2">¿Seguro que quieres eliminar?</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmDelete(idx)}
                        className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg shadow"
                      >Sí, eliminar</button>
                      <button
                        onClick={() => setConfirmIdx(null)}
                        className="bg-[#a1db87] text-[#181818] text-xs px-3 py-1 rounded-lg shadow"
                      >Cancelar</button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
