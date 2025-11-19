import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Globe2, 
  Building2, Edit3, Save, X, CheckCircle, AlertCircle, Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as profileService from '../services/profile';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({});
  const sectionRef = useRef(null);

  // Detectar dispositivo
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Cargar perfil al montar
  useEffect(() => {
    loadProfile();
  }, []);

  // Scroll to top al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await profileService.getMyProfile();
      setProfile(profileData);
      setFormData({
        nombre: profileData.nombre || '',
        telefono: profileData.telefono || '',
        localidad: profileData.localidad || '',
        pais: profileData.pais || ''
      });
    } catch (error) {
      setError('Error al cargar el perfil');
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      nombre: profile.nombre || '',
      telefono: profile.telefono || '',
      localidad: profile.localidad || '',
      pais: profile.pais || ''
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      // Validar campos requeridos
      if (!formData.nombre.trim()) {
        setError('El nombre es obligatorio');
        return;
      }

      const updatedProfile = await profileService.updateMyProfile(formData);
      setProfile(updatedProfile);
      setUser({ ...user, nombre: updatedProfile.nombre });
      setEditing(false);
      setSuccess('Perfil actualizado correctamente');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a1db87] mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando perfil...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8 md:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Mi <span className="text-[#a1db87]">Perfil</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Gestiona tu información personal y preferencias
          </p>
        </motion.div>

        {/* Mensajes */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center space-x-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-300">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#333333] border border-[#a1db87]/30 rounded-xl lg:rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header del card con avatar */}
          <div className="bg-gradient-to-r from-[#a1db87]/20 to-[#90c977]/20 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#a1db87] to-[#90c977] flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 md:w-12 md:h-12 text-[#333333]" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {profile?.nombre || 'Usuario'}
                </h2>
                <p className="text-gray-300 mb-2">{profile?.email}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#a1db87]/20 border border-[#a1db87]/40">
                  <Building2 className="w-4 h-4 text-[#a1db87] mr-2" />
                  <span className="text-[#a1db87] text-sm font-medium capitalize">
                    {profile?.tipoEntidad?.replace('_', ' ') || 'General'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                {!editing ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEdit}
                    className="cursor-pointer px-4 py-2 bg-[#a1db87] hover:bg-[#90c977] text-[#333333] rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar</span>
                  </motion.button>
                ) : (
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={saving}
                      className="cursor-pointer px-4 py-2 bg-[#a1db87] hover:bg-[#90c977] text-[#333333] rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{saving ? 'Guardando...' : 'Guardar'}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="cursor-pointer px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancelar</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contenido del perfil */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  <User className="w-4 h-4 inline mr-2" />
                  Nombre completo
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:border-[#a1db87] focus:ring-1 focus:ring-[#a1db87] transition-colors"
                    placeholder="Ingrese su nombre completo"
                  />
                ) : (
                  <div className="px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white">
                    {profile?.nombre || 'No especificado'}
                  </div>
                )}
              </div>

              {/* Email (no editable) */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <div className="px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-gray-400">
                  {profile?.email}
                  <span className="ml-2 text-xs">(No editable)</span>
                </div>
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Teléfono
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:border-[#a1db87] focus:ring-1 focus:ring-[#a1db87] transition-colors"
                    placeholder="+34 600 123 456"
                  />
                ) : (
                  <div className="px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white">
                    {profile?.telefono || 'No especificado'}
                  </div>
                )}
              </div>

              {/* Localidad */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Localidad
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.localidad}
                    onChange={(e) => handleInputChange('localidad', e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:border-[#a1db87] focus:ring-1 focus:ring-[#a1db87] transition-colors"
                    placeholder="Madrid, Barcelona, etc."
                  />
                ) : (
                  <div className="px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white">
                    {profile?.localidad || 'No especificado'}
                  </div>
                )}
              </div>

              {/* País */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  <Globe2 className="w-4 h-4 inline mr-2" />
                  País
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.pais}
                    onChange={(e) => handleInputChange('pais', e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:border-[#a1db87] focus:ring-1 focus:ring-[#a1db87] transition-colors"
                    placeholder="España"
                  />
                ) : (
                  <div className="px-4 py-3 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white">
                    {profile?.pais || 'No especificado'}
                  </div>
                )}
              </div>
            </div>

            {/* Información adicional no editable */}
            <div className="mt-8 pt-6 border-t border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">Información de la cuenta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Tipo de entidad</label>
                  <div className="px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-gray-400 capitalize">
                    {profile?.tipoEntidad?.replace('_', ' ') || 'No especificado'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">Fecha de registro</label>
                  <div className="px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-gray-400">
                    {profile?.fechaRegistro 
                      ? new Date(profile.fechaRegistro).toLocaleDateString('es-ES')
                      : 'No disponible'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;