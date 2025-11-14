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
      <h1 className="text-3xl font-bold text-[#a1db87] mb-6">Política de Privacidad</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Responsable del Tratamiento</h2>
        <p>
          El responsable de tus datos es Evenor-Tech, S.L. Puedes contactar en <a href="mailto:info@evenor-tech.com" className="text-[#a1db87] underline">info@evenor-tech.com</a>.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Datos Recogidos</h2>
        <ul className="list-disc pl-5">
          <li>Datos de registro: nombre, email y contraseña.</li>
          <li>Datos de uso: información sobre cómo utilizas la plataforma.</li>
          <li>Cookies y tecnologías similares (ver <Link to="/cookies" className="text-[#a1db87] underline">Política de Cookies</Link>).</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Finalidad del Tratamiento</h2>
        <ul className="list-disc pl-5">
          <li>Gestionar tu cuenta y acceso a la plataforma.</li>
          <li>Mejorar el servicio y la experiencia de usuario.</li>
          <li>Enviar comunicaciones relacionadas con la plataforma.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Derechos del Usuario</h2>
        <ul className="list-disc pl-5">
          <li>Acceder, rectificar o suprimir tus datos.</li>
          <li>Solicitar la limitación u oposición al tratamiento.</li>
          <li>Portabilidad de tus datos.</li>
        </ul>
        <p className="mt-2">Puedes ejercer tus derechos escribiendo a <a href="mailto:info@evenor-tech.com" className="text-[#a1db87] underline">info@evenor-tech.com</a>.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Conservación de los Datos</h2>
        <p>
          Tus datos se conservarán mientras mantengas tu cuenta activa o hasta que solicites su eliminación.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Seguridad</h2>
        <p>
          Aplicamos medidas técnicas y organizativas para proteger tus datos personales.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de actualizar esta política en cualquier momento. Revisa periódicamente para estar informado.
        </p>
      </section>
      <p className="text-xs text-gray-500 mt-8">Última actualización: Noviembre 2025</p>
  </motion.div>
  );
}
