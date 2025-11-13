import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Search, Smartphone, Shield, Save, Loader, Key, 
  Eye, EyeOff, Calendar, Euro, Clock, Filter, Bell, CheckCircle
} from 'lucide-react';
import * as authService from '../../services/auth';

// Componente de configuración de notificaciones
export const NotificationSettings = ({ config, onUpdate, saving }) => {
  const [formData, setFormData] = useState({
    email: config?.notifications?.email?.enabled || false,
    nuevasLicitaciones: config?.notifications?.email?.newLicitaciones || false,
    actualizacionesLicitaciones: config?.notifications?.email?.newsletter || false,
    vencimientos: config?.notifications?.email?.deadlineReminders || false,
    frecuenciaEmail: config?.notifications?.email?.frequency || 'daily'
  });

  useEffect(() => {
    if (config?.notifications) {
      setFormData({
        email: config.notifications.email?.enabled || false,
        nuevasLicitaciones: config.notifications.email?.newLicitaciones || false,
        actualizacionesLicitaciones: config.notifications.email?.newsletter || false,
        vencimientos: config.notifications.email?.deadlineReminders || false,
        frecuenciaEmail: config.notifications.email?.frequency || 'daily'
      });
    }
  }, [config]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mapear los datos del frontend al formato del backend
    const backendData = {
      notifications: {
        email: {
          enabled: formData.email,
          newLicitaciones: formData.nuevasLicitaciones,
          newsletter: formData.actualizacionesLicitaciones,
          deadlineReminders: formData.vencimientos,
          frequency: formData.frecuenciaEmail
        }
      }
    };
    
    onUpdate(backendData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Bell className="w-6 h-6 mr-3 text-[#a1db87]" />
        Configuración de Notificaciones
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Activar notificaciones por email */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.checked })}
              className="w-5 h-5 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87] focus:ring-2"
            />
            <span className="ml-3 text-white font-medium">
              Activar notificaciones por email
            </span>
          </label>
          <p className="text-gray-400 text-sm mt-2 ml-8">
            Recibe notificaciones importantes directamente en tu correo electrónico
          </p>
        </div>

        {/* Tipos de notificaciones */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Tipos de Notificaciones</h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.nuevasLicitaciones}
                onChange={(e) => setFormData({ ...formData, nuevasLicitaciones: e.target.checked })}
                className="w-4 h-4 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87]"
              />
              <span className="ml-3 text-gray-300">Nuevas licitaciones que coincidan con mis criterios</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.actualizacionesLicitaciones}
                onChange={(e) => setFormData({ ...formData, actualizacionesLicitaciones: e.target.checked })}
                className="w-4 h-4 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87]"
              />
              <span className="ml-3 text-gray-300">Actualizaciones en licitaciones guardadas</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.vencimientos}
                onChange={(e) => setFormData({ ...formData, vencimientos: e.target.checked })}
                className="w-4 h-4 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87]"
              />
              <span className="ml-3 text-gray-300">Recordatorios de vencimientos</span>
            </label>
          </div>
        </div>

        {/* Frecuencia de email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Frecuencia de resumen por email
          </label>
          <select
            value={formData.frecuenciaEmail}
            onChange={(e) => setFormData({ ...formData, frecuenciaEmail: e.target.value })}
            className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
          >
            <option value="instant">Inmediata</option>
            <option value="daily">Diaria</option>
            <option value="weekly">Semanal</option>
          </select>
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-3 bg-[#a1db87] hover:bg-[#90c977] text-[#333333] rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Cambios
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

// Componente de preferencias de búsqueda
export const SearchPreferences = ({ config, onUpdate, saving }) => {
  const [formData, setFormData] = useState({
    palabrasClave: config?.searchPreferences?.keywords || [],
    sectores: config?.searchPreferences?.sectors || [],
    ubicaciones: config?.searchPreferences?.locations?.cities || [],
    presupuestoMinimo: config?.searchPreferences?.budgetRange?.min ? config.searchPreferences.budgetRange.min.toString() : '',
    presupuestoMaximo: config?.searchPreferences?.budgetRange?.max ? config.searchPreferences.budgetRange.max.toString() : '',
    fuentes: config?.searchPreferences?.sources || []
  });

  const [newKeyword, setNewKeyword] = useState('');
  // ...existing code...
  const [newLocation, setNewLocation] = useState('');

  const sectoresDisponibles = [
    'Tecnología', 'Software', 'Programación', 'Desarrollo Web', 'Inteligencia Artificial',
    'Medioambiental', 'Biológico', 'Biotecnología', 'Sistemas Informáticos', 'Big Data'
  ];

  const fuentesDisponibles = [
    'Contratación del Estado (España)',
    'Comisión Europea',
    'Banco Mundial',
    'Naciones Unidas'
  ];

  useEffect(() => {
    if (config?.searchPreferences) {
      setFormData({
        palabrasClave: config.searchPreferences.keywords || [],
        sectores: config.searchPreferences.sectors || [],
        ubicaciones: config.searchPreferences.locations?.cities || [],
        presupuestoMinimo: config.searchPreferences.budgetRange?.min ? config.searchPreferences.budgetRange.min.toString() : '',
        presupuestoMaximo: config.searchPreferences.budgetRange?.max ? config.searchPreferences.budgetRange.max.toString() : '',
        fuentes: config.searchPreferences.sources || []
      });
    }
  }, [config]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.palabrasClave.includes(newKeyword.trim())) {
      setFormData({
        ...formData,
        palabrasClave: [...formData.palabrasClave, newKeyword.trim()]
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword) => {
    setFormData({
      ...formData,
      palabrasClave: formData.palabrasClave.filter(k => k !== keyword)
    });
  };

  const addLocation = () => {
    if (newLocation.trim() && !formData.ubicaciones.includes(newLocation.trim())) {
      setFormData({
        ...formData,
        ubicaciones: [...formData.ubicaciones, newLocation.trim()]
      });
      setNewLocation('');
    }
  };

  const removeLocation = (location) => {
    setFormData({
      ...formData,
      ubicaciones: formData.ubicaciones.filter(l => l !== location)
    });
  };

  const handleArrayToggle = (array, value, field) => {
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
    
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Search className="w-6 h-6 mr-3 text-[#a1db87]" />
        Preferencias de Búsqueda
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Palabras clave */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Palabras clave de interés
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              placeholder="Agregar palabra clave..."
              className="flex-1 bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={addKeyword}
              className="px-4 py-2 bg-[#a1db87] hover:bg-[#90c977] text-[#333333] rounded-lg font-medium"
            >
              Agregar
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.palabrasClave.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-[#a1db87]/20 text-[#a1db87] rounded-full text-sm"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="ml-2 text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Sectores */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Sectores de interés
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sectoresDisponibles.map((sector) => (
              <label key={sector} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.sectores.includes(sector)}
                  onChange={() => handleArrayToggle(formData.sectores, sector, 'sectores')}
                  className="w-4 h-4 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87]"
                />
                <span className="ml-2 text-gray-300 text-sm">{sector}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ubicaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ubicaciones de interés
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
              placeholder="Agregar ubicación..."
              className="flex-1 bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={addLocation}
              className="px-4 py-2 bg-[#a1db87] hover:bg-[#90c977] text-[#333333] rounded-lg font-medium"
            >
              Agregar
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.ubicaciones.map((location, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-[#a1db87]/20 text-[#a1db87] rounded-full text-sm"
              >
                {location}
                <button
                  type="button"
                  onClick={() => removeLocation(location)}
                  className="ml-2 text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Rango de presupuesto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Presupuesto mínimo (€)
            </label>
            <input
              type="number"
              value={formData.presupuestoMinimo}
              onChange={(e) => setFormData({ ...formData, presupuestoMinimo: e.target.value })}
              placeholder="Ej: 10000"
              className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Presupuesto máximo (€)
            </label>
            <input
              type="number"
              value={formData.presupuestoMaximo}
              onChange={(e) => setFormData({ ...formData, presupuestoMaximo: e.target.value })}
              placeholder="Ej: 1000000"
              className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
            />
          </div>
        </div>

        {/* Fuentes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Fuentes de licitaciones
          </label>
          <div className="space-y-2">
            {fuentesDisponibles.map((fuente) => (
              <label key={fuente} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.fuentes.includes(fuente)}
                  onChange={() => handleArrayToggle(formData.fuentes, fuente, 'fuentes')}
                  className="w-4 h-4 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87]"
                />
                <span className="ml-2 text-gray-300">{fuente}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-3 bg-[#a1db87] hover:bg-[#90c977] text-[#333333] rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Preferencias
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

// Componente de configuración de aplicación
export const AppSettings = ({ config, onUpdate, saving }) => {
  const [formData, setFormData] = useState({
    idioma: config?.aplicacion?.idioma || 'es',
    timezone: config?.aplicacion?.timezone || 'Europe/Madrid',
    itemsPorPagina: config?.aplicacion?.itemsPorPagina || 20,
    autoGuardado: config?.aplicacion?.autoGuardado || true,
    mostrarAyuda: config?.aplicacion?.mostrarAyuda || true,
    compactoMode: config?.aplicacion?.compactoMode || false,
    mostrarMonedas: config?.aplicacion?.mostrarMonedas || 'EUR',
    formatoFecha: config?.aplicacion?.formatoFecha || 'DD/MM/YYYY',
    mostrarVencimientosProximos: config?.aplicacion?.mostrarVencimientosProximos || true,
    diasAlertaVencimiento: config?.aplicacion?.diasAlertaVencimiento || 7,
    ocultarLicitacionesVencidas: config?.aplicacion?.ocultarLicitacionesVencidas || false
  });

  useEffect(() => {
    if (config?.aplicacion) {
      setFormData({
        idioma: config.aplicacion.idioma || 'es',
        timezone: config.aplicacion.timezone || 'Europe/Madrid',
        itemsPorPagina: config.aplicacion.itemsPorPagina || 20,
        autoGuardado: config.aplicacion.autoGuardado || true,
        mostrarAyuda: config.aplicacion.mostrarAyuda || true,
        compactoMode: config.aplicacion.compactoMode || false,
        mostrarMonedas: config.aplicacion.mostrarMonedas || 'EUR',
        formatoFecha: config.aplicacion.formatoFecha || 'DD/MM/YYYY',
        mostrarVencimientosProximos: config.aplicacion.mostrarVencimientosProximos || true,
        diasAlertaVencimiento: config.aplicacion.diasAlertaVencimiento || 7,
        ocultarLicitacionesVencidas: config.aplicacion.ocultarLicitacionesVencidas || false
      });
    }
  }, [config]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const timezones = [
    'Europe/Madrid', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
    'America/New_York', 'America/Los_Angeles', 'America/Mexico_City',
    'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Filter className="w-6 h-6 mr-3 text-[#a1db87]" />
        Preferencias de Visualización
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configuraciones de Visualización */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Configuración de Visualización de Licitaciones
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Moneda preferida
              </label>
              <select
                value={formData.mostrarMonedas}
                onChange={(e) => setFormData({ ...formData, mostrarMonedas: e.target.value })}
                className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dólar ($)</option>
                <option value="GBP">Libra (£)</option>
                <option value="JPY">Yen (¥)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Formato de fecha
              </label>
              <select
                value={formData.formatoFecha}
                onChange={(e) => setFormData({ ...formData, formatoFecha: e.target.value })}
                className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD MMM YYYY">DD MMM YYYY</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alertas y Vencimientos */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Gestión de Vencimientos
          </label>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.mostrarVencimientosProximos}
                onChange={(e) => setFormData({ ...formData, mostrarVencimientosProximos: e.target.checked })}
                className="w-4 h-4 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87]"
              />
              <span className="ml-3 text-gray-300">Mostrar alertas de vencimientos próximos</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Días de anticipación para alertas
                </label>
                <select
                  value={formData.diasAlertaVencimiento}
                  onChange={(e) => setFormData({ ...formData, diasAlertaVencimiento: parseInt(e.target.value) })}
                  className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
                >
                  <option value={1}>1 día</option>
                  <option value={3}>3 días</option>
                  <option value={7}>7 días</option>
                  <option value={15}>15 días</option>
                  <option value={30}>30 días</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.ocultarLicitacionesVencidas}
                    onChange={(e) => setFormData({ ...formData, ocultarLicitacionesVencidas: e.target.checked })}
                    className="w-4 h-4 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87]"
                  />
                  <span className="ml-3 text-gray-300">Ocultar licitaciones vencidas</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Configuraciones generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Idioma de la interfaz
            </label>
            <select
              value={formData.idioma}
              onChange={(e) => setFormData({ ...formData, idioma: e.target.value })}
              className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="fr">Francés</option>
              <option value="de">Alemán</option>
              <option value="pt">Portugués</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Zona horaria
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Items por página */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Elementos por página
          </label>
          <select
            value={formData.itemsPorPagina}
            onChange={(e) => setFormData({ ...formData, itemsPorPagina: parseInt(e.target.value) })}
            className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
          >
            <option value={10}>10 elementos</option>
            <option value={20}>20 elementos</option>
            <option value={50}>50 elementos</option>
            <option value={100}>100 elementos</option>
          </select>
        </div>

        {/* Opciones adicionales */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Opciones Adicionales</h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.autoGuardado}
                onChange={(e) => setFormData({ ...formData, autoGuardado: e.target.checked })}
                className="w-4 h-4 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87]"
              />
              <span className="ml-3 text-gray-300">Autoguardado de formularios</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.mostrarAyuda}
                onChange={(e) => setFormData({ ...formData, mostrarAyuda: e.target.checked })}
                className="w-4 h-4 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87]"
              />
              <span className="ml-3 text-gray-300">Mostrar consejos y ayuda</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.compactoMode}
                onChange={(e) => setFormData({ ...formData, compactoMode: e.target.checked })}
                className="w-4 h-4 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87]"
              />
              <span className="ml-3 text-gray-300">Modo compacto (menor espaciado)</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-3 bg-[#a1db87] hover:bg-[#90c977] text-[#333333] rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Configuración
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

// Componente de configuración de seguridad
export const SecuritySettings = ({ config, onUpdate, onPasswordChange, saving }) => {
  const [formData, setFormData] = useState({
    sessionTimeout: config?.seguridad?.sessionTimeout || 60,
    loginAlerts: config?.seguridad?.loginAlerts || true,
    logoutOnClose: config?.seguridad?.logoutOnClose || false
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  useEffect(() => {
    if (config?.seguridad) {
      setFormData({
        sessionTimeout: config.seguridad.sessionTimeout || 60,
        loginAlerts: config.seguridad.loginAlerts || true,
        logoutOnClose: config.seguridad.logoutOnClose || false
      });
    }
  }, [config]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setSendingReset(true);
    
    try {
      await authService.requestPasswordReset(forgotPasswordEmail);
      
      setResetEmailSent(true);
      setTimeout(() => {
        setResetEmailSent(false);
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      }, 3000);
    } catch (error) {
      console.error('Error al enviar email de recuperación:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Shield className="w-6 h-6 mr-3 text-[#a1db87]" />
        Configuración de Seguridad
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cambio de contraseña */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Key className="w-5 h-5 mr-2 text-[#a1db87]" />
                Contraseña
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Cambia tu contraseña regularmente para mantener tu cuenta segura
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onPasswordChange}
              className="px-4 py-2 bg-[#a1db87] hover:bg-[#90c977] text-[#333333] rounded-lg font-medium"
            >
              Cambiar Contraseña
            </motion.button>
          </div>
        </div>

        {/* ¿Has olvidado tu contraseña? */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                ¿Has olvidado tu contraseña?
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Envía un enlace de recuperación a tu email
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Recuperar Contraseña
            </motion.button>
          </div>
        </div>

        {/* Configuración de sesión */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tiempo de expiración de sesión (minutos)
          </label>
          <select
            value={formData.sessionTimeout}
            onChange={(e) => setFormData({ ...formData, sessionTimeout: parseInt(e.target.value) })}
            className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
          >
            <option value={1}>1 minuto (prueba)</option>
            <option value={15}>15 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={60}>1 hora</option>
            <option value={120}>2 horas</option>
            <option value={240}>4 horas</option>
            <option value={480}>8 horas</option>
          </select>
        </div>

        {/* Opciones de seguridad */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Opciones de Seguridad</h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.loginAlerts}
                onChange={(e) => setFormData({ ...formData, loginAlerts: e.target.checked })}
                className="w-4 h-4 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87]"
              />
              <span className="ml-3 text-gray-300">Alertas de inicio de sesión</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.logoutOnClose}
                onChange={(e) => setFormData({ ...formData, logoutOnClose: e.target.checked })}
                className="w-4 h-4 text-[#a1db87] bg-gray-600 border-gray-500 rounded focus:ring-[#a1db87]"
              />
              <span className="ml-3 text-gray-300">Cerrar sesión al cerrar el navegador</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-3 bg-[#a1db87] hover:bg-[#90c977] text-[#333333] rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Guardar Seguridad
          </motion.button>
        </div>
      </form>

      {/* Modal de recuperación de contraseña - FUERA del formulario principal */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowForgotPassword(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#333333] border border-[#a1db87]/30 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Recuperar Contraseña
              </h3>

              {resetEmailSent ? (
                <div className="text-center">
                  <div className="mb-4 p-3 bg-green-900/50 border border-green-500/50 rounded-lg">
                    <p className="text-green-200 text-sm">
                      Se ha enviado un enlace de recuperación a tu email
                    </p>
                  </div>
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-300">
                    Revisa tu bandeja de entrada y sigue las instrucciones
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email de tu cuenta
                    </label>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={sendingReset}
                      className="flex-1 px-4 py-2 bg-[#a1db87] hover:bg-[#90c977] text-[#333333] rounded-lg font-medium inline-flex items-center justify-center"
                    >
                      {sendingReset ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        'Enviar'
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Modal de cambio de contraseña
export const PasswordChangeModal = ({ 
  passwordData, 
  setPasswordData, 
  showPasswords, 
  setShowPasswords, 
  onSave, 
  onCancel, 
  saving, 
  error 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#333333] border border-[#a1db87]/30 rounded-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2 text-[#a1db87]" />
          Cambiar Contraseña
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
          {/* Contraseña actual */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña actual
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#a1db87]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-[#a1db87] hover:bg-[#90c977] text-[#333333] rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : 'Cambiar'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};