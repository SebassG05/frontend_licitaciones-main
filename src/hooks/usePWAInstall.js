import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detectar iOS
        const checkIOS = () => {
            const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            setIsIOS(iOS);
        };

        // Verificar si ya está instalada
        const checkIfInstalled = () => {
            // Verificar si está ejecutándose como PWA
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            // Verificar si está ejecutándose en un navegador con PWA instalada
            const isInWebApk = window.navigator.standalone === true;
            // Verificar si es una app web instalada (Chrome/Edge)
            const isInstallableApp = window.matchMedia('(display-mode: minimal-ui)').matches;

            setIsInstalled(isStandalone || isInWebApk || isInstallableApp);
        };

        // Capturar el evento beforeinstallprompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setInstallPrompt(e);
            setIsInstallable(true);
        };

        // Escuchar cuando la app se instala
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setInstallPrompt(null);
        };

        // Verificar estado inicial
        checkIOS();
        checkIfInstalled();

        // Event listeners
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!installPrompt) return false;

        try {
            // Mostrar el prompt de instalación
            installPrompt.prompt();

            // Esperar a que el usuario responda al prompt
            const choiceResult = await installPrompt.userChoice;

            // Limpiar el prompt después de usarlo
            setInstallPrompt(null);
            setIsInstallable(false);

            // Retornar si el usuario aceptó
            return choiceResult.outcome === 'accepted';
        } catch (error) {
            console.error('Error installing PWA:', error);
            return false;
        }
    };

    // Determinar si debe mostrar el botón de instalación
    const shouldShowInstallButton = isInstallable && !isInstalled && !isIOS;

    // Para iOS, podemos mostrar instrucciones diferentes
    const shouldShowIOSInstructions = isIOS && !isInstalled;

    return {
        isInstallable,
        isInstalled,
        isIOS,
        shouldShowInstallButton,
        shouldShowIOSInstructions,
        handleInstall
    };
};