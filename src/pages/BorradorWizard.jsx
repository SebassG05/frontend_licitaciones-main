import React, { useState, useEffect, useRef } from "react";
import "./BorradorWizard.css";
import { useAuth } from "../context/AuthContext";
import PremiumPopup from "../components/ui/PremiumPopup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SECTIONS = [
  "Título y resumen",
  "Justificación / Contexto",
  "Objetivos",
  "Equipo",
  "Metodología",
  "Plan de trabajo / Cronograma",
  "Resultados esperados",
  "Impacto",
  "Presupuesto",
  "Ética y sostenibilidad",
  "Anexos"
];

function BorradorWizard() {
  const [fields, setFields] = useState(() => {
    const temp = localStorage.getItem("wizard_propuesta_temp");
    return temp ? JSON.parse(temp) : Array(SECTIONS.length).fill("");
  });
  const [editId, setEditId] = useState(null);
  const [autoSaved, setAutoSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    // Si hay id de edición, lo tomamos y lo limpiamos
    const id = localStorage.getItem("wizard_propuesta_edit_id");
    if (id) {
      setEditId(Number(id));
      localStorage.removeItem("wizard_propuesta_edit_id");
    }
  }, []);

  // Eliminar navegación por pasos

  // Autoguardado en tiempo real (debounce)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem("wizard_propuesta_temp", JSON.stringify(fields));
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 900);
    }, 500);
    return () => clearTimeout(timerRef.current);
  }, [fields]);

  const handleChange = (idx, value) => {
    const newFields = [...fields];
    newFields[idx] = value;
    setFields(newFields);
  };

  const handleFinish = () => {
    // Validación: al menos los primeros 3 campos deben estar completos
    const requiredIdx = [0, 1, 2];
    const emptyIdx = requiredIdx.filter(idx => !fields[idx] || fields[idx].trim() === "");
    if (emptyIdx.length > 0) {
      setErrorMsg("Por favor, completa los campos obligatorios: " + emptyIdx.map(idx => SECTIONS[idx]).join(", "));
      setTimeout(() => setErrorMsg("") , 2500);
      return;
    }
    let borradores = JSON.parse(localStorage.getItem("borradores_propuesta") || "[]");
    if (editId) {
      borradores = borradores.map(b =>
        b.id === editId
          ? { ...b, contenido: SECTIONS.map((section, idx) => ({ titulo: section, texto: fields[idx] })) }
          : b
      );
    } else {
      const nuevoBorrador = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        contenido: SECTIONS.map((section, idx) => ({
          titulo: section,
          texto: fields[idx]
        }))
      };
      borradores = [nuevoBorrador, ...borradores];
    }
    localStorage.setItem("borradores_propuesta", JSON.stringify(borradores));
    localStorage.removeItem("wizard_propuesta_temp");
    setFields(Array(SECTIONS.length).fill(""));
    navigate("/borrador-propuestas");
  };

  const { isAuthenticated } = useAuth();
  const [showPremium, setShowPremium] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) setShowPremium(true);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <PremiumPopup
        isOpen={showPremium}
        onClose={() => setShowPremium(false)}
        onLoginClick={() => window.dispatchEvent(new CustomEvent('openLogin'))}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-[#232323] rounded-xl p-8 border border-[#333333] shadow-lg">
        <h2 className="text-2xl font-bold text-[#a1db87] mb-6">Ficha de propuesta</h2>
        <form onSubmit={e => { e.preventDefault(); handleFinish(); }}>
          <div className="flex flex-col gap-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {SECTIONS.map((section, idx) => (
              <div key={section} className="flex flex-col">
                <label className="font-semibold text-[#a1db87] mb-2">{section}</label>
                <textarea
                  className="w-full min-h-[140px] bg-[#181818] border border-[#a1db87] rounded-lg px-4 py-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-[#a1db87] transition-all"
                  value={fields[idx]}
                  onChange={e => handleChange(idx, e.target.value)}
                  placeholder={`Escribe aquí el contenido de \"${section}\"...`}
                />
              </div>
            ))}
          </div>
          {errorMsg && (
            <div className="text-red-400 font-semibold mt-6 mb-4">{errorMsg}</div>
          )}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-[#a1db87] text-[#181818] px-6 py-3 rounded-lg font-bold shadow hover:bg-[#8bc96a] transition-all"
            >Guardar borrador</button>
          </div>
          {autoSaved && (
            <div className="text-xs text-[#a1db87] mt-2">Guardado automático...</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default BorradorWizard;

