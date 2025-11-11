import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import PremiumPopup from '../ui/PremiumPopup';

const NewsletterSubscription = () => {
  const { isAuthenticated, user } = useAuth();
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    frequency: 'weekly',
    interests: {
      keywords: [],
      sectors: [],
      sources: ['bancoMundial', 'comisionEuropea', 'nacionesUnidas', 'contratacionEstadoEspana'],
      budgetRange: { min: '', max: '' }
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAdvanced, setShowAdvanced] = useState(false);
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

  // Configurar email del usuario y verificar estado de suscripción cuando esté logueado
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
      checkSubscriptionStatus();
    } else {
      setSubscriptionStatus(null);
    }
  }, [isAuthenticated, user]);

  const checkSubscriptionStatus = async () => {
    setLoadingStatus(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://licitanor.evenor-tech.com/api/newsletter/my-subscription', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success && data.data && data.data.subscribed && data.data.subscription) {
        setSubscriptionStatus(data.data.subscription);
        // Si está suscrito, llenar el formulario con sus preferencias
        if (data.data.subscription.status === 'active') {
          const interests = data.data.subscription.interests || prev.interests;
          setFormData(prev => ({
            ...prev,
            frequency: data.data.subscription.frequency || 'weekly',
            interests: {
              ...interests,
              budgetRange: {
                min: interests.budgetRange?.min || '',
                max: interests.budgetRange?.max || ''
              }
            }
          }));
        }
      } else {
        setSubscriptionStatus(null);
      }
    } catch (error) {
      // Si no está suscrito, no pasa nada
      setSubscriptionStatus(null);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      // Mostrar popup premium en lugar de abrir directamente el login
      setShowPremiumPopup(true);
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://licitanor.evenor-tech.com/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          frequency: formData.frequency,
          interests: {
            ...formData.interests,
            budgetRange: {
              min: formData.interests.budgetRange.min ? parseFloat(formData.interests.budgetRange.min) : 0,
              max: formData.interests.budgetRange.max ? parseFloat(formData.interests.budgetRange.max) : null
            }
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: data.message || '¡Te has suscrito correctamente al newsletter!' 
        });
        
        // Hacer una mini recarga para actualizar el estado
        setTimeout(() => {
          checkSubscriptionStatus(); // Re-verificar el estado de suscripción
        }, 1000);
        
        if (data.data.isNew) {
          // Limpiar formulario solo si es una nueva suscripción
          setFormData({
            email: user?.email || '', // Mantener el email del usuario logueado
            frequency: 'weekly',
            interests: {
              keywords: [],
              sectors: [],
              sources: ['bancoMundial', 'comisionEuropea', 'nacionesUnidas', 'contratacionEstadoEspana'],
              budgetRange: { min: '', max: '' }
            }
          });
          setShowAdvanced(false);
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al suscribirse' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión. Por favor, inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.interests.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
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
    setFormData(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        keywords: prev.interests.keywords.filter(k => k !== keyword)
      }
    }));
  };

  const addSector = () => {
    if (sectorInput.trim() && !formData.interests.sectors.includes(sectorInput.trim())) {
      setFormData(prev => ({
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
    setFormData(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        sectors: prev.interests.sectors.filter(s => s !== sector)
      }
    }));
  };

  const toggleSource = (source) => {
    setFormData(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        sources: prev.interests.sources.includes(source)
          ? prev.interests.sources.filter(s => s !== source)
          : [...prev.interests.sources, source]
      }
    }));
  };

  const handleUnsubscribe = async () => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar tu suscripción al newsletter?')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://licitanor.evenor-tech.com/api/newsletter/my-subscription', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Te has desuscrito correctamente del newsletter' 
        });
        
        // Hacer una mini recarga para actualizar el estado
        setTimeout(() => {
          checkSubscriptionStatus(); // Re-verificar el estado de suscripción
        }, 1000);
        
        setSubscriptionStatus(null);
        // Resetear formulario
        setFormData({
          email: user?.email || '',
          frequency: 'weekly',
          interests: {
            keywords: [],
            sectors: [],
            sources: ['bancoMundial', 'comisionEuropea', 'nacionesUnidas', 'contratacionEstadoEspana'],
            budgetRange: { min: '', max: '' }
          }
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'Error al cancelar suscripción' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión. Por favor, inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#2a2a2a] rounded-xl shadow-lg p-8 max-w-2xl mx-auto border border-gray-700"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-r from-[#a1db87] to-[#8bc96a] rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <EnvelopeIcon className="w-8 h-8 text-[#1a1a1a]" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">Newsletter Personalizado</h2>
        <p className="text-gray-300">
          Recibe licitaciones filtradas según tus intereses y preferencias
        </p>


      </div>

      {message.text && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-lg mb-6 ${
            message.type === 'success'
              ? 'bg-[#a1db87]/20 text-[#a1db87] border border-[#a1db87]/40'
              : 'bg-red-500/20 text-red-400 border border-red-500/40'
          }`}
        >
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckIcon className="w-5 h-5 mr-2" />
            ) : (
              <XMarkIcon className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email *
            {isAuthenticated && (
              <span className="ml-2 text-xs text-[#a1db87]">(usando email de tu cuenta)</span>
            )}
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            disabled={isAuthenticated}
            className={`w-full px-4 py-3 border rounded-lg text-white placeholder-gray-400 transition-all ${
              isAuthenticated
                ? 'bg-[#2a2a2a] border-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-[#333333] border-gray-600 focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87]'
            }`}
            placeholder={isAuthenticated ? user?.email || 'Email de la cuenta' : 'tu@email.com'}
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Frecuencia de envío
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {frequencyOptions.map((option) => (
              <motion.label
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.frequency === option.value
                    ? 'border-[#a1db87] bg-[#a1db87]/20'
                    : 'border-gray-600 bg-[#333333] hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={option.value}
                  checked={formData.frequency === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="sr-only"
                />
                <span className="font-medium text-white">{option.label}</span>
                <span className="text-sm text-gray-400 mt-1">{option.description}</span>
              </motion.label>
            ))}
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[#a1db87] hover:text-[#8bc96a] font-medium text-sm transition-colors"
          >
            {showAdvanced ? 'Ocultar opciones avanzadas' : 'Mostrar opciones avanzadas'}
          </button>
        </div>

        {/* Advanced Options */}
        <motion.div
          initial={false}
          animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-6 pt-4 border-t border-gray-600">
            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Palabras clave de interés
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="flex-1 px-3 py-2 bg-[#333333] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] transition-all"
                  placeholder="ej: tecnología, infraestructura, salud..."
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-[#a1db87] text-[#1a1a1a] rounded-lg hover:bg-[#8bc96a] transition-colors font-medium"
                >
                  Añadir
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.interests.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#a1db87]/20 text-[#a1db87] border border-[#a1db87]/40"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 text-[#a1db87] hover:text-[#8bc96a]"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Sectors */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sectores de interés
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={sectorInput}
                  onChange={(e) => setSectorInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSector())}
                  className="flex-1 px-3 py-2 bg-[#333333] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] transition-all"
                  placeholder="ej: construcción, servicios, tecnología..."
                />
                <button
                  type="button"
                  onClick={addSector}
                  className="px-4 py-2 bg-[#8bc96a] text-[#1a1a1a] rounded-lg hover:bg-[#a1db87] transition-colors font-medium"
                >
                  Añadir
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.interests.sectors.map((sector) => (
                  <span
                    key={sector}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#8bc96a]/20 text-[#8bc96a] border border-[#8bc96a]/40"
                  >
                    {sector}
                    <button
                      type="button"
                      onClick={() => removeSector(sector)}
                      className="ml-2 text-[#8bc96a] hover:text-[#a1db87]"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Fuentes de información
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sourceOptions.map((source) => (
                  <motion.label
                    key={source.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.interests.sources.includes(source.value)
                        ? 'border-[#a1db87] bg-[#a1db87]/20'
                        : 'border-gray-600 bg-[#333333] hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests.sources.includes(source.value)}
                      onChange={() => toggleSource(source.value)}
                      className="sr-only"
                    />
                    <span className={`text-xs px-2 py-1 rounded-full ${source.color} mr-3`}>
                      {source.label}
                    </span>
                    {formData.interests.sources.includes(source.value) && (
                      <CheckIcon className="w-4 h-4 text-[#a1db87] ml-auto" />
                    )}
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rango de presupuesto (€)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={formData.interests.budgetRange.min || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    interests: {
                      ...prev.interests,
                      budgetRange: { ...prev.interests.budgetRange, min: e.target.value }
                    }
                  }))}
                  className="px-3 py-2 bg-[#333333] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] transition-all"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={formData.interests.budgetRange.max || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    interests: {
                      ...prev.interests,
                      budgetRange: { ...prev.interests.budgetRange, max: e.target.value }
                    }
                  }))}
                  className="px-3 py-2 bg-[#333333] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] transition-all"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Submit Buttons */}
        {isAuthenticated && subscriptionStatus?.status === 'active' ? (
          // Usuario ya suscrito - mostrar opciones de gestión
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg font-medium text-[#1a1a1a] transition-all ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#8bc96a] to-[#a1db87] hover:from-[#a1db87] hover:to-[#8bc96a] shadow-lg hover:shadow-xl shadow-[#a1db87]/20'
              }`}
            >
              {loading ? 'Actualizando...' : 'Actualizar Preferencias'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleUnsubscribe}
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg font-medium text-red-400 border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
            >
              Cancelar Suscripción
            </motion.button>
          </div>
        ) : (
          // Usuario no suscrito - botón de suscripción normal
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || loadingStatus}
            className={`w-full py-4 px-6 rounded-lg font-medium text-[#1a1a1a] transition-all ${
              loading || loadingStatus
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#a1db87] to-[#8bc96a] hover:from-[#8bc96a] hover:to-[#a1db87] shadow-lg hover:shadow-xl shadow-[#a1db87]/20'
            }`}
          >
            {loading ? 'Suscribiendo...' : loadingStatus ? 'Verificando...' : 'Suscribirse al Newsletter'}
          </motion.button>
        )}
      </form>

      <p className="text-xs text-gray-400 text-center mt-6">
        Al suscribirte, aceptas recibir emails con información sobre licitaciones. 
        Puedes darte de baja en cualquier momento.
      </p>

      {/* Premium Popup */}
      <PremiumPopup 
        isOpen={showPremiumPopup} 
        onClose={() => setShowPremiumPopup(false)}
        onLoginClick={() => {
          // Disparar evento para que el header abra el dropdown de login
          window.dispatchEvent(new CustomEvent('openLogin'));
        }}
      />
    </motion.div>
  );
};

export default NewsletterSubscription;