import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import { BookOpen, HelpCircle, Settings, Bell, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const secciones = [
  {
    icon: <HelpCircle className="w-7 h-7 text-[#a1db87]" />,
    title: 'Preguntas frecuentes',
    description: 'Respuestas rápidas sobre el funcionamiento y uso de la plataforma.',
    link: '/ayuda',
    label: 'Ir a ayuda'
  },
  {
    icon: <Settings className="w-7 h-7 text-[#a1db87]" />,
    title: 'Configuración',
    description: 'Personaliza tu experiencia, alertas y preferencias de usuario.',
    link: '/perfil',
    label: 'Configurar perfil'
  },
  {
    icon: <Bell className="w-7 h-7 text-[#a1db87]" />,
    title: 'Alertas y newsletter',
    description: 'Recibe notificaciones y boletines sobre nuevas licitaciones.',
    link: '/newsletter',
    label: 'Gestionar alertas'
  }
];

const Documentacion = () => (
  <Container className="py-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto bg-[#181818] border border-[#232323] rounded-2xl shadow-2xl p-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <BookOpen className="w-10 h-10 text-[#a1db87]" />
        <h1 className="text-4xl font-black text-white tracking-tight">Documentación</h1>
      </div>
      <p className="text-gray-400 mb-8 text-base">Guía completa para sacar el máximo partido a la plataforma de licitaciones. Aprende a buscar, filtrar, recibir alertas y gestionar tu cuenta.</p>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-[#a1db87] mb-6">Secciones principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {secciones.map((sec, idx) => (
            <Link
              key={sec.title}
              to={sec.link}
              className="flex flex-col items-center bg-[#232323] rounded-xl p-6 border border-[#333333] shadow group hover:bg-[#1a1a1a] transition-all"
            >
              {sec.icon}
              <h4 className="text-lg font-bold text-white mt-3 mb-1">{sec.title}</h4>
              <p className="text-xs text-gray-400 mb-4 text-center">{sec.description}</p>
              <span className="inline-flex items-center gap-1 text-[#a1db87] font-semibold text-sm group-hover:underline">
                {sec.label} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-[#a1db87] mb-6">¿Cómo usar la plataforma?</h2>
        <ul className="space-y-4">
          <li className="bg-[#232323] rounded-xl p-5 border border-[#333333] text-gray-300">
            <span className="font-bold text-[#a1db87]">1. Buscar licitaciones:</span> Utiliza el buscador y los filtros avanzados para encontrar oportunidades relevantes.
          </li>
          <li className="bg-[#232323] rounded-xl p-5 border border-[#333333] text-gray-300">
            <span className="font-bold text-[#a1db87]">2. Guardar y seguir:</span> Marca licitaciones de interés y recibe actualizaciones sobre cambios o plazos.
          </li>
          <li className="bg-[#232323] rounded-xl p-5 border border-[#333333] text-gray-300">
            <span className="font-bold text-[#a1db87]">3. Configurar alertas:</span> Personaliza tus preferencias para recibir avisos por email o en la plataforma.
          </li>
          <li className="bg-[#232323] rounded-xl p-5 border border-[#333333] text-gray-300">
            <span className="font-bold text-[#a1db87]">4. Contactar soporte:</span> Si tienes dudas, accede al centro de ayuda o contacta directamente con el equipo.
          </li>
        </ul>
      </div>
      <div className="mt-10 text-center">
        <p className="text-gray-500 text-sm">¿Necesitas ayuda extra? <Link to="/contacto" className="text-[#a1db87] hover:underline font-semibold">Contáctanos</Link></p>
      </div>
    </motion.div>
  </Container>
);

export default Documentacion;
