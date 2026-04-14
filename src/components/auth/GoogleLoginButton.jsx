import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';

/**
 * Botón "Continuar con Google" con icono de react-icons.
 * Visible en desktop y móvil.
 *
 * @param {function} onSuccess  - Callback tras login exitoso
 * @param {function} onError    - Callback con mensaje de error (string)
 * @param {string}   className  - Clases extra opcionales
 */
const GoogleLoginButton = ({ onSuccess, onError, className = '' }) => {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const openGooglePopup = useGoogleLogin({
    flow: 'implicit',
    ux_mode: 'popup',
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const result = await loginWithGoogle(tokenResponse.access_token);
        if (result.success) {
          onSuccess?.();
        } else {
          onError?.(result.message || 'No tienes acceso. Contacta con el administrador.');
        }
      } catch (err) {
        onError?.(err.message || 'Error al iniciar sesión con Google.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      onError?.('No se pudo completar el login con Google. Inténtalo de nuevo.');
    },
  });

  return (
    <button
      type="button"
      onClick={() => openGooglePopup()}
      disabled={isLoading}
      className={`
        w-full flex items-center justify-center gap-3
        py-3 px-4
        bg-white hover:bg-gray-50
        text-gray-700 font-semibold text-sm
        border-2 border-gray-200 hover:border-gray-300
        rounded-xl
        transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        cursor-pointer shadow-sm
        ${className}
      `}
    >
      {isLoading ? (
        <svg className="w-5 h-5 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        <FcGoogle className="w-5 h-5 flex-shrink-0" />
      )}
      <span>{isLoading ? 'Conectando...' : 'Continuar con Google'}</span>
    </button>
  );
};

export default GoogleLoginButton;
