import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../ui/ScrollToTop';
import NewsletterPrompt from '../ui/NewsletterPrompt';
import PageBackground from './PageBackground';
import PWAInstallPrompt from '../ui/PWAInstallPrompt'; // Añade esta importación

const Layout = ({ children }) => {
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          {children}
        </main>

        <Footer />
        <ScrollToTop />
        <NewsletterPrompt />
        <PWAInstallPrompt /> 
      </div>
    </PageBackground>
  );
};

export default Layout;