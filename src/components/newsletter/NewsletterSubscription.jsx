import { useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const NewsletterSubscription = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
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
        
        if (data.data.isNew) {
          // Limpiar formulario solo si es una nueva suscripción
          setFormData({
            email: '',
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
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 bg-[#333333] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#a1db87] focus:border-[#a1db87] transition-all"
            placeholder="tu@email.com"
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
                  value={formData.interests.budgetRange.min}
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
                  value={formData.interests.budgetRange.max}
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

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 rounded-lg font-medium text-[#1a1a1a] transition-all ${
            loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#a1db87] to-[#8bc96a] hover:from-[#8bc96a] hover:to-[#a1db87] shadow-lg hover:shadow-xl shadow-[#a1db87]/20'
          }`}
        >
          {loading ? 'Suscribiendo...' : 'Suscribirse al Newsletter'}
        </motion.button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-6">
        Al suscribirte, aceptas recibir emails con información sobre licitaciones. 
        Puedes darte de baja en cualquier momento.
      </p>
    </motion.div>
  );
};

export default NewsletterSubscription;