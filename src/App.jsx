import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import TermsOfUse from './components/ui/TermsOfUse';
import PrivacyPolicy from './components/ui/PrivacyPolicy';
import CookiesPolicy from './components/ui/CookiesPolicy';
import BorradorPropuestasPage from './pages/BorradorPropuestasPage';
import BorradorWizard from './pages/BorradorWizard';
import Layout from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';

import { useEffect, useState } from 'react';
import CookiesModal from './components/ui/CookiesModal';

// Importación de páginas
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Profile = lazy(() => import('./pages/Profile'));
const Configuration = lazy(() => import('./pages/Configuration'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Licitaciones = lazy(() => import('./pages/Licitaciones'));
const NewsletterPage = lazy(() => import('./pages/NewsletterPage'));
const UnsubscribePage = lazy(() => import('./pages/UnsubscribePage'));
const NewsletterPreferences = lazy(() => import('./components/newsletter/NewsletterPreferences'));
const Ayuda = lazy(() => import('./pages/Ayuda'));
const Documentacion = lazy(() => import('./pages/Documentacion'));
const Reseñas = lazy(() => import('./pages/Reseñas'));
const ReseñasConfirmar = lazy(() => import('./pages/ReseñasConfirmar'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Componente de carga
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-transparent">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a1db87]"></div>
  </div>
);

function App() {
  const COOKIE_KEY = 'licitaciones_cookies_pref';
  const [showCookiesModal, setShowCookiesModal] = useState(false);

  useEffect(() => {
    const cookiesPref = localStorage.getItem(COOKIE_KEY);
    if (!cookiesPref) {
      setShowCookiesModal(true);
    }
  }, []);

  const handleCloseCookiesModal = () => {
    setShowCookiesModal(false);
  };

  return (
    <Router>
      <AuthProvider>
        <Layout>
          {showCookiesModal && (
            <CookiesModal open={showCookiesModal} onClose={handleCloseCookiesModal} />
          )}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/servicios" element={<Services />} />
              <Route path="/licitaciones" element={<Licitaciones />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/reseñas/confirmar/:token" element={<ReseñasConfirmar />} />
              <Route path="/configuracion" element={<Configuration />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
              <Route path="/newsletter/unsubscribe" element={<UnsubscribePage />} />
              <Route path="/newsletter/preferences" element={<NewsletterPreferences />} />
              <Route path="/ayuda" element={<Ayuda />} />
              <Route path="/documentacion" element={<Documentacion />} />
              <Route path="/reseñas" element={<Reseñas />} />
              <Route path="/borrador-propuestas" element={<BorradorPropuestasPage />} />
              <Route path="/borrador-propuesta" element={<BorradorPropuestasPage />} />
              <Route path="/borrador-propuestas/nuevo" element={<BorradorWizard />} />
              <Route path="/terminos" element={<TermsOfUse />} />
              <Route path="/privacidad" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiesPolicy />} />
              {/* Ruta catch-all para 404 - debe ir al final */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;