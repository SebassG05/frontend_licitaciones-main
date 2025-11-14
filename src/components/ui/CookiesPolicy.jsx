import React from "react";
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
      <h1 className="text-3xl font-bold text-[#a1db87] mb-6">Política de Cookies</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. ¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos que se almacenan en tu dispositivo cuando navegas por nuestra web. Permiten mejorar la experiencia, recordar preferencias y analizar el uso de la plataforma.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Tipos de cookies que utilizamos</h2>
        <ul className="list-disc pl-5">
          <li><span className="text-[#a1db87]">Cookies necesarias:</span> Permiten el funcionamiento básico de la web y no pueden desactivarse.</li>
          <li><span className="text-[#a1db87]">Cookies de análisis:</span> Nos ayudan a entender cómo usas la plataforma y mejorar el servicio.</li>
          <li><span className="text-[#a1db87]">Cookies de personalización:</span> Adaptan el contenido y la experiencia a tus intereses.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Gestión de cookies</h2>
        <p>
          Puedes aceptar, rechazar o configurar las cookies desde el aviso de cookies o los ajustes de tu navegador. Consulta nuestra configuración en el pie de página.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Cambios en la política</h2>
        <p>
          Nos reservamos el derecho de actualizar esta política en cualquier momento. Revisa periódicamente para estar informado.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Contacto</h2>
        <p>
          Para cualquier consulta sobre cookies, puedes contactarnos en <a href="mailto:info@evenor-tech.com" className="text-[#a1db87] underline">info@evenor-tech.com</a>.
        </p>
      </section>
      <p className="text-xs text-gray-500 mt-8">Última actualización: Noviembre 2025</p>
  </motion.div>
  );
}
