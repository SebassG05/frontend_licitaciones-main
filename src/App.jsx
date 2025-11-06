import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';

// Importación de páginas
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Profile = lazy(() => import('./pages/Profile'));
const Configuration = lazy(() => import('./pages/Configuration'));
const NotFound = lazy(() => import('./pages/NotFound')); // Nueva importación

// Componente de carga
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-transparent">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a1db87]"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/servicios" element={<Services />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/configuracion" element={<Configuration />} />
              {/* Ruta catch-all para 404 - debe ir al final */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;