
import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import { HelpCircle, Mail, FileText, Lightbulb, Target, Bell, ArrowRight, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: '¿Qué es la Plataforma de Licitaciones?',
    answer: 'Herramienta para buscar, analizar y recibir alertas de licitaciones públicas en España y organismos internacionales.'
  },
  {
    question: '¿Cómo recibo alertas de nuevas licitaciones?',
    answer: 'Suscríbete al newsletter desde el footer o configura alertas personalizadas en tu perfil.'
  },
  {
    question: '¿Dónde puedo contactar con soporte?',
    answer: 'Escríbenos desde la página de contacto o al correo info@evenor-tech.com.'
  },
  {
    question: '¿Cómo funciona el filtrado avanzado?',
    answer: 'En la sección de licitaciones puedes usar filtros por sector, fuente, fecha y palabras clave.'
  },
  {
    question: '¿Qué hago si tengo problemas de acceso?',
    answer: 'Revisa la sección de ayuda, prueba restablecer tu contraseña o contacta soporte.'
  }
];

const recursos = [
  {
    icon: <BookOpen className="w-6 h-6 text-[#a1db87]" />,
    title: 'Documentación',
    description: 'Guía completa de uso y funcionalidades.',
    link: '/documentacion',
    label: 'Ver documentación'
  },
  {
    icon: <Users className="w-6 h-6 text-[#a1db87]" />,
    title: 'Contacto soporte',
    description: '¿Tienes dudas o problemas? Nuestro equipo te ayuda.',
    link: '/contacto',
    label: 'Contactar soporte'
  },
  {
    icon: <Bell className="w-6 h-6 text-[#a1db87]" />,
    title: 'Alertas personalizadas',
    description: 'Configura alertas según tus intereses.',
    link: '/perfil',
    label: 'Configurar alertas'
  }
];

const Ayuda = () => (
  <Container className="py-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto bg-[#181818] border border-[#232323] rounded-2xl shadow-2xl p-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <HelpCircle className="w-10 h-10 text-[#a1db87]" />
        <h1 className="text-4xl font-black text-white tracking-tight">Centro de Ayuda</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="flex flex-col items-center text-center bg-[#232323] rounded-xl p-6 border border-[#333333] shadow-lg">
          <Target className="w-8 h-8 text-[#a1db87] mb-2" />
          <h2 className="text-lg font-bold text-white mb-1">Transparencia</h2>
          <p className="text-xs text-gray-400">Acceso abierto a información pública</p>
        </div>
        <div className="flex flex-col items-center text-center bg-[#232323] rounded-xl p-6 border border-[#333333] shadow-lg">
          <Lightbulb className="w-8 h-8 text-[#a1db87] mb-2" />
          <h2 className="text-lg font-bold text-white mb-1">Innovación</h2>
          <p className="text-xs text-gray-400">Tecnología para facilitar oportunidades</p>
        </div>
        <div className="flex flex-col items-center text-center bg-[#232323] rounded-xl p-6 border border-[#333333] shadow-lg">
          <Bell className="w-8 h-8 text-[#a1db87] mb-2" />
          <h2 className="text-lg font-bold text-white mb-1">Alertas</h2>
          <p className="text-xs text-gray-400">Recibe avisos de nuevas licitaciones</p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-[#a1db87] mb-6">Preguntas frecuentes</h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-[#232323] rounded-xl p-6 border border-[#333333] shadow"
            >
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#a1db87]" /> {faq.question}
              </h3>
              <p className="text-gray-300 text-base">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#a1db87] mb-6">Recursos útiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recursos.map((recurso, idx) => (
            <Link
              key={recurso.title}
              to={recurso.link}
              className="flex flex-col items-center bg-[#232323] rounded-xl p-6 border border-[#333333] shadow group hover:bg-[#1a1a1a] transition-all"
            >
              {recurso.icon}
              <h4 className="text-lg font-bold text-white mt-3 mb-1">{recurso.title}</h4>
              <p className="text-xs text-gray-400 mb-4 text-center">{recurso.description}</p>
              <span className="inline-flex items-center gap-1 text-[#a1db87] font-semibold text-sm group-hover:underline">
                {recurso.label} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-500 text-sm">¿No encuentras lo que buscas? <Link to="/contacto" className="text-[#a1db87] hover:underline font-semibold">Contáctanos</Link></p>
      </div>
    </motion.div>
  </Container>
);

export default Ayuda;
