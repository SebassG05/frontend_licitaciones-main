import React from "react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CookiesPolicy() {
  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-10 text-gray-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-[#a1db87] mb-1">Política de Cookies</h1>
      <p className="text-xs text-gray-500 mb-8">www.evenos-tech.com</p>

      {/* Introducción */}
      <section className="mb-8">
        <p className="text-sm leading-relaxed mb-3">
          Conforme a lo dispuesto en el artículo 22.2 de la Ley 34/2002, de 11 de julio, de Servicios de la
          Sociedad de la Información y de Comercio Electrónico (LSSI-CE), <strong className="text-white">EVENOR TECH, S.L.U.</strong>{' '}
          debe cumplir con la obligación de informar sobre las cookies que utiliza y sus finalidades.
        </p>
        <p className="text-sm leading-relaxed mb-3">
          Este sitio web utiliza cookies y/o tecnologías similares que almacenan y recuperan información cuando
          navegas. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información
          sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que
          contenga y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario.
        </p>
        <p className="text-sm leading-relaxed">
          Las cookies son esenciales para el funcionamiento de internet, aportando innumerables ventajas en la
          prestación de servicios interactivos, facilitándole al usuario la navegación y usabilidad de nuestra web.
        </p>
      </section>

      {/* Tipos de cookies */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Tipos de cookies</h2>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-[#a1db87] mb-2">Según la entidad que las gestione</h3>
            <div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
              <table className="w-full">
                <tbody>
                  {[
                    ['Cookies propias', 'Son aquellas que se envían al equipo terminal del usuario desde un equipo o dominio gestionado por el propio editor y desde el que se presta el servicio solicitado por el usuario.'],
                    ['Cookies de tercero', 'Son aquellas que se envían al equipo terminal del usuario desde un equipo o dominio que no es gestionado por el editor, sino por otra entidad que trata los datos obtenidos a través de las cookies.'],
                  ].map(([key, val]) => (
                    <tr key={key} className="border-b border-[#2a2a2a] last:border-0">
                      <td className="px-4 py-3 font-semibold text-[#a1db87] bg-[#1a1a1a] w-44 align-top">{key}</td>
                      <td className="px-4 py-3 text-gray-300 bg-[#232323]">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#a1db87] mb-2">Según el plazo de tiempo que permanezcan activadas</h3>
            <div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
              <table className="w-full">
                <tbody>
                  {[
                    ['Cookies de sesión', 'Son aquellas diseñadas para recabar y almacenar datos mientras el usuario accede a una página web. Se emplean para almacenar información que solo interesa conservar para la prestación del servicio solicitado en una sola ocasión y desaparecen al terminar la sesión.'],
                    ['Cookies persistentes', 'Son aquellas en las que los datos siguen almacenados en el terminal y pueden ser accedidos y tratados durante un periodo definido por el responsable de la cookie, que puede ir de unos minutos a varios años.'],
                  ].map(([key, val]) => (
                    <tr key={key} className="border-b border-[#2a2a2a] last:border-0">
                      <td className="px-4 py-3 font-semibold text-[#a1db87] bg-[#1a1a1a] w-44 align-top">{key}</td>
                      <td className="px-4 py-3 text-gray-300 bg-[#232323]">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#a1db87] mb-2">Según su finalidad</h3>
            <div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
              <table className="w-full">
                <tbody>
                  {[
                    ['Cookies técnicas', 'Son aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las diferentes opciones o servicios que en ella existan.'],
                    ['Cookies de personalización', 'Permiten aplicar características propias para la navegación del usuario por el website (ej. idioma).'],
                    ['Cookies de análisis', 'Son aquellas que permiten al responsable el seguimiento y análisis del comportamiento de los usuarios de los sitios web a los que están vinculadas, incluida la cuantificación de los impactos de los anuncios. La información se utiliza en la medición de la actividad de los sitios web con el fin de introducir mejoras.'],
                    ['Cookies publicitarias', 'Permiten al editor incluir en la página web espacios publicitarios, según el contenido de la propia web.'],
                    ['Cookies de publicidad comportamental', 'Son aquellas que almacenan información del comportamiento de los usuarios obtenida a través de la observación continuada de sus hábitos de navegación, lo que permite desarrollar un perfil específico para mostrar publicidad en función del mismo.'],
                  ].map(([key, val]) => (
                    <tr key={key} className="border-b border-[#2a2a2a] last:border-0">
                      <td className="px-4 py-3 font-semibold text-[#a1db87] bg-[#1a1a1a] w-44 align-top">{key}</td>
                      <td className="px-4 py-3 text-gray-300 bg-[#232323]">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Tabla cookies propias */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Cookies propias</h2>
        <div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#a1db87]/10 border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left text-[#a1db87] font-semibold">Tipo</th>
                <th className="px-4 py-3 text-left text-[#a1db87] font-semibold">Titular</th>
                <th className="px-4 py-3 text-left text-[#a1db87] font-semibold">Cookie</th>
                <th className="px-4 py-3 text-left text-[#a1db87] font-semibold">Finalidad</th>
                <th className="px-4 py-3 text-left text-[#a1db87] font-semibold">Conservación</th>
              </tr>
            </thead>
            <tbody>
              {['Técnicas', 'Personalización', 'Análisis', 'Publicidad / Publicidad comportamental'].map((tipo) => (
                <tr key={tipo} className="border-b border-[#2a2a2a] last:border-0">
                  <td className="px-4 py-3 text-gray-400 bg-[#1a1a1a] align-top whitespace-nowrap">{tipo}</td>
                  <td className="px-4 py-3 text-gray-500 bg-[#232323] text-xs italic" colSpan={4}>
                    — Por completar con las cookies reales instaladas por el sitio —
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          * Esta tabla debe completarse con los nombres reales de las cookies técnicas, analíticas y de publicidad instaladas en el sitio.
        </p>
      </section>

      {/* Tabla cookies de terceros */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Cookies de terceros</h2>
        <div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#a1db87]/10 border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left text-[#a1db87] font-semibold">Tipo</th>
                <th className="px-4 py-3 text-left text-[#a1db87] font-semibold">Titular</th>
                <th className="px-4 py-3 text-left text-[#a1db87] font-semibold">Cookie</th>
                <th className="px-4 py-3 text-left text-[#a1db87] font-semibold">Finalidad</th>
                <th className="px-4 py-3 text-left text-[#a1db87] font-semibold">Conservación</th>
              </tr>
            </thead>
            <tbody>
              {['Técnicas', 'Personalización', 'Análisis', 'Publicidad / Publicidad comportamental'].map((tipo) => (
                <tr key={tipo} className="border-b border-[#2a2a2a] last:border-0">
                  <td className="px-4 py-3 text-gray-400 bg-[#1a1a1a] align-top whitespace-nowrap">{tipo}</td>
                  <td className="px-4 py-3 text-gray-500 bg-[#232323] text-xs italic" colSpan={4}>
                    — Por completar con las cookies de terceros instaladas por el sitio —
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          Puede informarse de las transferencias internacionales a terceros países que, en su caso, realizan los terceros identificados en sus correspondientes políticas de privacidad.
        </p>
      </section>

      {/* Gestión de cookies */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Gestión de cookies</h2>
        <p className="text-sm leading-relaxed mb-3">
          El usuario puede modificar su configuración de cookies en cualquier momento. Si acepta las cookies
          de terceros, deberá eliminarlas desde las opciones del navegador o desde el sistema ofrecido por el
          propio tercero.
        </p>
        <p className="text-sm font-medium text-gray-400 mb-2">
          Puede modificar la configuración de su navegador sobre el uso de cookies en los siguientes enlaces:
        </p>
        <ul className="space-y-1 text-sm">
          {[
            ['Firefox', 'https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en'],
            ['Chrome', 'http://support.google.com/chrome/bin/answer.py?hl=es&answer=95647'],
            ['Internet Explorer', 'http://windows.microsoft.com/es-es/internet-explorer/delete-manage-cookies#ie=ie-10'],
            ['Microsoft Edge', 'https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09'],
            ['Safari', 'https://support.apple.com/kb/ph17191?locale=es_ES'],
            ['Opera', 'https://help.opera.com/en/latest/web-preferences/#cookies'],
          ].map(([nav, url]) => (
            <li key={nav}>
              <span className="font-semibold text-gray-300">{nav}:</span>{' '}
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#a1db87] underline hover:text-[#8bc96a] transition-colors break-all">
                {url}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="border-t border-[#2a2a2a] pt-6 flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs text-gray-500">
        <p><strong className="text-gray-400">Última actualización:</strong> 4 de mayo de 2026</p>
        <div className="flex gap-4">
          <Link to="/privacidad" className="text-[#a1db87] hover:text-[#8bc96a] transition-colors">Política de Privacidad</Link>
          <Link to="/aviso-legal" className="text-[#a1db87] hover:text-[#8bc96a] transition-colors">Aviso Legal</Link>
        </div>
      </div>
    </motion.div>
  );
}

