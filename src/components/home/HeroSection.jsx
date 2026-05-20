import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLicitacionesStats } from '../../services/licitaciones';
import { 
  TrendingUp, Building2, Clock, ArrowRight, Sparkles, 
  Award, FileText, Euro, Landmark
} from 'lucide-react';
import Container from '../ui/Container';

const HeroSection = () => {
    const [showBoxes, setShowBoxes] = useState(true);
    const [hideAnim, setHideAnim] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getLicitacionesStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        // Usar datos por defecto en caso de error
        setStats({
          total: 15000,
          breakdown: {
            bancoMundial: 2500,
            comisionEuropea: 8100,
            nacionesUnidas: 1800,
            contratacionEstadoEspana: 2600
          }
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative pt-16 sm:pt-20 pb-8 sm:pb-12 overflow-hidden">
      <Container>
        {/* Título principal del sistema */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-[#a1db87] to-white bg-clip-text text-transparent mb-3">
            Evenor Digital Tender Advisory System
          </h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mb-6"
          >
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#a1db87]"></div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#a1db87] to-emerald-400 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-black/50 backdrop-blur-sm border border-[#a1db87]/40 rounded-lg px-6 py-2">
                  <span className="text-lg font-bold text-[#a1db87] tracking-[0.2em]">
                    D T A S
                  </span>
                </div>
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#a1db87]"></div>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="inline-block"
              >
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#a1db87]/50 to-transparent mt-1"></div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Badge superior centrado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#2a2a2a] border border-[#a1db87]/30 rounded-full">
            <TrendingUp className="w-4 h-4 text-[#a1db87]" />
            <span className="text-xs sm:text-sm font-semibold text-[#a1db87]">
              Licitaciones Destacadas
            </span>
          </div>
        </motion.div>

        {/* Showcase de Fuentes Institucionales - Ancho completo */}
        <div className="w-full">
          
          {/* SHOWCASE DE FUENTES DE DATOS */}
          <div className="relative max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-[#333333] shadow-2xl"
            >
              {/* Header del showcase */}
              <div className="text-center mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl sm:text-3xl font-bold text-white mb-3"
                >
                  Fuentes Institucionales
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-gray-400 text-sm sm:text-base"
                >
                  Acceso centralizado a las principales instituciones de licitaciones públicas
                </motion.p>
              </div>

              {/* Grid de fuentes */}
              {showBoxes && (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: hideAnim ? 0 : 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Banco Mundial */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`group bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 sm:p-6 hover:border-blue-400/40 transition-all duration-300 ${!stats ? 'animate-pulse' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm sm:text-base">Banco Mundial</h3>
                          <p className="text-xs text-gray-400">World Bank Group</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">Activa</span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed">
                      Proyectos de desarrollo, infraestructura y programas sociales a nivel internacional.
                      Financiación por ejemplo para sostenibilidad ambiental.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-semibold text-sm">
                        {stats?.breakdown?.bancoMundial ? `${stats.breakdown.bancoMundial.toLocaleString()}+ proyectos` : 'Cargando...'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>

                  {/* Comisión Europea */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`group bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4 sm:p-6 hover:border-amber-400/40 transition-all duration-300 ${!stats ? 'animate-pulse' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                          <Euro className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm sm:text-base">Comisión Europea</h3>
                          <p className="text-xs text-gray-400">European Commission</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full">Activa</span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed">
                      Contratos públicos, subvenciones y programas de financiación de la Unión Europea.
                      Oportunidades en sectores estratégicos como innovación.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-semibold text-sm">
                        {stats?.breakdown?.comisionEuropea ? `${stats.breakdown.comisionEuropea.toLocaleString()}+ contratos` : 'Cargando...'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>

                  {/* Cascading Funding */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group bg-gradient-to-br from-lime-500/10 to-lime-600/5 border border-lime-500/20 rounded-xl p-4 sm:p-6 hover:border-lime-400/40 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-lime-500/20 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-lime-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm sm:text-base">Cascading Funding</h3>
                          <p className="text-xs text-gray-400">European Commission</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-lime-500/20 text-lime-300 text-xs rounded-full">Activa</span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed">
                      Oportunidades de financiación en cascada para proyectos innovadores y colaborativos en Europa.
                      Subvenciones para startups, pymes y consorcios en sectores estratégicos.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lime-400 font-semibold text-sm">
                        {typeof stats?.breakdown?.cascadeFunding === 'number'
                          ? `${stats.breakdown.cascadeFunding}+ licitaciones`
                          : 'Cargando...'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-lime-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>

                  {/* Naciones Unidas */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`group bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-4 sm:p-6 hover:border-emerald-400/40 transition-all duration-300 ${!stats ? 'animate-pulse' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm sm:text-base">Naciones Unidas</h3>
                          <p className="text-xs text-gray-400">United Nations</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full">Activa</span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed">
                      Oportunidades de cooperación internacional, ayuda humanitaria y desarrollo sostenible.
                      Contratos en áreas de salud, medio ambiente...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-semibold text-sm">
                        {stats?.breakdown?.nacionesUnidas ? `${stats.breakdown.nacionesUnidas.toLocaleString()}+ anuncios` : 'Cargando...'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>

                  {/* Contratación del Estado España */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`group bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4 sm:p-6 hover:border-orange-400/40 transition-all duration-300 ${!stats ? 'animate-pulse' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm sm:text-base">Contratación del Estado</h3>
                          <p className="text-xs text-gray-400">España</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">Activa</span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed">
                      Licitaciones y contratos públicos del Estado español en todos los sectores.
                      Incluye ministerios, comunidades autónomas y organismos públicos.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-400 font-semibold text-sm">
                        {stats?.breakdown?.contratacionEstadoEspana ? `${stats.breakdown.contratacionEstadoEspana.toLocaleString()}+ licitaciones` : 'Cargando...'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>

                  {/* Junta de Andalucía */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4 sm:p-6 hover:border-green-400/40 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Landmark className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm sm:text-base">Junta de Andalucía</h3>
                          <p className="text-xs text-gray-400">Gobierno de Andalucía</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">Activa</span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed">
                      Licitaciones y contratos públicos de la comunidad autónoma de Andalucía.
                      Incluye consejerías, organismos autónomos y empresas públicas andaluzas.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 font-semibold text-sm">
                        {stats?.breakdown?.juntaAndalucia ? `${stats.breakdown.juntaAndalucia.toLocaleString()}+ licitaciones` : 'Próximamente'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Footer con información adicional */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 pt-6 border-t border-[#333333] text-center"
              >
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-[#a1db87]" />
                    <span>Actualización diaria</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#a1db87]" />
                    <span>Acceso 24/7</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#a1db87]" />
                    <span>Datos verificados</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Decoraciones externas - solo desktop */}
            {!isMobile && (
              <>
                <div className="absolute -bottom-4 sm:-bottom-8 -right-4 sm:-right-8 w-10 sm:w-14 md:w-16 h-10 sm:h-14 md:h-16 rounded-xl bg-[#a1db87]/20 rotate-12" />
                <div className="absolute -top-3 sm:-top-4 -left-3 sm:-left-4 w-5 sm:w-8 h-5 sm:h-8 rounded-lg border border-[#a1db87] -rotate-12" />
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;