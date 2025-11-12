import { lazy, Suspense, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import TargetAudienceSection from '../components/home/TargetAudience';
import ReviewsPromoSection from '../components/home/ReviewsPromoSection';

// Carga lazy de componentes no críticos para optimizar el rendimiento
const FeaturesSection = lazy(() => import('../components/home/FeaturesSection'));
const HowItWorksSection = lazy(() => import('../components/home/HowItWorksSection'));
const CTASection = lazy(() => import('../components/home/CTASection'));

// Componente de carga mejorado con diseño responsive
const SectionLoader = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-8 sm:py-12 md:py-16 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="relative h-1.5 sm:h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-[#a1db87]"
            initial={{ width: 0 }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>
        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3">
          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-t-2 border-b-2 border-[#a1db87]"></div>
          <p className="text-[#a1db87] text-xs sm:text-sm font-medium">
            Cargando contenido...
          </p>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: isMobile ? 5 : 10
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        when: "beforeChildren",
        staggerChildren: isMobile ? 0.05 : 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: isMobile ? 0.2 : 0.3
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home-page"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="overflow-hidden"
      >
        {/* Sección héroe - carga inmediata */}
        <HeroSection />

        {/* Sección de audiencia objetivo - carga inmediata */}
        <TargetAudienceSection />

        {/* Sección de reseñas promocional */}
        <ReviewsPromoSection />

        {/* Secciones con carga diferida */}
        <Suspense fallback={<SectionLoader />}>
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <HowItWorksSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <CTASection />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;