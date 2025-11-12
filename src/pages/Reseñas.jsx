import Container from '../components/ui/Container';
import ReviewsSection from '../components/reviews/ReviewsSection';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Reseñas = () => {
  const { user } = useAuth();
  return (
    <Container className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-[#181818] border border-[#232323] rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-4xl font-black text-white mb-8 text-center">
          Opiniones y Reseñas de Usuarios
        </h1>
        <ReviewsSection user={user} />
      </motion.div>
    </Container>
  );
};

export default Reseñas;
