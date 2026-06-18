import React from "react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-10 text-gray-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-[#a1db87] mb-1">Política de Privacidad</h1>
      <p className="text-xs text-gray-500 mb-8">www.evenos-tech.com</p>

      {/* Datos del responsable */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Datos del responsable</h2>
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

      {/* Introducción */}
      <section className="mb-8">
        <p className="text-sm leading-relaxed">
          De conformidad con la normativa vigente y aplicable en protección de datos de carácter personal, le
          informamos que sus datos serán incorporados al sistema de tratamiento titularidad de{' '}
          <strong className="text-white">EVENOR TECH, S.L.U.</strong> con NIF B91790527 y domicilio social
          sito en Avda. República Argentina, 27 B, 41011 Sevilla (Sevilla). A continuación, se facilita la
          información de los tratamientos realizados.
        </p>
      </section>

      {/* Tratamientos realizados */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Tratamientos realizados</h2>
        <div className="space-y-4">
          {[
            {
              nombre: 'Acciones comerciales formulario web',
              finalidad: 'Captación, registro y tratamiento de datos con finalidades de atender sus consultas y/o solicitudes, así como de publicidad y prospección comercial.',
              conservacion: 'Mientras se mantenga el consentimiento prestado, salvo obligación legal.',
              base: 'El consentimiento del interesado.',
              datos: 'Nombre y apellidos, dirección electrónica.',
            },
            {
              nombre: 'Gestión usuarios web',
              finalidad: 'Captación, registro y tratamiento de datos del usuario.',
              conservacion: 'Mientras se mantenga el consentimiento prestado, salvo obligación legal.',
              base: 'El consentimiento del interesado.',
              datos: 'Nombre y apellidos, dirección electrónica.',
            },
            {
              nombre: 'Newsletter',
              finalidad: 'Gestión de la suscripción a la newsletter, para realizar los envíos correspondientes.',
              conservacion: 'Mientras se mantenga el consentimiento prestado.',
              base: 'El consentimiento del interesado.',
              datos: 'Nombre y apellidos, dirección electrónica.',
            },
            {
              nombre: 'Instalación de cookies',
              finalidad: 'Gestión e instalación de las cookies.',
              conservacion: 'Mientras se mantenga el consentimiento prestado.',
              base: 'El consentimiento del interesado.',
              datos: 'Dirección electrónica, dirección IP.',
            },
            {
              nombre: 'Gestión formulario web',
              finalidad: 'Atender sus consultas y/o solicitudes.',
              conservacion: 'Mientras se mantenga el consentimiento prestado.',
              base: 'El consentimiento del interesado.',
              datos: 'Nombre y apellidos, dirección electrónica, dirección IP.',
            },
          ].map((t) => (
            <div key={t.nombre} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-sm">
              <h3 className="font-semibold text-[#a1db87] mb-2">{t.nombre}</h3>
              <ul className="space-y-1 text-gray-300">
                <li><span className="font-medium text-gray-400">Finalidad:</span> {t.finalidad}</li>
                <li><span className="font-medium text-gray-400">Plazo de conservación:</span> {t.conservacion}</li>
                <li><span className="font-medium text-gray-400">Base legítima:</span> {t.base}</li>
                <li><span className="font-medium text-gray-400">Datos tratados:</span> {t.datos}</li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Derechos de los interesados */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Derechos de los interesados</h2>
        <p className="text-sm leading-relaxed mb-4">
          EVENOR TECH, S.L.U. informa a los usuarios que podrán ejercer los siguientes derechos ante el
          Responsable del Tratamiento:
        </p>
        <ul className="space-y-3 text-sm">
          {[
            ['Derecho de Acceso', 'Obtener confirmación sobre si se están tratando sus datos y, en tal caso, los datos concretos y la información legal del tratamiento (finalidades, base legitimadora, plazos de conservación, cesiones, origen de los datos, etc.).'],
            ['Derecho de Rectificación', 'Solicitar que se modifiquen los datos que resulten ser inexactos o incompletos.'],
            ['Derecho a la Limitación de tratamiento', 'Solicitar que se limiten los fines del tratamiento previstos de forma original por el responsable del tratamiento en determinados supuestos.'],
            ['Derecho de Supresión', 'Solicitar la supresión de los datos de carácter personal, a excepción de lo previsto en el propio RGPD.'],
            ['Derecho a la Portabilidad', 'Recibir los datos personales en un formato estructurado, de uso común y lectura mecánica, y transmitirlos a otro responsable cuando el tratamiento esté basado en el consentimiento.'],
            ['Derecho de Oposición', 'Solicitar que no se lleve a cabo el tratamiento de sus datos o que cese el tratamiento cuando esté basado en el interés legítimo o en tratamientos de mercadotecnia directa.'],
            ['Derecho a no ser objeto de decisiones automatizadas', 'No ser objeto de una decisión basada únicamente en el tratamiento automatizado, incluida la elaboración de perfiles, que produzca efectos jurídicos o le afecte significativamente.'],
            ['Derecho a retirar el consentimiento', 'Para cualquier tratamiento basado en su consentimiento, tiene derecho a retirarlo en cualquier momento y de manera gratuita.'],
          ].map(([titulo, desc]) => (
            <li key={titulo} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <span className="font-semibold text-[#a1db87]">{titulo}:</span>{' '}
              <span className="text-gray-300">{desc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Cómo ejercer los derechos */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Cómo ejercer tus derechos</h2>
        <p className="text-sm leading-relaxed mb-3">
          Para ejercer cualquiera de los derechos descritos, deberás dirigirte a EVENOR TECH, S.L.U. mediante:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>
            <strong className="text-gray-300">Correo electrónico:</strong>{' '}
            <a href="mailto:info@evenor-tech.com" className="text-[#a1db87] underline hover:text-[#8bc96a] transition-colors">
              info@evenor-tech.com
            </a>
          </li>
          <li>
            <strong className="text-gray-300">Dirección postal:</strong> Avda. República Argentina, 27 B, 41011 Sevilla (Sevilla) — A la atención de EVENOR TECH, S.L.U.
          </li>
        </ul>
        <p className="text-sm leading-relaxed mt-3">
          La solicitud deberá incluir identificación fehaciente del solicitante, petición en que se concreta la
          solicitud y dirección de contacto a efectos de notificaciones.
        </p>
        <p className="text-sm leading-relaxed mt-3">
          Asimismo, tiene derecho a presentar una reclamación ante la{' '}
          <a
            href="https://www.aepd.es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#a1db87] underline hover:text-[#8bc96a] transition-colors"
          >
            Agencia Española de Protección de Datos (AEPD)
          </a>{' '}
          si considera que un hecho puede suponer un incumplimiento de la normativa aplicable.
        </p>
      </section>

      {/* Redes Sociales */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Política de privacidad en redes sociales</h2>
        <p className="text-sm leading-relaxed mb-3">
          De conformidad con lo establecido en la normativa vigente de protección de datos y la Ley 34/2002
          (LSSI-CE), EVENOR TECH, S.L.U. ha procedido a crear un perfil en las redes sociales{' '}
          <strong className="text-white">Facebook, X (Twitter), Instagram y LinkedIn</strong>, con la
          finalidad principal de publicitar sus productos y servicios.
        </p>
        <p className="text-sm leading-relaxed mb-3">
          Al unirse a nuestra página en cualquier red social, el usuario facilita su consentimiento para el
          tratamiento de aquellos datos personales publicados en su perfil. EVENOR TECH, S.L.U. únicamente
          tiene acceso y trata la información pública del usuario (en especial, su nombre de contacto). Estos
          datos solo son utilizados dentro de la propia red social y no son incorporados a ningún sistema de
          tratamiento.
        </p>
        <p className="text-sm leading-relaxed mb-4">
          EVENOR TECH, S.L.U. realizará las siguientes actuaciones en redes sociales:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm mb-4">
          <li>Acceso a la información pública del perfil.</li>
          <li>Publicación en el perfil del usuario de información ya publicada en nuestra página.</li>
          <li>Envío de mensajes personales e individuales a través de los canales de la red social.</li>
          <li>Actualizaciones del estado de la página que se publicarán en el perfil del usuario.</li>
        </ul>
        <p className="text-sm leading-relaxed mb-4">
          Se prohíbe expresamente cualquier publicación en la página que atente contra la moral, la ética, el
          buen gusto o el decoro, y/o que infrinja los derechos de propiedad intelectual o industrial, el
          derecho a la imagen o la Ley.
        </p>
        <p className="text-sm font-medium text-gray-400 mb-2">Políticas de privacidad de las redes sociales:</p>
        <ul className="space-y-1 text-sm">
          {[
            ['Facebook', 'https://es-es.facebook.com/privacy/explanation'],
            ['X (Twitter)', 'https://x.com/es/privacy'],
            ['Instagram', 'http://instagram.com/about/legal/privacy/'],
            ['LinkedIn', 'https://es.linkedin.com/legal/privacy-policy'],
          ].map(([red, url]) => (
            <li key={red}>
              <span className="text-gray-400">{red}: </span>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#a1db87] underline hover:text-[#8bc96a] transition-colors break-all">
                {url}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Seguridad */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Medidas de seguridad</h2>
        <p className="text-sm leading-relaxed">
          EVENOR TECH, S.L.U. se compromete a adoptar las medidas técnicas y organizativas necesarias, acorde
          al nivel de riesgos que acompañan los tratamientos, de forma que garanticen su integridad,
          confidencialidad y disponibilidad.
        </p>
      </section>

      <div className="border-t border-[#2a2a2a] pt-6 flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-gray-500">
        <p><strong className="text-gray-400">Última actualización:</strong> 4 de mayo de 2026</p>
        <div className="flex gap-4">
          <Link to="/aviso-legal" className="text-[#a1db87] hover:text-[#8bc96a] transition-colors">Aviso Legal</Link>
          <Link to="/cookies" className="text-[#a1db87] hover:text-[#8bc96a] transition-colors">Política de Cookies</Link>
        </div>
      </div>
    </motion.div>
  );
}


