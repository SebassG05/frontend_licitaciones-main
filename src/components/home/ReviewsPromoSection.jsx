import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function ReviewsPromoSection() {
  return (
    <motion.section
      className="bg-[#232323] rounded-2xl p-8 my-12 mx-auto max-w-3xl border border-[#333333] shadow-lg flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, type: 'spring', bounce: 0.25 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Star className="w-8 h-8 text-[#a1db87]" fill="#a1db87" />
        <h2 className="text-2xl font-bold text-[#a1db87]">Opiniones y Reseñas de Usuarios</h2>
      </div>
      <p className="text-gray-300 text-lg mb-6">
        Descubre cómo las reseñas ayudan a mejorar Licitanor. Tu opinión nos permite crecer, adaptar la plataforma a tus necesidades y dar confianza a nuevos usuarios. ¡Comparte tu experiencia y haz Licitanor mejor para todos!
      </p>
      <Link
        to="/reseñas"
        className="inline-block bg-[#a1db87] text-[#181818] font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-[#8bc96a] transition-all text-lg"
      >
        Ver y publicar reseñas
      </Link>
    </motion.section>
  );
}
