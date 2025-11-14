import React from "react";
import { motion } from 'framer-motion';

export default function TermsOfUse() {
  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-10 text-gray-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-[#a1db87] mb-6">Términos de Uso</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introducción</h2>
        <p>
          Bienvenido a Plataforma de Licitaciones. Al acceder y utilizar este sitio web, aceptas cumplir con estos Términos de Uso. Si no estás de acuerdo, por favor no utilices la plataforma.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Uso de la Plataforma</h2>
        <ul className="list-disc pl-5">
          <li>La información publicada es solo para fines informativos y no constituye asesoramiento legal o profesional.</li>
          <li>No está permitido el uso indebido, copia o distribución no autorizada de los contenidos.</li>
          <li>Nos reservamos el derecho de modificar, suspender o eliminar cualquier parte de la plataforma sin previo aviso.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Privacidad y Cookies</h2>
        <p>
          Consulta nuestra <a href="/privacidad" className="text-[#a1db87] underline">Política de Privacidad</a> y <a href="/cookies" className="text-[#a1db87] underline">Política de Cookies</a> para saber cómo gestionamos tus datos.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Responsabilidad</h2>
        <ul className="list-disc pl-5">
          <li>No garantizamos la exactitud, integridad o actualidad de la información publicada.</li>
          <li>No nos hacemos responsables por daños derivados del uso de la plataforma.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de actualizar estos Términos de Uso en cualquier momento. Te recomendamos revisarlos periódicamente.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Contacto</h2>
        <p>
          Para cualquier consulta sobre estos términos, puedes contactarnos en <a href="mailto:info@evenor-tech.com" className="text-[#a1db87] underline">info@evenor-tech.com</a>.
        </p>
      </section>
      <p className="text-xs text-gray-500 mt-8">Última actualización: Noviembre 2025</p>
  </motion.div>
  );
}
