import { memo, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Mail, Phone, Linkedin, ArrowRight,
  CheckCircle, AlertCircle, FileText, Home, HelpCircle,
  Award, Target, Lightbulb, Building2, Send, ExternalLink, Bell
} from 'lucide-react';
import Container from '../ui/Container';
import { subscribeToNewsletter } from '../../services/newsletter';

const SocialLink = memo(({ icon, url, name }) => (
  <motion.a
    href={url}
    target="_blank"
    rel="noreferrer"
    className="cursor-pointer w-10 h-10 flex items-center justify-center bg-[#1a1a1a] border border-[#333333] rounded-lg hover:bg-[#a1db87] hover:border-[#a1db87] hover:text-[#1a1a1a] text-gray-400 transition-all duration-300 group"
    aria-label={name}
    whileHover={{ scale: 1.1, y: -3 }}
    whileTap={{ scale: 0.95 }}
  >
    {icon}
  </motion.a>
));

SocialLink.displayName = 'SocialLink';

const QuickLink = memo(({ name, path, icon: Icon }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === path;

  const handleNavigation = useCallback((path) => {
    if (location.pathname === path) return;
    navigate(path);
  }, [location.pathname, navigate]);

  return (
    <li>
      <motion.button
        onClick={() => handleNavigation(path)}
        className={`cursor-pointer w-full text-left flex items-center space-x-2 py-2 transition-colors ${
          isActive ? 'text-[#a1db87]' : 'text-gray-400 hover:text-[#a1db87]'
        }`}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span className="text-sm font-medium">{name}</span>
      </motion.button>
    </li>
  );
});

QuickLink.displayName = 'QuickLink';

const Footer = () => {
  const [footerEmail, setFooterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const footerSections = {
    plataforma: {
      title: 'Plataforma',
      links: [
        { name: 'Inicio', path: '/', icon: Home },
        { name: 'Licitaciones', path: '/licitaciones', icon: FileText },
        { name: 'Alertas', path: '/alertas', icon: Bell },
        { name: 'Servicios', path: '/servicios', icon: Award }
      ]
    },
    soporte: {
      title: 'Soporte',
      links: [
        { name: 'Centro de ayuda', path: '/ayuda', icon: HelpCircle },
        { name: 'Documentación', path: '/documentacion', icon: FileText },
        { name: 'Contacto', path: '/contacto', icon: Mail },
        { name: 'Estado del servicio', path: '/estado', icon: CheckCircle }
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Privacidad', path: '/privacidad' },
        { name: 'Términos de uso', path: '/terminos' },
        { name: 'Cookies', path: '/cookies' }
      ]
    }
  };

  const socialLinks = [
    { name: 'LinkedIn', icon: <Linkedin size={18} />, url: 'https://www.linkedin.com/company/evenor-tech/' }
  ];

  const handleNewsletterSubmit = useCallback(async (e) => {
    e.preventDefault();

    setSubscriptionStatus(null);
    setErrorMessage('');

    if (!footerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(footerEmail)) {
      setErrorMessage('Por favor, introduce un email válido');
      setSubscriptionStatus('error');
      return;
    }

    setIsSubmitting(true);

    try {
      await subscribeToNewsletter(footerEmail);
      setSubscriptionStatus('success');
      setFooterEmail('');
      setTimeout(() => setSubscriptionStatus(null), 5000);
    } catch (error) {
      setErrorMessage(error.message || 'Error al suscribirse');
      setSubscriptionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [footerEmail]);

  return (
    <footer className="relative bg-[#1a1a1a] text-white border-t border-[#2a2a2a] overflow-hidden">
      {/* Decoración sutil de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#a1db87]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#a1db87]/5 rounded-full blur-3xl" />
      </div>

      <Container className="pt-12 pb-6 relative z-10">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Columna 1: Logo y descripción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h3 className="text-lg font-bold text-white mb-4">
              Plataforma de <span className="text-[#a1db87]">Licitaciones</span>
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Búsqueda y análisis de licitaciones públicas en España con tecnología avanzada
            </p>

            {/* Valores */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-[#a1db87] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Transparencia</h4>
                  <p className="text-xs text-gray-500">Acceso abierto a información pública</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-[#a1db87] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Innovación</h4>
                  <p className="text-xs text-gray-500">Tecnología para facilitar oportunidades</p>
                </div>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="flex space-x-2">
              {socialLinks.map((link) => (
                <SocialLink key={link.name} {...link} />
              ))}
            </div>
          </motion.div>

          {/* Columna 2: Enlaces Plataforma */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              {footerSections.plataforma.title}
            </h3>
            <ul className="space-y-1">
              {footerSections.plataforma.links.map((link) => (
                <QuickLink key={link.name} {...link} />
              ))}
            </ul>
          </motion.div>

          {/* Columna 3: Enlaces Soporte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              {footerSections.soporte.title}
            </h3>
            <ul className="space-y-1">
              {footerSections.soporte.links.map((link) => (
                <QuickLink key={link.name} {...link} />
              ))}
            </ul>
          </motion.div>

          {/* Columna 4: Información de contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-400">
                <MapPin size={14} className="mr-2 mt-1 text-[#a1db87] flex-shrink-0" />
                <div className="text-xs">
                  <p>Av. de la República Argentina, 27</p>
                  <p>41011 Sevilla, España</p>
                </div>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail size={14} className="mr-2 text-[#a1db87] flex-shrink-0" />
                <a href="mailto:info@evenor-tech.com" className="text-xs hover:text-[#a1db87] transition-colors">
                  info@evenor-tech.com
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone size={14} className="mr-2 text-[#a1db87] flex-shrink-0" />
                <a href="tel:+34954151096" className="text-xs hover:text-[#a1db87] transition-colors">
                  +34 954 151 096
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 pb-8 border-b border-[#2a2a2a]"
        >
          <div className="max-w-md">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Recibe alertas de nuevas licitaciones y actualizaciones
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="flex-1 px-3 py-2 rounded-lg bg-[#2a2a2a] border border-[#333333] text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#a1db87] focus:border-[#a1db87] placeholder-gray-500"
                  disabled={isSubmitting}
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer bg-[#a1db87] hover:bg-[#8bc96a] text-[#1a1a1a] px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center"
                  aria-label="Suscribirse"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <motion.svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </motion.svg>
                  ) : (
                    <Send size={16} />
                  )}
                </motion.button>
              </div>

              {/* Mensajes de estado */}
              {subscriptionStatus === 'success' && (
                <motion.div
                  className="flex items-center px-3 py-2 bg-[#1e3a1a] border border-[#a1db87]/30 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <CheckCircle size={14} className="text-[#a1db87] mr-2 flex-shrink-0" />
                  <span className="text-[#a1db87] text-xs">¡Suscripción exitosa!</span>
                </motion.div>
              )}

              {subscriptionStatus === 'error' && (
                <motion.div
                  className="flex items-center px-3 py-2 bg-red-900/30 border border-red-800/30 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <AlertCircle size={14} className="text-red-400 mr-2 flex-shrink-0" />
                  <span className="text-red-400 text-xs">{errorMessage}</span>
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>

        {/* Copyright y enlaces legales */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="mb-3 sm:mb-0">
            © {currentYear} Plataforma de Licitaciones. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {footerSections.legal.links.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                className="cursor-pointer hover:text-[#a1db87] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </Container>
    </footer>
  );
};

export default Footer;