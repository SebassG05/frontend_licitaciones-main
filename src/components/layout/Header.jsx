import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, ChevronDown, LogIn, User, Search,
    Bell, Download, Mail
} from 'lucide-react';
import LoginDropdown from '../auth/LoginDropdown';
// NewsletterDropdown import removed
import NotificationDropdown from '../ui/NotificationDropdown';
import GoogleTranslateSelector from '../ui/GoogleTranslateSelector';
import { useAuth } from '../../context/AuthContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import MobileMenu from './MobileMenu';
import * as notificationService from '../../services/notification';

// ============================================================================
// SUBCOMPONENTES
// ============================================================================

// Barra de búsqueda
const SearchBar = ({ isMobile, isScrolled }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className={`relative flex items-center ${isMobile ? 'w-full' : 'w-48 lg:w-56 xl:w-64 2xl:w-80'} transition-all duration-300`}>
            <div className={`relative w-full transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Buscar licitaciones..."
                    className={`
                        w-full px-4 py-2 lg:py-2.5 pl-10 lg:pl-12 pr-4
                        bg-[#2a2a2a] border-2 rounded-lg lg:rounded-xl font-semibold
                        text-xs lg:text-sm text-white placeholder-gray-500
                        transition-all duration-300 focus:outline-none focus:ring-2
                        ${isFocused
                            ? 'border-[#a1db87] ring-[#a1db87]/40 bg-[#1e1e1e] shadow-2xl shadow-[#a1db87]/20'
                            : 'border-gray-700 hover:border-gray-600 hover:bg-[#252525]'
                        }
                    `}
                />
                <motion.div
                    animate={isFocused ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2"
                >
                    <Search className={`w-4 lg:w-5 h-4 lg:h-5 transition-colors duration-300 ${isFocused ? 'text-[#a1db87]' : 'text-gray-500'}`} />
                </motion.div>
            </div>
        </div>
    );
};

// Menú de navegación
const NavigationMenu = ({ item, location, onNavigate }) => {
    const isActive = location.pathname === item.path;

    return (
        <motion.button
            onClick={() => onNavigate(item.path)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`
                cursor-pointer flex items-center px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 xl:py-3 
                rounded-lg lg:rounded-xl font-bold text-xs lg:text-sm
                transition-all duration-300 whitespace-nowrap border-2
                ${isActive
                    ? 'bg-[#a1db87] text-[#1a1a1a] border-[#a1db87] shadow-xl shadow-[#a1db87]/30'
                    : 'bg-[#1a1a1a] text-gray-300 border-[#2a2a2a] hover:text-white hover:bg-[#252525] hover:border-[#333333]'
                }
            `}
        >
            <span>{item.name}</span>
        </motion.button>
    );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    // Newsletter dropdown/menu removed, state not needed
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const headerRef = useRef(null);
    const dropdownRefs = useRef({});
    const notificationRef = useRef(null);
    const { isAuthenticated, user } = useAuth();
    const { shouldShowInstallButton, handleInstall, isIOS } = usePWAInstall();

    const menuItems = [
        { name: 'Inicio', path: '/' },
        { name: 'Licitaciones', path: '/licitaciones' },
        { name: 'Borrador de propuesta', path: '/borrador-propuesta' },
        { name: 'Newsletter', path: '/newsletter' },
        { name: 'Servicios', path: '/servicios' },
        { name: 'Contacto', path: '/contacto' }
    ];

    // Detectar dispositivo
    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth < 640);
            setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
        };
        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    setIsScrolled(currentScrollY > 20);
                    setLastScrollY(currentScrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };
        if (mounted) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mounted]);

    useEffect(() => {
        setIsMenuOpen(false);
        setLoginOpen(false);
    // Newsletter dropdown/menu removed
        setNotificationsOpen(false);
    }, [location.pathname]);

    // Cargar contador de notificaciones cuando el usuario esté autenticado
    useEffect(() => {
        const loadUnreadCount = async () => {
            if (isAuthenticated) {
                try {
                    const data = await notificationService.getUnreadCount();
                    setUnreadCount(data.count);
                } catch (error) {
                    console.error('Error cargando contador de notificaciones:', error);
                }
            } else {
                setUnreadCount(0);
            }
        };

        loadUnreadCount();
        
        // Cargar contador cada 30 segundos si está autenticado
        let interval;
        if (isAuthenticated) {
            interval = setInterval(loadUnreadCount, 30000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isAuthenticated]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
            const isInsideDropdown = Object.values(dropdownRefs.current).some(ref => ref && ref.contains(target));

            if (!isInsideDropdown &&
                !target.closest('.auth-btn') &&
                !target.closest('.newsletter-btn') &&
                !target.closest('.mobile-menu-btn')) {
                setLoginOpen(false);
                // Newsletter dropdown/menu removed
            }
        };

    if (mounted && loginOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [mounted, loginOpen]);

    // Escuchar evento personalizado para abrir login desde PremiumPopup
    useEffect(() => {
        const handleOpenLogin = () => {
            setLoginOpen(true);
            // Newsletter dropdown/menu removed
            setNotificationsOpen(false);
        };

        window.addEventListener('openLogin', handleOpenLogin);
        return () => window.removeEventListener('openLogin', handleOpenLogin);
    }, []);

const handleNavigation = useCallback((path) => {
    if (location.pathname === path) return;
    setLoginOpen(false);
    // Newsletter dropdown/menu removed
    navigate(path);
}, [location.pathname, navigate]);

    const toggleLogin = useCallback((event) => {
        event?.stopPropagation();
        setLoginOpen(prev => !prev);
    // Newsletter dropdown/menu removed
        setNotificationsOpen(false);
    }, []);

    const toggleNewsletter = useCallback((event) => {
        event?.stopPropagation();
    // Newsletter dropdown/menu removed
        setLoginOpen(false);
        setNotificationsOpen(false);
    }, []);

    const toggleNotifications = useCallback((event) => {
        event?.stopPropagation();
        setNotificationsOpen(prev => !prev);
        setLoginOpen(false);
    // Newsletter dropdown/menu removed
    }, []);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    const handlePWAInstall = useCallback(async () => {
        if (isIOS) {
            alert('Para instalar en iOS:\n1. Toca el botón de compartir en Safari\n2. Selecciona "Añadir a pantalla de inicio"\n3. Confirma tocando "Añadir"');
            return;
        }
        const installed = await handleInstall();
        if (installed) {
            console.log('PWA instalada correctamente');
        }
    }, [handleInstall, isIOS]);

    if (!mounted) return null;

    return (
        <>
            <motion.header
                ref={headerRef}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className={`
                    fixed top-0 left-0 right-0 z-50 transition-all duration-500
                    ${isScrolled ? 'bg-[#1a1a1a]/98 backdrop-blur-3xl shadow-2xl shadow-black/60' : 'bg-[#1e1e1e]/95 backdrop-blur-2xl'}
                `}
            >
                {/* Barra superior decorativa */}
                <div className="h-1 bg-gradient-to-r from-[#a1db87]/0 via-[#a1db87]/60 to-[#a1db87]/0" />

                {/* Header principal */}
                <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
                    <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-24 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                        
                        {/* Logo */}
                        <motion.div
                            className="flex items-center cursor-pointer group relative flex-shrink-0"
                            onClick={() => handleNavigation('/')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className="absolute -inset-1 sm:-inset-2 lg:-inset-2 bg-gradient-to-r from-[#a1db87]/20 via-[#a1db87]/25 to-[#a1db87]/20 rounded-xl lg:rounded-2xl blur-sm lg:blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                            <img
                                src="/Corporatives/Images/Logo/Logo_white_letters.png"
                                alt="Plataforma de Licitaciones"
                                className="cursor-pointer h-7 sm:h-8 md:h-9 lg:h-11 w-auto relative z-10 drop-shadow-[0_0_8px_rgba(161,219,135,0.4)] group-hover:drop-shadow-[0_0_14px_rgba(161,219,135,0.5)] transition-all duration-300"
                                style={{ filter: 'brightness(1.1) contrast(1.05)' }}
                            />
                        </motion.div>

                        {/* Buscador - visible en tablet y desktop */}
                        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md xl:max-w-lg">
                            <SearchBar isMobile={false} isScrolled={isScrolled} />
                        </div>

                        {/* Navegación central - solo desktop */}
                        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                            {menuItems.map((item) => (
                                <NavigationMenu
                                    key={item.name}
                                    item={item}
                                    location={location}
                                    onNavigate={handleNavigation}
                                />
                            ))}
                        </nav>

                        {/* Acciones de la derecha */}
                        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
                            
                            {/* Traductor - oculto en móvil */}
                            <div className="hidden sm:block">
                                <GoogleTranslateSelector />
                            </div>

                            {/* Notificaciones - solo si está autenticado */}
                            {isAuthenticated && !isMobile && (
                                <div className="relative" ref={notificationRef}>
                                    <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={toggleNotifications}
                                        className={`relative p-2 lg:p-2.5 rounded-lg lg:rounded-xl transition-all duration-200 group ${
                                            notificationsOpen 
                                                ? 'bg-[#a1db87]/15 text-[#a1db87]' 
                                                : 'hover:bg-[#333333] text-gray-400 group-hover:text-[#a1db87]'
                                        }`}
                                        title="Notificaciones"
                                    >
                                        <Bell className="w-4 lg:w-5 h-4 lg:h-5 transition-colors" />
                                        {unreadCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#a1db87] text-[#333333] rounded-full flex items-center justify-center text-xs font-bold"
                                            >
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </motion.span>
                                        )}
                                    </motion.button>
                                    <NotificationDropdown
                                        isOpen={notificationsOpen}
                                        onClose={() => setNotificationsOpen(false)}
                                        anchorRef={notificationRef}
                                    />
                                </div>
                            )}

                            {/* PWA Install */}
                            {shouldShowInstallButton && !isMobile && (
                                <motion.button
                                    whileHover={{ scale: 1.08, rotate: 15 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handlePWAInstall}
                                    className="p-2 lg:p-2.5 rounded-lg lg:rounded-xl hover:bg-[#333333] transition-all duration-200 group"
                                    title="Instalar app"
                                >
                                    <Download className="w-4 lg:w-5 h-4 lg:h-5 text-gray-400 group-hover:text-[#a1db87] transition-colors" />
                                </motion.button>
                            )}

                            {/* Newsletter - SOLO DESKTOP */}
                            {/* Newsletter dropdown/menu removed as requested */}

                            {/* Login - SOLO DESKTOP */}
                            {!isMobile && !isTablet && (
                                <div className="relative" ref={el => dropdownRefs.current['auth'] = el}>
                                    <motion.button
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={toggleLogin}
                                        className={`
                                            cursor-pointer auth-btn flex items-center px-3 lg:px-4 py-2 lg:py-2.5 
                                            rounded-lg lg:rounded-xl font-bold text-xs lg:text-sm
                                            border-2 transition-all duration-200 shadow-lg
                                            ${loginOpen
                                                ? 'border-[#a1db87] bg-[#a1db87]/15 text-[#a1db87] shadow-[#a1db87]/30'
                                                : isAuthenticated
                                                    ? 'border-[#a1db87]/50 bg-[#a1db87]/10 text-[#a1db87] hover:border-[#a1db87] hover:shadow-[#a1db87]/20'
                                                    : 'border-gray-700 bg-[#2a2a2a] text-gray-300 hover:text-white hover:border-[#a1db87]/50 hover:bg-[#333333]'
                                            }
                                        `}
                                    >
                                        {isAuthenticated ? (
                                            <>
                                                <User className="w-7 h-7 rounded-full object-cover mr-2 border border-[#a1db87] bg-[#232323] text-[#a1db87]" />
                                                <span className="hidden xl:inline">{user?.nombre?.split(' ')[0] || 'Usuario'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="w-3.5 lg:w-4 h-3.5 lg:h-4 mr-1.5 lg:mr-2" />
                                                <span>Acceder</span>
                                            </>
                                        )}
                                    </motion.button>

                                    <LoginDropdown isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
                                </div>
                            )}

                            {/* Botón menú móvil */}
                            {(isMobile || isTablet) && (
                                <motion.button
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleMenu}
                                    className="mobile-menu-btn p-2 sm:p-2.5 rounded-lg lg:rounded-xl bg-[#2a2a2a] hover:bg-[#333333] border-2 border-gray-700 hover:border-[#a1db87]/50 transition-all duration-200"
                                    aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                                >
                                    <AnimatePresence mode="wait">
                                        {isMenuOpen ? (
                                            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                                <X className="w-5 sm:w-6 h-5 sm:h-6 text-[#a1db87]" />
                                            </motion.div>
                                        ) : (
                                            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                                <Menu className="w-5 sm:w-6 h-5 sm:h-6 text-gray-400" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Barra de progreso de scroll */}
                <motion.div
                    className="h-0.5 bg-gradient-to-r from-[#a1db87] via-[#8bc96a] to-[#7fb85d] origin-left"
                    style={{
                        scaleX: 0,
                        width: `${(lastScrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`
                    }}
                    transition={{ duration: 0.1 }}
                />
            </motion.header>

            {/* Espaciador dinámico */}
            <div className="h-16 sm:h-18 md:h-20 lg:h-24" />

            <MobileMenu
                isOpen={isMenuOpen}
                menuItems={menuItems}
                onClose={toggleMenu}
                onNavigation={handleNavigation}
            />
        </>
    );
};

export default Header;