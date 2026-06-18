import React from "react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AvisoLegal() {
  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-10 text-gray-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-[#a1db87] mb-1">Aviso Legal</h1>
      <p className="text-xs text-gray-500 mb-8">www.evenos-tech.com</p>

      {/* Datos identificativos */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Datos identificativos</h2>
        <p className="mb-4 text-sm leading-relaxed">
          En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información
          y de Comercio Electrónico (LSSI-CE), <strong className="text-white">EVENOR TECH, S.L.U.</strong> informa
          que es titular del sitio web. De acuerdo con la exigencia del artículo 10 de la citada Ley, se
          facilitan los siguientes datos:
        </p>
        <div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
          <table className="w-full text-sm">
            <tbody>
              {[
                ['Razón Social', 'EVENOR TECH, S.L.U.'],
                ['NIF', 'B91790527'],
                ['Dominio', 'WWW.EVENOS-TECH.COM'],
                ['Dirección Postal', 'Avda. República Argentina, 27 B, 41011 Sevilla (Sevilla)'],
                ['Dirección Electrónica', 'info@evenor-tech.com'],
                ['Teléfonos', '651 549 721'],
              ].map(([key, val]) => (
                <tr key={key} className="border-b border-[#2a2a2a] last:border-0">
                  <td className="px-4 py-3 font-semibold text-[#a1db87] bg-[#1a1a1a] w-44 align-top whitespace-nowrap">{key}</td>
                  <td className="px-4 py-3 text-gray-300 bg-[#232323]">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Usuario y responsabilidades */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Usuario y régimen de responsabilidades</h2>
        <p className="mb-3 text-sm leading-relaxed">
          La navegación, acceso y uso por el sitio web de EVENOR TECH, S.L.U. confiere la condición de usuario.
        </p>
        <p className="mb-3 text-sm leading-relaxed">
          El sitio web proporciona gran diversidad de información, servicios y datos. El usuario asume su
          responsabilidad en el uso correcto del sitio web. Esta responsabilidad se extenderá a:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>La veracidad y licitud de las informaciones aportadas por el usuario en los formularios extendidos por EVENOR TECH, S.L.U. para el acceso a ciertos contenidos o servicios ofrecidos por el web.</li>
          <li>El uso de la información, servicios y datos ofrecidos por EVENOR TECH, S.L.U. contrariamente a lo dispuesto por las presentes condiciones, la Ley, la moral, las buenas costumbres o el orden público, o que de cualquier otro modo puedan suponer lesión de los derechos de terceros o del mismo funcionamiento del sitio web.</li>
        </ul>
      </section>

      {/* Política de enlaces */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Política de enlaces y exenciones de responsabilidad</h2>
        <p className="mb-3 text-sm leading-relaxed">
          EVENOR TECH, S.L.U. no se hace responsable del contenido de los sitios web a los que el usuario
          pueda acceder a través de los enlaces establecidos en su sitio web, siempre que no tenga
          conocimiento efectivo de que la actividad o la información a la que remite o recomienda es ilícita
          o de que lesiona bienes o derechos de un tercero susceptibles de indemnización.
        </p>
        <p className="text-sm leading-relaxed">
          EVENOR TECH, S.L.U. declara haber adoptado todas las medidas necesarias para evitar cualquier
          daño a los usuarios de su sitio web. En consecuencia, no se hace responsable, en ningún caso, de
          los eventuales daños que por la navegación por Internet pudiera sufrir el usuario, ni garantizará
          la disponibilidad técnica, exactitud, veracidad, validez o legalidad de sitios ajenos a su
          propiedad a los que se pueda acceder por medio de los enlaces.
        </p>
      </section>

      {/* Modificaciones */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Modificaciones</h2>
        <p className="text-sm leading-relaxed">
          EVENOR TECH, S.L.U. se reserva la facultad de efectuar, en cualquier momento y sin necesidad de
          previo aviso, modificaciones y actualizaciones de la información contenida en su sitio web o en la
          configuración y presentación de esta. Los contenidos del mismo podrán ser modificados, corregidos,
          eliminados o añadidos en cualquier momento, por cualquier forma admisible en derecho.
        </p>
      </section>

      {/* Indicación de precios */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Indicación de precios</h2>
        <p className="mb-3 text-sm leading-relaxed">
          En caso de que se muestren precios de productos y/o servicios, los indicados en pantalla serán los
          vigentes en cada momento. Los precios serán indicados en euros y tendrán incorporado el Impuesto
          sobre el Valor Añadido (IVA). En caso de que no se incorpore el IVA en el precio, se indicará de
          manera expresa y se permitirá al usuario visualizar el precio final completo.
        </p>
        <p className="text-sm leading-relaxed">
          Asimismo, si fuera aplicable cualquier otro impuesto, así se indicaría, incluyendo, en su caso, el
          importe de los incrementos o descuentos que sean de aplicación a la oferta y los gastos adicionales
          que puedan repercutir al consumidor o usuario.
        </p>
      </section>

      {/* Propiedad intelectual */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Propiedad intelectual e industrial</h2>
        <p className="mb-3 text-sm leading-relaxed">
          EVENOR TECH, S.L.U., por sí misma o como cesionaria, es titular de todos los derechos de propiedad
          intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a
          título enunciativo, imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos,
          combinaciones de colores, estructura y diseño, selección de materiales usados, programas de
          ordenador necesarios para su funcionamiento, acceso y uso, etc.).
        </p>
        <p className="mb-3 text-sm leading-relaxed">
          <strong className="text-white">Todos los derechos reservados.</strong> En virtud de lo dispuesto en
          la Ley de Propiedad Intelectual, quedan expresamente prohibidas la reproducción, la distribución y
          la comunicación pública, de la totalidad o parte de los contenidos de esta página web, con fines
          comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de EVENOR
          TECH, S.L.U.
        </p>
        <p className="text-sm leading-relaxed">
          El usuario se compromete a respetar los derechos de Propiedad Intelectual e Industrial titularidad
          de EVENOR TECH, S.L.U. Podrá visualizar los elementos del portal e incluso imprimirlos, copiarlos
          y almacenarlos en el disco duro de su ordenador o en cualquier otro soporte físico siempre y cuando
          sea, única y exclusivamente, para su uso personal y privado.
        </p>
      </section>

      {/* Acciones legales y jurisdicción */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Acciones legales, legislación aplicable y jurisdicción</h2>
        <p className="mb-3 text-sm leading-relaxed">
          Si el usuario desea presentar una reclamación, deberá contactar mediante el correo electrónico{' '}
          <a href="mailto:info@evenor-tech.com" className="text-[#a1db87] underline hover:text-[#8bc96a] transition-colors">
            info@evenor-tech.com
          </a>. Asimismo, EVENOR TECH, S.L.U. dispone de hojas oficiales de reclamación a disposición de
          los consumidores y usuarios.
        </p>
        <p className="mb-3 text-sm leading-relaxed">
          EVENOR TECH, S.L.U. se reserva la facultad de presentar las acciones civiles o penales que
          considere oportunas por la utilización indebida de su sitio web y contenidos, o por el
          incumplimiento de las presentes condiciones.
        </p>
        <p className="text-sm leading-relaxed">
          La relación entre el usuario y el prestador se regirá por la normativa vigente y de aplicación en
          el territorio español. De surgir cualquier controversia, las partes podrán someter sus conflictos
          a arbitraje o acudir a la jurisdicción ordinaria cumpliendo con las normas sobre jurisdicción y
          competencia al respecto.
        </p>
      </section>

      <div className="border-t border-[#2a2a2a] pt-6 flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-gray-500">
        <p><strong className="text-gray-400">Última actualización:</strong> 4 de mayo de 2026</p>
        <div className="flex gap-4">
          <Link to="/privacidad" className="text-[#a1db87] hover:text-[#8bc96a] transition-colors">Política de Privacidad</Link>
          <Link to="/cookies" className="text-[#a1db87] hover:text-[#8bc96a] transition-colors">Política de Cookies</Link>
        </div>
      </div>
    </motion.div>
  );
}
