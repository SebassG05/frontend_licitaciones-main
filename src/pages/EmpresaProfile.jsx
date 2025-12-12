import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, Phone, Mail, Globe, Users, Award, 
  Plus, X, Edit3, Save, Briefcase, Target, Star, CheckCircle,
  Loader, AlertCircle, Calendar, ExternalLink, Tag, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container';

// Servicio API para el perfil de empresa
const empresaProfileAPI = {
  async obtenerPerfil() {
    const { getPerfilEmpresa } = await import('../services/forum');
    return await getPerfilEmpresa();
  },

  async crearOActualizarPerfil(data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007/api'}/forum/empresa/perfil`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error saving profile:', response.status, errorData);
      throw new Error(`Error ${response.status}: ${errorData || 'Error al guardar perfil'}`);
    }
    
    return await response.json();
  }
};

const EmpresaProfile = () => {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para los formularios
  const [formData, setFormData] = useState({
    nombreEmpresa: '',
    cif: '',
    descripcion: '',
    sectores: [],
    tamañoEmpresa: 'pequeña',
    direccion: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    añoFundacion: '',
    numeroEmpleados: '',
    certificaciones: [],
    proyectosDestacados: [],
    habilidades: [],
    fortalezas: []
  });

  // Estados para añadir nuevos items
  const [nuevaHabilidad, setNuevaHabilidad] = useState('');
  const [nuevaFortaleza, setNuevaFortaleza] = useState('');
  const [nuevoCertificacion, setNuevoCertificacion] = useState('');
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    rol: '',
    tecnologias: '',
    presupuesto: '',
    cliente: ''
  });
  const [mostrarFormProyecto, setMostrarFormProyecto] = useState(false);

  const sectoresDisponibles = [
    'GIS', 'Remote Sensing', 'Cartografía', 'Topografía', 
    'Medio Ambiente', 'Desarrollo Software', 'Consultoría', 
    'Ingeniería', 'Arquitectura', 'Construcción', 'IT/Tecnología',
    'Energías Renovables', 'Transporte', 'Telecomunicaciones',
    'Salud', 'Educación', 'Turismo', 'Agricultura', 'Otro'
  ];

  const tamañosEmpresa = [
    { value: 'micro', label: 'Micro (1-10 empleados)' },
    { value: 'pequeña', label: 'Pequeña (11-50 empleados)' },
    { value: 'mediana', label: 'Mediana (51-250 empleados)' },
    { value: 'grande', label: 'Grande (250+ empleados)' }
  ];

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await empresaProfileAPI.obtenerPerfil();
      
      if (response === null) {
        // Perfil no existe (404) - esto es normal para nuevos usuarios
        console.log('Perfil no encontrado, iniciando creación de nuevo perfil');
        setPerfil(null);
        setEditing(true);
        setFormData(prev => ({
          ...prev,
          email: user?.email || ''
        }));
      } else if (response && response.success && response.data) {
        const data = response.data;
        setPerfil(data);
        setFormData({
          nombreEmpresa: data.nombreEmpresa || '',
          cif: data.cif || '',
          descripcion: data.descripcion || '',
          sectores: data.sectores || [],
          tamañoEmpresa: data.tamañoEmpresa || 'pequeña',
          direccion: data.contacto?.direccion || '',
          telefono: data.contacto?.telefono || '',
          email: data.contacto?.email || user?.email || '',
          sitioWeb: data.contacto?.sitioWeb || '',
          añoFundacion: data.añoFundacion || '',
          numeroEmpleados: data.numeroEmpleados || '',
          certificaciones: data.certificaciones || [],
          proyectosDestacados: data.proyectosDestacados || [],
          habilidades: data.habilidades || [],
          fortalezas: data.fortalezas || []
        });
      }
    } catch (err) {
      console.error('Error cargando perfil:', err);
      // Otros errores sí son problemáticos
      setError(`Error al cargar el perfil: ${err.message}`);
      setEditing(true); // Aun así, permitir crear perfil
      setFormData(prev => ({
        ...prev,
        email: user?.email || ''
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const dataToSend = {
        ...formData,
        contacto: {
          direccion: formData.direccion,
          telefono: formData.telefono,
          email: formData.email,
          sitioWeb: formData.sitioWeb
        }
      };

      const resultado = await empresaProfileAPI.crearOActualizarPerfil(dataToSend);
      setPerfil(resultado);
      setEditing(false);
      setSuccess('Perfil de empresa guardado correctamente');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error guardando perfil:', err);
      setError(err.message || 'Error al guardar el perfil');
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

  const toggleSector = (sector) => {
    setFormData(prev => ({
      ...prev,
      sectores: prev.sectores.includes(sector)
        ? prev.sectores.filter(s => s !== sector)
        : [...prev.sectores, sector]
    }));
  };

  const añadirHabilidad = () => {
    if (nuevaHabilidad.trim() && !formData.habilidades.includes(nuevaHabilidad.trim())) {
      setFormData(prev => ({
        ...prev,
        habilidades: [...prev.habilidades, nuevaHabilidad.trim()]
      }));
      setNuevaHabilidad('');
    }
  };

  const eliminarHabilidad = (habilidad) => {
    setFormData(prev => ({
      ...prev,
      habilidades: prev.habilidades.filter(h => h !== habilidad)
    }));
  };

  const añadirFortaleza = () => {
    if (nuevaFortaleza.trim() && !formData.fortalezas.includes(nuevaFortaleza.trim())) {
      setFormData(prev => ({
        ...prev,
        fortalezas: [...prev.fortalezas, nuevaFortaleza.trim()]
      }));
      setNuevaFortaleza('');
    }
  };

  const eliminarFortaleza = (fortaleza) => {
    setFormData(prev => ({
      ...prev,
      fortalezas: prev.fortalezas.filter(f => f !== fortaleza)
    }));
  };

  const añadirCertificacion = () => {
    if (nuevoCertificacion.trim() && !formData.certificaciones.includes(nuevoCertificacion.trim())) {
      setFormData(prev => ({
        ...prev,
        certificaciones: [...prev.certificaciones, nuevoCertificacion.trim()]
      }));
      setNuevoCertificacion('');
    }
  };

  const eliminarCertificacion = (cert) => {
    setFormData(prev => ({
      ...prev,
      certificaciones: prev.certificaciones.filter(c => c !== cert)
    }));
  };

  const añadirProyecto = () => {
    if (nuevoProyecto.nombre.trim() && nuevoProyecto.descripcion.trim()) {
      const proyecto = {
        ...nuevoProyecto,
        tecnologias: nuevoProyecto.tecnologias.split(',').map(t => t.trim()).filter(t => t)
      };
      setFormData(prev => ({
        ...prev,
        proyectosDestacados: [...prev.proyectosDestacados, proyecto]
      }));
      setNuevoProyecto({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        rol: '',
        tecnologias: '',
        presupuesto: '',
        cliente: ''
      });
      setMostrarFormProyecto(false);
    }
  };

  const eliminarProyecto = (index) => {
    setFormData(prev => ({
      ...prev,
      proyectosDestacados: prev.proyectosDestacados.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Container className="py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-[#a1db87] mx-auto mb-4" />
              <p className="text-gray-400">Cargando perfil de empresa...</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Container className="py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Perfil de Empresa
              </h1>
              <p className="text-gray-400">
                Completa tu perfil para participar en el foro de colaboración
              </p>
            </div>
            
            {!editing && perfil && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#a1db87] text-[#1a1a1a] rounded-xl hover:bg-white transition-all duration-300 font-semibold"
              >
                <Edit3 className="w-4 h-4" />
                Editar Perfil
              </motion.button>
            )}
          </div>

          {/* Mensajes */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Formulario/Vista del perfil */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Información Básica */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Building2 className="w-6 h-6 text-[#a1db87]" />
              Información Básica de la Empresa
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de la Empresa *
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.nombreEmpresa}
                    onChange={(e) => handleInputChange('nombreEmpresa', e.target.value)}
                    required
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                    placeholder="Ej: TechSolutions S.L."
                  />
                ) : (
                  <p className="text-white bg-[#2a2a2a] rounded-xl p-3">
                    {formData.nombreEmpresa || 'No especificado'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CIF *
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.cif}
                    onChange={(e) => handleInputChange('cif', e.target.value.toUpperCase())}
                    required
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                    placeholder="Ej: B12345678"
                    pattern="[A-Z][0-9]{8}"
                    title="Formato: Letra seguida de 8 dígitos"
                  />
                ) : (
                  <p className="text-white bg-[#2a2a2a] rounded-xl p-3">
                    {formData.cif || 'No especificado'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción de la Empresa *
                </label>
                {editing ? (
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    required
                    rows={4}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none resize-none"
                    placeholder="Describe los servicios principales de tu empresa, experiencia, especialidades..."
                    maxLength={1000}
                  />
                ) : (
                  <p className="text-white bg-[#2a2a2a] rounded-xl p-3 leading-relaxed">
                    {formData.descripcion || 'No especificado'}
                  </p>
                )}
                {editing && (
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {formData.descripcion.length}/1000 caracteres
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tamaño de la Empresa
                </label>
                {editing ? (
                  <select
                    value={formData.tamañoEmpresa}
                    onChange={(e) => handleInputChange('tamañoEmpresa', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white focus:border-[#a1db87] focus:outline-none"
                  >
                    {tamañosEmpresa.map(tamaño => (
                      <option key={tamaño.value} value={tamaño.value}>
                        {tamaño.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-white bg-[#2a2a2a] rounded-xl p-3">
                    {tamañosEmpresa.find(t => t.value === formData.tamañoEmpresa)?.label || 'No especificado'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Año de Fundación
                </label>
                {editing ? (
                  <input
                    type="number"
                    value={formData.añoFundacion}
                    onChange={(e) => handleInputChange('añoFundacion', e.target.value)}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                    placeholder="Ej: 2015"
                  />
                ) : (
                  <p className="text-white bg-[#2a2a2a] rounded-xl p-3">
                    {formData.añoFundacion || 'No especificado'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sectores */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Tag className="w-6 h-6 text-[#a1db87]" />
              Sectores de Especialización *
            </h2>

            {editing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {sectoresDisponibles.map(sector => (
                  <motion.button
                    key={sector}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSector(sector)}
                    className={`p-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                      formData.sectores.includes(sector)
                        ? 'bg-[#a1db87] text-[#1a1a1a] border-[#a1db87]'
                        : 'bg-[#2a2a2a] text-gray-300 border-[#3a3a3a] hover:border-[#a1db87]/50'
                    }`}
                  >
                    {sector}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.sectores.map(sector => (
                  <span
                    key={sector}
                    className="px-3 py-2 bg-[#a1db87]/10 text-[#a1db87] border border-[#a1db87]/20 rounded-xl text-sm font-medium"
                  >
                    {sector}
                  </span>
                ))}
                {formData.sectores.length === 0 && (
                  <span className="text-gray-500 italic">No hay sectores especificados</span>
                )}
              </div>
            )}
          </div>

          {/* Información de Contacto */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Mail className="w-6 h-6 text-[#a1db87]" />
              Información de Contacto
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email de Contacto
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                    placeholder="contacto@empresa.com"
                  />
                ) : (
                  <p className="text-white bg-[#2a2a2a] rounded-xl p-3">
                    {formData.email || 'No especificado'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teléfono
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                    placeholder="+34 123 456 789"
                  />
                ) : (
                  <p className="text-white bg-[#2a2a2a] rounded-xl p-3">
                    {formData.telefono || 'No especificado'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sitio Web
                </label>
                {editing ? (
                  <input
                    type="url"
                    value={formData.sitioWeb}
                    onChange={(e) => handleInputChange('sitioWeb', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                    placeholder="https://www.empresa.com"
                  />
                ) : (
                  <p className="text-white bg-[#2a2a2a] rounded-xl p-3">
                    {formData.sitioWeb ? (
                      <a
                        href={formData.sitioWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#a1db87] hover:text-white transition-colors flex items-center gap-1"
                      >
                        {formData.sitioWeb}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      'No especificado'
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dirección
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                    placeholder="Calle Ejemplo 123, Madrid"
                  />
                ) : (
                  <p className="text-white bg-[#2a2a2a] rounded-xl p-3">
                    {formData.direccion || 'No especificado'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Habilidades y Fortalezas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Habilidades */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#a1db87]" />
                Habilidades Técnicas
              </h3>

              {editing && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={nuevaHabilidad}
                    onChange={(e) => setNuevaHabilidad(e.target.value)}
                    placeholder="Ej: React, Python, GIS..."
                    className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-2 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        añadirHabilidad();
                      }
                    }}
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={añadirHabilidad}
                    className="px-3 py-2 bg-[#a1db87] text-[#1a1a1a] rounded-xl hover:bg-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {formData.habilidades.map((habilidad, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-sm"
                  >
                    {habilidad}
                    {editing && (
                      <button
                        type="button"
                        onClick={() => eliminarHabilidad(habilidad)}
                        className="text-blue-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.span>
                ))}
                {formData.habilidades.length === 0 && (
                  <span className="text-gray-500 italic">No hay habilidades especificadas</span>
                )}
              </div>
            </div>

            {/* Fortalezas */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#a1db87]" />
                Fortalezas Empresariales
              </h3>

              {editing && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={nuevaFortaleza}
                    onChange={(e) => setNuevaFortaleza(e.target.value)}
                    placeholder="Ej: Experiencia internacional, equipo experto..."
                    className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-2 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        añadirFortaleza();
                      }
                    }}
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={añadirFortaleza}
                    className="px-3 py-2 bg-[#a1db87] text-[#1a1a1a] rounded-xl hover:bg-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {formData.fortalezas.map((fortaleza, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm"
                  >
                    {fortaleza}
                    {editing && (
                      <button
                        type="button"
                        onClick={() => eliminarFortaleza(fortaleza)}
                        className="text-emerald-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.span>
                ))}
                {formData.fortalezas.length === 0 && (
                  <span className="text-gray-500 italic">No hay fortalezas especificadas</span>
                )}
              </div>
            </div>
          </div>

          {/* Certificaciones */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#a1db87]" />
              Certificaciones
            </h3>

            {editing && (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={nuevoCertificacion}
                  onChange={(e) => setNuevoCertificacion(e.target.value)}
                  placeholder="Ej: ISO 9001, ISO 14001, Certificación Google Cloud..."
                  className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      añadirCertificacion();
                    }
                  }}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={añadirCertificacion}
                  className="px-4 py-3 bg-[#a1db87] text-[#1a1a1a] rounded-xl hover:bg-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {formData.certificaciones.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl"
                >
                  <Award className="w-4 h-4" />
                  {cert}
                  {editing && (
                    <button
                      type="button"
                      onClick={() => eliminarCertificacion(cert)}
                      className="text-amber-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
              {formData.certificaciones.length === 0 && (
                <span className="text-gray-500 italic">No hay certificaciones especificadas</span>
              )}
            </div>
          </div>

          {/* Proyectos Destacados */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#a1db87]" />
                Proyectos Destacados
              </h3>
              
              {editing && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMostrarFormProyecto(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#a1db87] text-[#1a1a1a] rounded-xl hover:bg-white transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Añadir Proyecto
                </motion.button>
              )}
            </div>

            {/* Lista de proyectos */}
            <div className="space-y-4">
              {formData.proyectosDestacados.map((proyecto, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-white font-semibold">{proyecto.nombre}</h4>
                    {editing && (
                      <button
                        type="button"
                        onClick={() => eliminarProyecto(index)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                    {proyecto.descripcion}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {proyecto.rol && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>Rol: {proyecto.rol}</span>
                      </div>
                    )}
                    {proyecto.cliente && (
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>Cliente: {proyecto.cliente}</span>
                      </div>
                    )}
                    {(proyecto.fechaInicio || proyecto.fechaFin) && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {proyecto.fechaInicio && new Date(proyecto.fechaInicio).toLocaleDateString('es-ES')}
                          {proyecto.fechaInicio && proyecto.fechaFin && ' - '}
                          {proyecto.fechaFin && new Date(proyecto.fechaFin).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {proyecto.tecnologias.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              
              {formData.proyectosDestacados.length === 0 && (
                <div className="text-center py-8 text-gray-500 italic">
                  No hay proyectos destacados
                </div>
              )}
            </div>
          </div>

          {/* Modal para añadir proyecto */}
          <AnimatePresence>
            {mostrarFormProyecto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={() => setMostrarFormProyecto(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Añadir Proyecto Destacado</h3>
                    <button
                      type="button"
                      onClick={() => setMostrarFormProyecto(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nombre del Proyecto *
                        </label>
                        <input
                          type="text"
                          value={nuevoProyecto.nombre}
                          onChange={(e) => setNuevoProyecto(prev => ({ ...prev, nombre: e.target.value }))}
                          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                          placeholder="Ej: Sistema GIS Municipal"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Tu Rol en el Proyecto
                        </label>
                        <input
                          type="text"
                          value={nuevoProyecto.rol}
                          onChange={(e) => setNuevoProyecto(prev => ({ ...prev, rol: e.target.value }))}
                          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                          placeholder="Ej: Desarrollador Principal, Consultor..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descripción del Proyecto *
                      </label>
                      <textarea
                        value={nuevoProyecto.descripcion}
                        onChange={(e) => setNuevoProyecto(prev => ({ ...prev, descripcion: e.target.value }))}
                        rows={3}
                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none resize-none"
                        placeholder="Describe brevemente el proyecto, objetivos, resultados..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Cliente/Organización
                        </label>
                        <input
                          type="text"
                          value={nuevoProyecto.cliente}
                          onChange={(e) => setNuevoProyecto(prev => ({ ...prev, cliente: e.target.value }))}
                          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                          placeholder="Ej: Ayuntamiento de Madrid"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Presupuesto (opcional)
                        </label>
                        <input
                          type="text"
                          value={nuevoProyecto.presupuesto}
                          onChange={(e) => setNuevoProyecto(prev => ({ ...prev, presupuesto: e.target.value }))}
                          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                          placeholder="Ej: 50.000€"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Fecha de Inicio
                        </label>
                        <input
                          type="date"
                          value={nuevoProyecto.fechaInicio}
                          onChange={(e) => setNuevoProyecto(prev => ({ ...prev, fechaInicio: e.target.value }))}
                          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white focus:border-[#a1db87] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Fecha de Finalización
                        </label>
                        <input
                          type="date"
                          value={nuevoProyecto.fechaFin}
                          onChange={(e) => setNuevoProyecto(prev => ({ ...prev, fechaFin: e.target.value }))}
                          className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white focus:border-[#a1db87] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tecnologías Utilizadas
                      </label>
                      <input
                        type="text"
                        value={nuevoProyecto.tecnologias}
                        onChange={(e) => setNuevoProyecto(prev => ({ ...prev, tecnologias: e.target.value }))}
                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-3 text-white placeholder-gray-500 focus:border-[#a1db87] focus:outline-none"
                        placeholder="Separadas por comas: React, Node.js, PostgreSQL, ArcGIS..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={añadirProyecto}
                        className="flex-1 bg-gradient-to-r from-[#a1db87] to-[#7cc85f] text-[#1a1a1a] py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-[#a1db87]/25 font-semibold transition-all duration-300"
                      >
                        Añadir Proyecto
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMostrarFormProyecto(false)}
                        className="flex-1 bg-[#2a2a2a] text-gray-300 py-3 px-4 rounded-xl hover:bg-[#333333] border border-[#2a2a2a] transition-all duration-300"
                      >
                        Cancelar
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botones de acción */}
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 justify-center"
            >
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#a1db87] to-[#7cc85f] text-[#1a1a1a] rounded-xl hover:shadow-lg hover:shadow-[#a1db87]/25 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Guardar Perfil
                  </>
                )}
              </motion.button>

              {perfil && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditing(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#2a2a2a] text-gray-300 rounded-xl hover:bg-[#333333] border border-[#2a2a2a] transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.form>
      </Container>
    </div>
  );
};

export default EmpresaProfile;