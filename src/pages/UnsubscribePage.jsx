import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  XMarkIcon,
  EnvelopeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const UnsubscribePage = () => {
  const [loading, setLoading] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    const emailParam = urlParams.get('email');
    
    if (tokenParam) {
      setToken(tokenParam);
      // Auto-unsubscribe if token is provided
      handleUnsubscribe(null, tokenParam);
    }
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, []);

  const handleUnsubscribe = async (emailToUse = null, tokenToUse = null) => {
    setLoading(true);
    setError('');

    const unsubscribeEmail = emailToUse || email;
    const unsubscribeToken = tokenToUse || token;

    if (!unsubscribeEmail && !unsubscribeToken) {
      setError('Se requiere un email o token válido para darse de baja');
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      if (unsubscribeEmail) params.append('email', unsubscribeEmail);
      if (unsubscribeToken) params.append('token', unsubscribeToken);

      const response = await fetch(`/api/newsletter/unsubscribe?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setUnsubscribed(true);
        setEmail(data.data.email || unsubscribeEmail);
      } else {
        setError(data.message || 'Error al procesar la desuscripción');
      }
    } catch (error) {
      setError('Error de conexión. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (unsubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircleIcon className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Desuscripción Exitosa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-600 mb-8"
          >
            {email ? (
              <>El email <strong>{email}</strong> se ha dado de baja correctamente del newsletter.</>
            ) : (
              'Te has dado de baja correctamente del newsletter.'
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white rounded-xl p-8 shadow-lg mb-8"
          >
            <HeartIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ¡Lamentamos verte partir!
            </h2>
            <p className="text-gray-600 mb-6">
              Esperamos que nuestro servicio te haya sido útil. Si cambias de opinión, 
              siempre podrás suscribirte nuevamente cuando quieras.
            </p>
            
            <div className="space-y-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/newsletter"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Volver a Suscribirme
              </motion.a>
              
              <div className="text-sm text-gray-500">
                <p>¿Cambio de opinión? Puedes suscribirte nuevamente en cualquier momento</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Por qué te diste de baja?
            </h3>
            <p className="text-gray-600 mb-4">
              Nos encantaría conocer tu opinión para mejorar nuestro servicio
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/contacto"
              className="inline-block border-2 border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              Enviar Comentarios
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <ExclamationTriangleIcon className="w-10 h-10 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Darse de Baja
          </h1>
          
          <p className="text-gray-600 mb-6 text-center">
            Confirma tu email para darte de baja del newsletter
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-lg mb-6 bg-red-50 text-red-800 border border-red-200"
            >
              <div className="flex items-center">
                <XMarkIcon className="w-5 h-5 mr-2" />
                {error}
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUnsubscribe()}
              disabled={loading || !email}
              className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all ${
                loading || !email
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Procesando...
                </div>
              ) : (
                'Confirmar Desuscripción'
              )}
            </motion.button>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                ¿Prefieres gestionar tus preferencias en lugar de darte de baja?
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/newsletter/preferences"
                className="inline-block border-2 border-blue-600 text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all"
              >
                Gestionar Preferencias
              </motion.a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600 mb-4">
            Antes de irte, ¿nos das una oportunidad más?
          </p>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              ¿Sabías que puedes...?
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Pausar temporalmente las notificaciones</li>
              <li>• Cambiar la frecuencia de envío (diario, semanal, mensual)</li>
              <li>• Personalizar completamente tus intereses</li>
              <li>• Recibir solo licitaciones de ciertos presupuestos</li>
            </ul>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/newsletter/preferences"
              className="inline-block mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm"
            >
              Personalizar Newsletter
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UnsubscribePage;