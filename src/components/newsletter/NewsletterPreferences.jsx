import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CogIcon, 
  CheckIcon, 
  XMarkIcon, 
  ExclamationTriangleIcon,
  EnvelopeIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const NewsletterPreferences = () => {
  const [email, setEmail] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [preferences, setPreferences] = useState({
    frequency: 'weekly',
    interests: {
      keywords: [],
      sectors: [],
      sources: ['bancoMundial', 'comisionEuropea', 'nacionesUnidas', 'contratacionEstadoEspana'],
      budgetRange: { min: '', max: '' }
    }
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [sectorInput, setSectorInput] = useState('');

  const sourceOptions = [
    { value: 'bancoMundial', label: 'Banco Mundial', color: 'bg-blue-100 text-blue-800' },
    { value: 'comisionEuropea', label: 'Comisión Europea', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'nacionesUnidas', label: 'Naciones Unidas', color: 'bg-green-100 text-green-800' },
    { value: 'contratacionEstadoEspana', label: 'Contratación del Estado España', color: 'bg-red-100 text-red-800' }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Diario', description: 'Recibe actualizaciones todos los días' },
    { value: 'weekly', label: 'Semanal', description: 'Resumen semanal de licitaciones' },
    { value: 'monthly', label: 'Mensual', description: 'Resumen mensual completo' }
  ];

  // Obtener email de la URL si viene como parámetro
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, []);

  const checkSubscription = async () => {
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Por favor, introduce un email válido' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/newsletter/status/${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.success) {
        if (data.data.subscribed) {
          setSubscription(data.data.subscription);
          setPreferences({
            frequency: data.data.subscription.frequency,
            interests: data.data.subscription.interests
          });
          setMessage({ type: 'success', text: 'Suscripción encontrada' });
        } else {
          setSubscription(null);
          setMessage({ type: 'info', text: 'No hay suscripción activa para este email' });
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al verificar suscripción' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión. Por favor, inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/newsletter/preferences/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frequency: preferences.frequency,
          interests: {
            ...preferences.interests,
            budgetRange: {
              min: preferences.interests.budgetRange.min ? parseFloat(preferences.interests.budgetRange.min) : 0,
              max: preferences.interests.budgetRange.max ? parseFloat(preferences.interests.budgetRange.max) : null
            }
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setSubscription(data.data.subscription);
        setMessage({ type: 'success', text: 'Preferencias actualizadas correctamente' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al actualizar preferencias' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión. Por favor, inténtalo de nuevo.' });
    } finally {
      setSaving(false);
    }
  };

  const toggleSubscriptionStatus = async (newStatus) => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/newsletter/toggle-status/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        setSubscription(data.data.subscription);
        setMessage({ 
          type: 'success', 
          text: newStatus === 'active' ? 'Suscripción reactivada' : 'Suscripción pausada'
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al cambiar estado' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión. Por favor, inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!confirm('¿Estás seguro de que quieres darte de baja del newsletter?')) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.success) {
        setSubscription(null);
        setMessage({ type: 'success', text: 'Te has dado de baja correctamente' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al darse de baja' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión. Por favor, inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !preferences.interests.keywords.includes(keywordInput.trim())) {
      setPreferences(prev => ({
        ...prev,
        interests: {
          ...prev.interests,
          keywords: [...prev.interests.keywords, keywordInput.trim()]
        }
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    setPreferences(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        keywords: prev.interests.keywords.filter(k => k !== keyword)
      }
    }));
  };

  const addSector = () => {
    if (sectorInput.trim() && !preferences.interests.sectors.includes(sectorInput.trim())) {
      setPreferences(prev => ({
        ...prev,
        interests: {
          ...prev.interests,
          sectors: [...prev.interests.sectors, sectorInput.trim()]
        }
      }));
      setSectorInput('');
    }
  };

  const removeSector = (sector) => {
    setPreferences(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        sectors: prev.interests.sectors.filter(s => s !== sector)
      }
    }));
  };

  const toggleSource = (source) => {
    setPreferences(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        sources: prev.interests.sources.includes(source)
          ? prev.interests.sources.filter(s => s !== source)
          : [...prev.interests.sources, source]
      }
    }));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Decoraciones de fondo dinámico */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#a1db87]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#a1db87]/10 rounded-full blur-3xl" />
      {/* Decoraciones de fondo dinámico */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#a1db87]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#a1db87]/5 rounded-full blur-3xl" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-[#2a2a2a] border border-[#a1db87]/30 rounded-full mb-4"
          >
            <CogIcon className="w-4 h-4 text-[#a1db87] mr-2" />
            <span className="text-xs sm:text-sm font-semibold text-[#a1db87]">
              Gestionar Newsletter
            </span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Actualiza tus preferencias o gestiona tu suscripción
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-[#232323] rounded-xl shadow-lg p-8 border border-[#333]"
        >
          {/* Email Input */}
          <div className="mb-8">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email de suscripción
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
              <button
                onClick={checkSubscription}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-lg mb-6 ${
                message.type === 'success'
                  ? 'bg-green-900/20 text-green-300 border border-green-700'
                  : message.type === 'info'
                  ? 'bg-[#232323] text-[#a1db87] border border-[#a1db87]'
                  : 'bg-red-900/20 text-red-300 border border-red-700'
              }`}
            >
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <CheckIcon className="w-5 h-5 mr-2" />
                ) : message.type === 'info' ? (
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                ) : (
                  <XMarkIcon className="w-5 h-5 mr-2" />
                )}
                {message.text}
              </div>
            </motion.div>
          )}

          {/* Subscription Status */}
          {subscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="bg-[#232323] rounded-lg p-6 border border-[#333]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Estado de Suscripción</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    subscription.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscription.status === 'active' ? 'Activa' : 'Pausada'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {subscription.stats?.emailsSent || 0}
                    </div>
                    <div className="text-sm text-gray-600">Emails enviados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {subscription.stats?.opens || 0}
                    </div>
                    <div className="text-sm text-gray-600">Aperturas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {subscription.stats?.clicks || 0}
                    </div>
                    <div className="text-sm text-gray-600">Clicks</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {subscription.status === 'active' ? (
                    <button
                      onClick={() => toggleSubscriptionStatus('paused')}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                    >
                      <PauseIcon className="w-4 h-4 mr-2" />
                      Pausar suscripción
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleSubscriptionStatus('active')}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <PlayIcon className="w-4 h-4 mr-2" />
                      Reactivar suscripción
                    </button>
                  )}
                  
                  <button
                    onClick={unsubscribe}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                    Darse de baja
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preferences Form */}
          {subscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Actualizar Preferencias
              </h3>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Frecuencia de envío
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {frequencyOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        preferences.frequency === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={preferences.frequency === option.value}
                        onChange={(e) => setPreferences(prev => ({ ...prev, frequency: e.target.value }))}
                        className="sr-only"
                      />
                      <span className="font-medium text-gray-900">{option.label}</span>
                      <span className="text-sm text-gray-500 mt-1">{option.description}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palabras clave de interés
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ej: tecnología, infraestructura, salud..."
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Añadir
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.interests.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sectors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sectores de interés
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={sectorInput}
                    onChange={(e) => setSectorInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSector())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ej: construcción, servicios, tecnología..."
                  />
                  <button
                    type="button"
                    onClick={addSector}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Añadir
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.interests.sectors.map((sector) => (
                    <span
                      key={sector}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {sector}
                      <button
                        type="button"
                        onClick={() => removeSector(sector)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Fuentes de información
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sourceOptions.map((source) => (
                    <label
                      key={source.value}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        preferences.interests.sources.includes(source.value)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={preferences.interests.sources.includes(source.value)}
                        onChange={() => toggleSource(source.value)}
                        className="sr-only"
                      />
                      <span className={`text-xs px-2 py-1 rounded-full ${source.color} mr-3`}>
                        {source.label}
                      </span>
                      {preferences.interests.sources.includes(source.value) && (
                        <CheckIcon className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rango de presupuesto (€)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={preferences.interests.budgetRange.min}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      interests: {
                        ...prev.interests,
                        budgetRange: { ...prev.interests.budgetRange, min: e.target.value }
                      }
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={preferences.interests.budgetRange.max}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      interests: {
                        ...prev.interests,
                        budgetRange: { ...prev.interests.budgetRange, max: e.target.value }
                      }
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={savePreferences}
                disabled={saving}
                className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all ${
                  saving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#a1db87] hover:bg-[#8bc96a] shadow-lg hover:shadow-xl text-[#1a1a1a]'
                }`}
              >
                {saving ? 'Guardando...' : 'Guardar Preferencias'}
              </button>
            </motion.div>
          )}

          {/* No subscription message */}
          {!subscription && message.type === 'info' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <EnvelopeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay suscripción activa
              </h3>
              <p className="text-gray-600 mb-6">
                Este email no está suscrito al newsletter
              </p>
              <a
                href="/newsletter"
                className="inline-block bg-[#a1db87] text-[#1a1a1a] font-medium px-6 py-3 rounded-lg hover:bg-[#8bc96a] transition-all"
              >
                Suscribirse al Newsletter
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NewsletterPreferences;