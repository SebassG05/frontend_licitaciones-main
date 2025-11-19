import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, ArrowLeft, Bell, Search, Shield, Smartphone, 
  Save, RotateCcw, CheckCircle, AlertCircle, Loader, Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as configService from '../services/configuration';
import { 
  NotificationSettings,
  SearchPreferences, 
  SecuritySettings, 
  PasswordChangeModal 
} from '../components/configuration/ConfigurationComponents';

const Configuration = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [config, setConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('notifications');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

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

  // Cargar configuración al montar
  useEffect(() => {
    loadConfiguration();
  }, []);

  // Scroll to top al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      const configData = await configService.getUserConfig();
      setConfig(configData);
    } catch (error) {
      setError('Error al cargar la configuración');
      console.error('Error loading configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = async (section, data) => {
    try {
      setSaving(true);
      setError('');

      let updatedConfig;
      
      switch (section) {
        case 'notifications':
          updatedConfig = await configService.updateNotificationConfig(data);
          break;
        case 'search':
          updatedConfig = await configService.updateSearchPreferences(data);
          break;
        case 'security':
          updatedConfig = await configService.updateSecurityConfig(data);
          break;
        default:
          updatedConfig = await configService.updateUserConfig(data);
      }

      setConfig(updatedConfig);
      setSuccess('Configuración actualizada correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Error al actualizar configuración');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        setError('Todos los campos son obligatorios');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError('La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }

      setSaving(true);
      await configService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      setSuccess('Contraseña cambiada correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Error al cambiar contraseña');
    } finally {
      setSaving(false);
    }
  };

  const handleResetConfig = async () => {
    if (!window.confirm('¿Estás seguro de que quieres restablecer toda la configuración a los valores por defecto?')) {
      return;
    }

    try {
      setSaving(true);
      const defaultConfig = await configService.resetUserConfig();
      setConfig(defaultConfig);
      setSuccess('Configuración restablecida correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Error al restablecer configuración');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'search', label: 'Búsquedas', icon: Search },
    { id: 'security', label: 'Seguridad', icon: Shield }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#a1db87] mx-auto mb-4" />
          <p className="text-gray-300">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8 md:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12"
        >
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              <Settings className="w-8 h-8 md:w-10 md:h-10 inline mr-3 text-[#a1db87]" />
              Configuración
            </h1>
            <p className="text-gray-300 text-lg">
              Personaliza tu experiencia en la plataforma
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/perfil')}
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Perfil
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetConfig}
              disabled={saving}
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restablecer
            </motion.button>
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center"
            >
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <span className="text-red-200">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-900/50 border border-green-500/50 rounded-lg flex items-center"
            >
              <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
              <span className="text-green-200">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de navegación */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64"
          >
            <div className="bg-[#333333] border border-[#a1db87]/30 rounded-xl p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-[#a1db87] text-[#333333]'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Contenido principal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="bg-[#333333] border border-[#a1db87]/30 rounded-xl p-6 lg:p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'notifications' && (
                  <NotificationSettings
                    key="notifications"
                    config={config}
                    onUpdate={(data) => handleConfigUpdate('notifications', data)}
                    saving={saving}
                  />
                )}
                
                {activeTab === 'search' && (
                  <SearchPreferences
                    key="search"
                    config={config}
                    onUpdate={(data) => handleConfigUpdate('search', data)}
                    saving={saving}
                  />
                )}
                
                {activeTab === 'security' && (
                  <SecuritySettings
                    key="security"
                    config={config}
                    onUpdate={(data) => handleConfigUpdate('security', data)}
                    onPasswordChange={() => setShowPasswordModal(true)}
                    saving={saving}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Modal de cambio de contraseña */}
        <AnimatePresence>
          {showPasswordModal && (
            <PasswordChangeModal
              passwordData={passwordData}
              setPasswordData={setPasswordData}
              showPasswords={showPasswords}
              setShowPasswords={setShowPasswords}
              onSave={handlePasswordChange}
              onCancel={() => {
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setError('');
              }}
              saving={saving}
              error={error}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Configuration;