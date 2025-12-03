import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ReseñasConfirmar() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`https://dtas.evenor-tech.com/api/reviews/confirm/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSuccess(true);
        } else {
          setError(data.error || 'Error al confirmar la reseña');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error de red');
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#232323] rounded-2xl p-8 border border-[#a1db87] shadow-lg max-w-md w-full text-center"
      >
        {loading ? (
          <div className="text-[#a1db87] text-xl font-bold">Confirmando reseña...</div>
        ) : success ? (
          <>
            <div className="text-3xl font-bold text-[#a1db87] mb-4">¡Reseña confirmada!</div>
            <div className="text-gray-300 mb-6">Muchas gracias por tu opinión.<br />Tu reseña ya está publicada y ayuda a otros usuarios.</div>
            <button
              onClick={() => navigate('/')}
              className="bg-[#a1db87] text-[#181818] font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-[#8bc96a] transition-all"
            >Volver al inicio</button>
          </>
        ) : (
          <div className="text-red-400 text-lg font-bold">{error}</div>
        )}
      </motion.div>
    </div>
  );
}
