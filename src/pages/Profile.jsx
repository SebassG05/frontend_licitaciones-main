import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Globe2, 
  Building2, Edit3, Save, X, CheckCircle, AlertCircle, Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as profileService from '../services/profile';
import * as avatarService from '../services/avatar';
import AvatarPreviewModal from '../components/ui/AvatarPreviewModal';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({});
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarPreview, setCustomAvatarPreview] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [customAvatars, setCustomAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
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
      // Cargar avatar desde la colección avatars
      const avatar = await avatarService.getMyAvatar();
      if (avatar && avatar.imageUrl) {
        setSelectedAvatar({
          image: avatar.imageUrl,
          rotation: avatar.rotation || 0,
          zoom: avatar.zoom || 1
        });
      } else {
        setSelectedAvatar(null);
      }
    } catch (error) {
      setError('Error al cargar el perfil');
      if (error.message && !error.message.includes('404')) {
        console.error('Error loading profile:', error);
      }
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

      // Incluir avatar en la actualización si está seleccionado
      const dataToSend = {
        ...formData,
        avatar: selectedAvatar
          ? {
              imageUrl: selectedAvatar.image,
              rotation: selectedAvatar.rotation || 0,
              zoom: selectedAvatar.zoom || 1
            }
          : undefined
      };

      const updatedProfile = await profileService.updateMyProfile(dataToSend);
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

  const defaultAvatars = [
    'https://res.cloudinary.com/dwjpopzfo/image/upload/v1763552546/avatar_sqeifl.webp',
    'https://res.cloudinary.com/dwjpopzfo/image/upload/v1763552540/Dise%C3%B1o_sin_t%C3%ADtulo_3_mkss5j.png',
    'https://res.cloudinary.com/dwjpopzfo/image/upload/v1763552536/Dise%C3%B1o_sin_t%C3%ADtulo_2_pkzoxq.png',
    'https://res.cloudinary.com/dwjpopzfo/image/upload/v1763552532/Dise%C3%B1o_sin_t%C3%ADtulo_1_fhtpho.png',
    'https://res.cloudinary.com/dwjpopzfo/image/upload/v1763552528/Dise%C3%B1o_sin_t%C3%ADtulo_eqqlba.png',
    
    'https://api.dicebear.com/9.x/glass/svg?seed=empresa1',
    'https://api.dicebear.com/9.x/glass/svg?seed=empresa2',
    'https://api.dicebear.com/9.x/glass/svg?seed=empresa3',
    'https://api.dicebear.com/9.x/glass/svg?seed=empresa4',
    'https://api.dicebear.com/9.x/glass/svg?seed=empresa5',
  ];

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
              <div className="relative w-30 h-30 md:w-27 md:h-27 rounded-full bg-gradient-to-br from-[#a1db87] to-[#90c977] flex items-center justify-center shadow-lg">
                {selectedAvatar ? (
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                    <img
                      src={selectedAvatar.image}
                      alt="Avatar usuario"
                      className="w-full h-full object-cover"
                      style={{
                        transform: `rotate(${selectedAvatar.rotation || 0}deg) scale(${selectedAvatar.zoom || 1})`
                      }}
                    />
                  </div>
                ) : (
                  <User className="w-10 h-10 md:w-12 md:h-12 text-[#333333]" />
                )}
                <button
                  className="cursor-pointer absolute bottom-0 right-0 bg-[#333333] hover:bg-[#232323] text-[#a1db87] rounded-full p-2 shadow transition-colors"
                  title="Actualizar foto de perfil"
                  onClick={() => setShowAvatarModal(true)}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
                    {/* Modal para seleccionar avatar predeterminado */}
                    <AnimatePresence>
                      {showAvatarModal && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        >
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                            className="bg-[#232323] rounded-2xl shadow-2xl px-10 py-6 max-w-2xl w-full border border-[#a1db87] relative"
                          >
                            <h2 className="text-xl font-bold text-[#a1db87] mb-4">Selecciona tu imagen de perfil</h2>
                            <div className="grid grid-cols-4 gap-6 mb-6">
                              {customAvatars.map((avatar, idx) => (
                                <button
                                  key={`custom-${idx}-${avatar.image || idx}`}
                                  className={`cursor-pointer rounded-full overflow-hidden border-2 ${selectedAvatar?.image === avatar.image ? 'border-[#a1db87]' : 'border-transparent'} bg-[#181818] flex items-center justify-center w-20 h-20 transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
                                  type="button"
                                  onClick={() => {
                                    const newAvatar = { image: avatar.image, pos: avatar.pos, rotation: avatar.rotation, zoom: avatar.zoom };
                                    setSelectedAvatar(newAvatar);
                                  }}
                                >
                                  <img
                                    src={avatar.image}
                                    alt={`Avatar personalizado ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    style={{
                                      transform: `rotate(${avatar.rotation || 0}deg) scale(${avatar.zoom || 1})`,
                                    }}
                                  />
                                </button>
                              ))}
                              {defaultAvatars.map((url, idx) => (
                                <button
                                  key={`default-${idx}-${url}`}
                                  className={`cursor-pointer rounded-full overflow-hidden border-2 ${selectedAvatar?.image === url ? 'border-[#a1db87]' : 'border-transparent'} transition-transform duration-200 hover:scale-105 hover:shadow-lg bg-[#181818] flex items-center justify-center w-20 h-20`}
                                  type="button"
                                  onClick={() => {
                                    const newAvatar = { image: url, pos: null, rotation: 0, zoom: 1 };
                                    setSelectedAvatar(newAvatar);
                                  }}
                                >
                                  <img
                                    src={url}
                                    alt={`Avatar ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                              {/* Botón para quitar avatar y dejar predeterminado */}
                              <button
                                className={`cursor-pointer rounded-full border-2 border-[#e57373] bg-transparent flex items-center justify-center w-20 h-20 relative group transition-transform duration-200 hover:scale-105 hover:shadow-lg`}
                                type="button"
                                title="Quitar avatar y dejar perfil sin imagen"
                                onClick={async () => {
                                  try {
                                    await avatarService.deleteMyAvatar(); // Debes tener este método en avatarService
                                    setSelectedAvatar(null);
                                    setSuccess('Avatar eliminado correctamente');
                                    await loadProfile();
                                    setShowAvatarModal(false);
                                  } catch (error) {
                                    setError('Error al eliminar el avatar');
                                  }
                                }}
                              >
                                <span className="absolute inset-0 flex items-center justify-center">
                                  {/* Círculo transparente */}
                                  <span className="w-16 h-16 rounded-full bg-transparent border-2 border-dashed border-[#e57373]" />
                                </span>
                              </button>
                            </div>
                            {selectedAvatar && (
                              <button
                                className="cursor-pointer mt-2 px-6 py-2 bg-[#a1db87] hover:bg-[#90c977] text-[#232323] font-semibold rounded-lg shadow transition-colors"
                                onClick={async () => {
                                  try {
                                    const dataToSend = {
                                      imageUrl: selectedAvatar.image,
                                      rotation: selectedAvatar.rotation || 0,
                                      zoom: selectedAvatar.zoom || 1
                                    };
                                    await avatarService.saveMyAvatar(dataToSend);
                                    setSuccess('Avatar guardado correctamente');
                                    await loadProfile();
                                    setShowAvatarModal(false);
                                  } catch (error) {
                                    setError('Error al guardar el avatar');
                                  }
                                }}
                              >
                                Guardar
                              </button>
                            )}
                            <div className="mb-4 flex flex-col items-center">
                              <label htmlFor="avatar-upload" className="cursor-pointer bg-[#a1db87] hover:bg-[#90c977] text-[#232323] font-semibold px-5 py-2 rounded-lg shadow transition-colors mb-2">
                                Subir imagen personalizada
                              </label>
                              <input
                                id="avatar-upload"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                                className="hidden"
                                onChange={e => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = ev => {
                                      setCustomAvatarPreview(ev.target.result);
                                      setShowPreviewModal(true);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <span className="text-xs text-gray-400">Formatos permitidos: PNG, JPG, SVG</span>
                            </div>
                            <button
                              className="absolute top-3 right-4 text-gray-400 hover:text-[#a1db87] text-lg"
                              onClick={() => { setShowAvatarModal(false); setCustomAvatarPreview(null); setShowPreviewModal(false); }}
                              title="Cerrar"
                            >
                              ×
                            </button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

        {showPreviewModal && (
          <AvatarPreviewModal
            image={customAvatarPreview}
            open={showPreviewModal}
            onClose={() => { setShowPreviewModal(false); setCustomAvatarPreview(null); setShowAvatarModal(true); }}
            onConfirm={data => {
              setCustomAvatars(prev => [...prev, data]);
              setSelectedAvatar({ image: data.image, pos: data.pos, rotation: data.rotation, zoom: data.zoom });
              setShowPreviewModal(false);
              setShowAvatarModal(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;