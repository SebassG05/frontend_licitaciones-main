import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  BellIcon, 
  ChartBarIcon, 
  ClockIcon,
  CheckCircleIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import NewsletterSubscription from '../components/newsletter/NewsletterSubscription';

const NewsletterPage = () => {
  const features = [
    {
      icon: BellIcon,
      title: 'Alertas Personalizadas',
      description: 'Recibe notificaciones solo de las licitaciones que realmente te interesan'
    },
    {
      icon: ChartBarIcon,
      title: 'Análisis Detallado',
      description: 'Información completa con presupuestos, plazos y criterios de selección'
    },
    {
      icon: GlobeAltIcon,
      title: 'Fuentes Internacionales',
      description: 'Acceso a licitaciones del Banco Mundial, Comisión Europea y más'
    },
    {
      icon: ClockIcon,
      title: 'Actualizaciones en Tiempo Real',
      description: 'Mantente al día con las últimas oportunidades de negocio'
    }
  ];

  const benefits = [
    'Filtros personalizados por sector y palabras clave',
    'Resúmenes semanales o diarios según tu preferencia',
    'Enlaces directos a las licitaciones originales',
    'Información de presupuestos y fechas límite',
    'Sin spam - solo contenido relevante',
    'Cancelación fácil en cualquier momento'
  ];

  const stats = [
    { number: '500+', label: 'Licitaciones mensuales' },
    { number: '50+', label: 'Países cubiertos' },
    { number: '4', label: 'Fuentes principales' },
    { number: '24/7', label: 'Monitoreo continuo' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#a1db87]/10 to-[#8bc96a]/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-[#a1db87] to-[#8bc96a] rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <EnvelopeIcon className="w-10 h-10 text-[#1a1a1a]" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Newsletter
              <span className="bg-gradient-to-r from-[#a1db87] to-[#8bc96a] bg-clip-text text-transparent"> Personalizado</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Mantente informado sobre las licitaciones más relevantes para tu negocio. 
              Recibe alertas personalizadas basadas en tus intereses y criterios específicos.
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-[#a1db87] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-[#2a2a2a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Por qué elegir nuestro newsletter?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Diseñado específicamente para profesionales que buscan oportunidades 
              de licitaciones internacionales
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-[#333333] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#a1db87] to-[#8bc96a] rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#1a1a1a]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Todo lo que necesitas en un solo lugar
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Nuestro newsletter va más allá de simples notificaciones. Te proporcionamos 
                información valiosa y actionable para que puedas tomar decisiones informadas.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircleIcon className="w-5 h-5 text-[#a1db87] flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-[#333333] rounded-2xl p-8 shadow-2xl border border-gray-600"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Ejemplo de Newsletter
                  </h3>
                  <p className="text-gray-300">
                    Así se ve un resumen típico que recibirás
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-[#a1db87]/20 to-[#8bc96a]/20 rounded-lg p-6 border border-[#a1db87]/30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-white">
                      📋 5 nuevas licitaciones para ti
                    </h4>
                    <span className="text-sm text-gray-400">
                      Lunes, 10 Nov
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-[#2a2a2a] rounded p-3 border border-gray-600">
                      <h5 className="font-medium text-sm text-white mb-1">
                        Infraestructura Digital - Banco Mundial
                      </h5>
                      <p className="text-xs text-gray-400 mb-2">
                        Proyecto de digitalización en Brasil...
                      </p>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#a1db87] font-medium">€2.5M</span>
                        <span className="text-gray-400">Plazo: 15 días</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#2a2a2a] rounded p-3 border border-gray-600">
                      <h5 className="font-medium text-sm text-white mb-1">
                        Servicios de Consultoría - CE
                      </h5>
                      <p className="text-xs text-gray-400 mb-2">
                        Asesoramiento técnico para...
                      </p>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#a1db87] font-medium">€850K</span>
                        <span className="text-gray-400">Plazo: 8 días</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 bg-[#a1db87] text-[#1a1a1a] text-sm py-2 rounded hover:bg-[#8bc96a] transition-colors font-medium">
                    Ver todas las licitaciones →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="py-20 bg-[#2a2a2a]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Comienza a recibir oportunidades hoy
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Configura tus preferencias y empieza a recibir licitaciones 
              personalizadas en tu bandeja de entrada
            </p>
          </motion.div>

          <NewsletterSubscription />
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-[#a1db87] to-[#8bc96a] py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
              ¿Tienes preguntas sobre el newsletter?
            </h2>
            <p className="text-xl text-[#1a1a1a]/80 mb-8">
              Nuestro equipo está aquí para ayudarte a configurar la experiencia perfecta
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/contacto"
              className="inline-block bg-[#1a1a1a] text-[#a1db87] font-semibold px-8 py-3 rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              Contactar Soporte
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;