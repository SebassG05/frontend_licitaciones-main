import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PremiumPopup from "../components/ui/PremiumPopup";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, CheckCircle, FileDown, FileText, Share2, Mail } from "lucide-react";

export default function BorradorPropuestasPage() {
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

// ...existing code...

  const [shareMsg, setShareMsg] = useState("");

  // Compartir por Instagram (copia texto y enlace)
  const handleShareInstagram = (borrador) => {
    const data = btoa(JSON.stringify(borrador));
    const url = `${window.location.origin}/borrador-propuestas?share=${data}`;
    const text = `Borrador de propuesta: ${borrador.contenido[0]?.texto || ''} - ${url}`;
    navigator.clipboard.writeText(text);
    setShareMsg('Texto copiado para Instagram. Pega en tu historia o mensaje.');
    setTimeout(() => setShareMsg(''), 1800);
  };
  const handleShareWhatsApp = (borrador) => {
    const data = btoa(JSON.stringify(borrador));
    const url = `${window.location.origin}/borrador-propuestas?share=${data}`;
    const text = `Borrador de propuesta: ${borrador.contenido[0]?.texto || ''} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };
  const handleShareTwitter = (borrador) => {
    const data = btoa(JSON.stringify(borrador));
    const url = `${window.location.origin}/borrador-propuestas?share=${data}`;
    const text = `Borrador de propuesta: ${borrador.contenido[0]?.texto || ''}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };
  const handleShareLinkedIn = (borrador) => {
    const data = btoa(JSON.stringify(borrador));
    const url = `${window.location.origin}/borrador-propuestas?share=${data}`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };
  const handleShareLink = (borrador) => {
    const data = btoa(JSON.stringify(borrador));
    const url = `${window.location.origin}/borrador-propuestas?share=${data}`;
    navigator.clipboard.writeText(url);
    setShareMsg('Enlace copiado al portapapeles');
    setTimeout(() => setShareMsg(''), 1200);
  };
  const handleShareEmail = (borrador) => {
    let body = `Borrador de propuesta: ${borrador.contenido[0]?.texto || ''}%0D%0A%0D%0A`;
    borrador.contenido.forEach(section => {
      body += `* ${section.titulo}: %0D%0A${section.texto || '(vacío)'}%0D%0A%0D%0A`;
    });
    const mailto = `mailto:?subject=Borrador de propuesta&body=${body}`;
    window.open(mailto, '_blank');
  };

  const { isAuthenticated } = useAuth();
  const [showPremium, setShowPremium] = useState(false);
  const navigate = useNavigate();
  const [borradores, setBorradores] = useState([]);
  useEffect(() => {
    if (!isAuthenticated) setShowPremium(true);
  }, [isAuthenticated]);

  // ...todos los hooks y funciones...

  // Mostrar PremiumPopup si no está autenticado
  if (!isAuthenticated) {
    return (
      <PremiumPopup
        isOpen={showPremium}
        onClose={() => setShowPremium(false)}
        onLoginClick={() => window.dispatchEvent(new CustomEvent('openLogin'))}
      />
    );
  }
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [contentFilter, setContentFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [favOnly, setFavOnly] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("borradores_propuesta") || "[]");
    setBorradores(data);
  }, []);

  // Añadir etiqueta/categoría a borrador
  const handleAddTag = (id, tag) => {
    const nuevos = borradores.map(b => b.id === id ? { ...b, tag: tag } : b);
    setBorradores(nuevos);
    localStorage.setItem("borradores_propuesta", JSON.stringify(nuevos));
  };

  // Marcar como favorito
  const handleToggleFav = (id) => {
    const nuevos = borradores.map(b => b.id === id ? { ...b, fav: !b.fav } : b);
    setBorradores(nuevos);
    localStorage.setItem("borradores_propuesta", JSON.stringify(nuevos));
  };

  // Filtrar borradores avanzados
  const filtered = borradores.filter(b => {
    const title = b.contenido[0]?.texto?.toLowerCase() || "";
    const matchesTitle = title.includes(search.toLowerCase());
    const date = new Date(b.fecha);
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    const matchesFrom = from ? date >= from : true;
    const matchesTo = to ? date <= to : true;
    // Filtro por sección
    let matchesSection = true;
    if (sectionFilter !== "all") {
      const idx = SECTIONS.findIndex(s => s === sectionFilter);
      if (idx !== -1) {
        matchesSection = (b.contenido[idx]?.texto?.toLowerCase() || "").includes(contentFilter.toLowerCase());
      }
    } else if (contentFilter) {
      matchesSection = b.contenido.some(sec => (sec.texto?.toLowerCase() || "").includes(contentFilter.toLowerCase()));
    }
    // Filtro por etiqueta/categoría
    const matchesTag = tagFilter ? (b.tag?.toLowerCase() || "").includes(tagFilter.toLowerCase()) : true;
    // Filtro favoritos
    const matchesFav = favOnly ? b.fav : true;
    return matchesTitle && matchesFrom && matchesTo && matchesSection && matchesTag && matchesFav;
  });

  // Confirmación visual al eliminar
  const [deletedMsg, setDeletedMsg] = useState(false);
  const handleDelete = (id) => {
    const nuevos = borradores.filter(b => b.id !== id);
    setBorradores(nuevos);
    localStorage.setItem("borradores_propuesta", JSON.stringify(nuevos));
    setDeletedMsg(true);
    setTimeout(() => setDeletedMsg(false), 1200);
  };

  // Ver borrador (modal mejorado)
  const [modal, setModal] = useState(null);
  const handleView = (borrador) => setModal(borrador);
  const handleCloseModal = () => setModal(null);
  // Permitir copiar contenido al portapapeles
  const handleCopy = (section) => {
    navigator.clipboard.writeText(section.texto || "");
  };
  // Opciones de personalización PDF
  const [pdfOptions, setPdfOptions] = useState({
    color: '#a1db87',
    font: 'sans-serif',
    titulo: 'Borrador Propuesta'
  });
  // Exportar borrador a PDF
  const handleExportPDF = (borrador) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>${pdfOptions.titulo}</title></head><body style="font-family:${pdfOptions.font};">`);
    win.document.write(`<h1 style="color:${pdfOptions.color};">${borrador.contenido[0]?.texto || 'Sin título'}</h1>`);
    borrador.contenido.forEach(section => {
      win.document.write(`<h2 style="color:${pdfOptions.color};">${section.titulo}</h2>`);
      win.document.write(`<p>${section.texto ? section.texto.replace(/\n/g,'<br>') : '<span style=\'color:gray\'>(vacío)</span>'}</p>`);
    });
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  // Exportar borrador a Markdown
  const handleExportMarkdown = (borrador) => {
    let md = `# ${borrador.contenido[0]?.texto || 'Sin título'}\n\n`;
    borrador.contenido.forEach(section => {
      md += `## ${section.titulo}\n`;
      md += `${section.texto || '(vacío)'}\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${borrador.contenido[0]?.texto || 'borrador'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Exportar borrador a Word (.doc)
  const handleExportWord = (borrador) => {
    let html = `<h1>${borrador.contenido[0]?.texto || 'Sin título'}</h1>`;
    borrador.contenido.forEach(section => {
      html += `<h2>${section.titulo}</h2>`;
      html += `<p>${section.texto ? section.texto.replace(/\n/g,'<br>') : '(vacío)'}</p>`;
    });
    const blob = new Blob([
      `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Documento</title></head><body>${html}</body></html>`
    ], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${borrador.contenido[0]?.texto || 'borrador'}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Editar borrador (redirige al wizard con datos, confirmación visual)
  const [editMsg, setEditMsg] = useState(false);
  const handleEdit = (borrador) => {
    localStorage.setItem("wizard_propuesta_temp", JSON.stringify(borrador.contenido.map(c => c.texto)));
    localStorage.setItem("wizard_propuesta_edit_id", borrador.id);
    setEditMsg(true);
    setTimeout(() => {
      setEditMsg(false);
      navigate("/borrador-propuestas/nuevo");
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-[#a1db87] mb-8">Borrador de Propuestas</h1>
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-center bg-[#232323] rounded-xl p-6 border border-[#333333] shadow-lg">
        <div className="flex flex-col items-start gap-2 min-w-[180px]">
          <label className="text-xs text-[#a1db87] font-semibold">Etiqueta/Categoría</label>
          <input
            type="text"
            placeholder="Filtrar por etiqueta..."
            className="bg-[#181818] border border-[#a1db87] rounded-lg px-4 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-[#a1db87] transition-all"
            value={tagFilter}
            onChange={e => setTagFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start gap-2 min-w-[120px]">
          <label className="text-xs text-[#a1db87] font-semibold">Solo favoritos</label>
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input type="checkbox" checked={favOnly} onChange={e => setFavOnly(e.target.checked)} className="accent-[#a1db87] w-4 h-4 rounded focus:ring-2 focus:ring-[#a1db87]" />
            <span className="font-medium">★</span>
          </label>
        </div>
        <div className="flex flex-col items-start gap-2 min-w-[220px]">
          <label className="text-xs text-[#a1db87] font-semibold">Título</label>
          <input
            type="text"
            placeholder="Buscar por título..."
            className="bg-[#181818] border border-[#a1db87] rounded-lg px-4 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-[#a1db87] transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start gap-2 min-w-[180px]">
          <label className="text-xs text-[#a1db87] font-semibold">Desde</label>
          <input
            type="date"
            className="bg-[#181818] border border-[#a1db87] rounded-lg px-4 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-[#a1db87] transition-all"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start gap-2 min-w-[180px]">
          <label className="text-xs text-[#a1db87] font-semibold">Hasta</label>
          <input
            type="date"
            className="bg-[#181818] border border-[#a1db87] rounded-lg px-4 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-[#a1db87] transition-all"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start gap-2 min-w-[220px]">
          <label className="text-xs text-[#a1db87] font-semibold">Sección</label>
          <select
            className="bg-[#181818] border border-[#a1db87] rounded-lg px-4 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-[#a1db87] transition-all"
            value={sectionFilter}
            onChange={e => setSectionFilter(e.target.value)}
          >
            <option value="all">Todas</option>
            {SECTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-start gap-2 min-w-[220px]">
          <label className="text-xs text-[#a1db87] font-semibold">Buscar en sección</label>
          <input
            type="text"
            placeholder="Buscar en sección..."
            className="bg-[#181818] border border-[#a1db87] rounded-lg px-4 py-2 text-white w-full focus:outline-none focus:ring-2 focus:ring-[#a1db87] transition-all"
            value={contentFilter}
            onChange={e => setContentFilter(e.target.value)}
            disabled={sectionFilter === "all" && !contentFilter}
          />
        </div>
      </div>
      <div className="mb-8">
        <button
          className="bg-[#a1db87] text-[#181818] font-bold px-6 py-3 rounded-xl shadow hover:bg-[#8bc96a] transition-all cursor-pointer"
          onClick={() => navigate('/borrador-propuestas/nuevo')}
        >
          + Crear nuevo borrador
        </button>
      </div>
      <div className="bg-[#232323] rounded-xl p-6 border border-[#333333] text-gray-300">
        <AnimatePresence>
          {deletedMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 bg-[#232323] border border-[#a1db87] text-[#a1db87] px-6 py-3 rounded-xl shadow-lg z-50 font-bold text-lg"
            >
              <CheckCircle className="inline w-5 h-5 mr-2" /> Borrador eliminado
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {editMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 bg-blue-900 border border-blue-400 text-blue-200 px-6 py-3 rounded-xl shadow-lg z-50 font-bold text-lg"
            >
              <CheckCircle className="inline w-5 h-5 mr-2" /> Editando borrador...
            </motion.div>
          )}
        </AnimatePresence>
        {filtered.length === 0 ? (
          <p>No hay borradores que coincidan con la búsqueda.</p>
        ) : (
          <ul className="space-y-4">
            {filtered.map((borrador) => (
              <li key={borrador.id} className={`border border-[#a1db87]/30 rounded-lg p-4 bg-[#181818] ${borrador.fav ? 'ring-2 ring-[#a1db87]' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-[#a1db87]">{borrador.contenido[0]?.texto || "Sin título"}</span>
                  <span className="text-xs text-gray-400">{new Date(borrador.fecha).toLocaleString()}</span>
                </div>
                <div className="flex gap-2 items-center mb-2">
                  <span className="text-xs text-[#a1db87]">{borrador.tag ? `#${borrador.tag}` : ''}</span>
                  <button
                    className={`text-xs px-2 py-1 rounded bg-[#232323] border border-[#a1db87] text-[#a1db87] hover:bg-[#181818]`}
                    onClick={() => {
                      const tag = prompt('Etiqueta/categoría para este borrador:', borrador.tag || '');
                      if (tag !== null) handleAddTag(borrador.id, tag);
                    }}
                  >{borrador.tag ? 'Editar etiqueta' : 'Añadir etiqueta'}</button>
                  <button
                    className={`text-xs px-2 py-1 rounded ${borrador.fav ? 'bg-[#a1db87] text-[#181818]' : 'bg-[#232323] text-[#a1db87]'} border border-[#a1db87] hover:bg-[#8bc96a]`}
                    onClick={() => handleToggleFav(borrador.id)}
                  >{borrador.fav ? '★ Favorito' : '☆ Favorito'}</button>
                </div>
                <div className="text-sm text-gray-300 line-clamp-2 mb-2">{borrador.contenido[1]?.texto || "Sin resumen"}</div>
                <div className="flex gap-3 mt-2">
                  <button title="Ver" className="p-2 rounded-lg hover:bg-[#232323] transition-colors" onClick={() => handleView(borrador)}>
                    <Eye className="w-5 h-5 text-[#a1db87]" />
                  </button>
                  <button title="Editar" className="p-2 rounded-lg hover:bg-[#232323] transition-colors" onClick={() => handleEdit(borrador)}>
                    <Pencil className="w-5 h-5 text-blue-400" />
                  </button>
                  <button title="Eliminar" className="p-2 rounded-lg hover:bg-[#232323] transition-colors" onClick={() => handleDelete(borrador.id)}>
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* Modal para ver borrador mejorado */}
        <AnimatePresence>
          {modal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="fixed inset-0 bg-black/40 flex justify-center items-start z-50"
              style={{ alignItems: 'flex-start', paddingTop: '11.5vh' }}
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                className="bg-[#232323] border border-[#a1db87] rounded-xl p-8 max-w-3xl w-full relative shadow-2xl"
                style={{ minHeight: '500px', maxHeight: '650px' }}
              >
                <button className="absolute top-3 right-4 text-gray-400 hover:text-[#a1db87] text-lg" onClick={handleCloseModal}>×</button>
                <h2 className="text-2xl font-bold text-[#a1db87] mb-4">{modal.contenido[0]?.texto || "Sin título"}</h2>
                <div className="space-y-3 text-gray-200 text-sm max-h-[320px] overflow-y-auto custom-scrollbar">
                  {modal.contenido.map((section, idx) => (
                    <div key={idx} className="flex items-start gap-2 group">
                      <span className="font-semibold text-[#a1db87] min-w-[120px]">{section.titulo}:</span>
                      <div className="flex-1 inline">{section.texto || <span className="text-gray-400">(vacío)</span>}</div>
                      <button
                        className="ml-2 text-xs text-gray-400 hover:text-[#a1db87] px-2 py-1 rounded transition-colors border border-transparent hover:border-[#a1db87]"
                        title="Copiar contenido"
                        onClick={() => handleCopy(section)}
                      >Copiar</button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4 mt-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
                    <button
                      className="flex items-center gap-2 bg-[#a1db87] text-[#181818] font-bold px-4 py-2 rounded-xl shadow hover:bg-[#8bc96a] transition-all cursor-pointer"
                      onClick={() => handleExportPDF(modal)}
                    >
                      <FileDown className="w-5 h-5" /> Exportar PDF
                    </button>
                    <button
                      className="flex items-center gap-2 bg-blue-200 text-blue-900 font-bold px-4 py-2 rounded-xl shadow hover:bg-blue-300 transition-all cursor-pointer"
                      onClick={() => handleExportWord(modal)}
                    >
                      <FileText className="w-5 h-5" /> Exportar Word
                    </button>
                    <button
                      className="flex items-center gap-2 bg-gray-700 text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-gray-600 transition-all cursor-pointer"
                      onClick={() => handleExportMarkdown(modal)}
                    >
                      <FileText className="w-5 h-5" /> Exportar Markdown
                    </button>
                    <button
                      className="flex items-center gap-2 bg-[#232323] text-blue-300 font-bold px-4 py-2 rounded-xl shadow hover:bg-[#181818] transition-all cursor-pointer border border-blue-300"
                      onClick={() => handleShareEmail(modal)}
                    >
                      <Mail className="w-5 h-5" /> Compartir por email
                    </button>
                    <button
                      className="flex items-center gap-2 bg-green-500 text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-green-600 transition-all cursor-pointer border border-green-500"
                      onClick={() => handleShareWhatsApp(modal)}
                    >
                      <span className="inline-block w-5 h-5"><svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.617 1.934 6.59L4 29l7.59-1.934A12.96 12.96 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.91-.52-5.59-1.51l-.4-.23-4.51 1.15 1.15-4.51-.23-.4A9.96 9.96 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.18.05-.35-.02-.49-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.49.07-.75.35-.26.28-1 1-.97 2.43.03 1.43.98 2.81 1.12 3 .14.19 1.93 2.96 4.7 4.04.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z"/></svg></span> WhatsApp
                    </button>
                    <button
                      className="flex items-center gap-2 bg-[#1da1f2] text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-[#0d8ddb] transition-all cursor-pointer border border-[#1da1f2]"
                      onClick={() => handleShareTwitter(modal)}
                    >
                      <span className="inline-block w-5 h-5"><svg viewBox="0 0 32 32" fill="currentColor"><path d="M32 6.076a13.14 13.14 0 0 1-3.769 1.031A6.601 6.601 0 0 0 31.115 4.1a13.195 13.195 0 0 1-4.169 1.594A6.563 6.563 0 0 0 22.155 3c-3.626 0-6.563 2.938-6.563 6.563 0 .514.058 1.016.17 1.496C10.272 10.87 5.444 8.613 2.228 5.149a6.52 6.52 0 0 0-.888 3.299c0 2.277 1.159 4.287 2.924 5.463a6.533 6.533 0 0 1-2.975-.822v.083c0 3.181 2.263 5.834 5.266 6.437a6.575 6.575 0 0 1-2.968.112c.837 2.613 3.266 4.513 6.146 4.563A13.172 13.172 0 0 1 0 27.025a18.575 18.575 0 0 0 10.063 2.948c12.072 0 18.681-10.004 18.681-18.68 0-.285-.007-.568-.02-.85A13.348 13.348 0 0 0 32 6.076z"/></svg></span> Twitter
                    </button>
                    <button
                      className="flex items-center gap-2 bg-[#0077b5] text-white font-bold px-4 py-2 rounded-xl shadow hover:bg-[#005983] transition-all cursor-pointer border border-[#0077b5]"
                      onClick={() => handleShareLinkedIn(modal)}
                    >
                      <span className="inline-block w-5 h-5"><svg viewBox="0 0 32 32" fill="currentColor"><path d="M27 3H5C3.346 3 2 4.346 2 6v20c0 1.654 1.346 3 3 3h22c1.654 0 3-1.346 3-3V6c0-1.654-1.346-3-3-3zM12 25H8V13h4v12zm-2-13c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2zm15 13h-4v-5.604c0-1.337-.026-3.063-1.867-3.063-1.868 0-2.154 1.459-2.154 2.967V25h-4V13h3.846v1.638h.055c.536-1.014 1.846-2.086 3.801-2.086 4.062 0 4.808 2.676 4.808 6.156V25z"/></svg></span> LinkedIn
                    </button>
                    <button
                      className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold px-4 py-2 rounded-xl shadow hover:brightness-90 transition-all cursor-pointer border border-pink-500"
                      onClick={() => handleShareInstagram(modal)}
                    >
                      <span className="inline-block w-5 h-5"><svg viewBox="0 0 32 32" fill="currentColor"><circle cx="16" cy="16" r="7"/><circle cx="24" cy="8" r="2"/><rect x="4" y="4" width="24" height="24" rx="7" fill="none" stroke="currentColor" strokeWidth="2"/></svg></span> Instagram
                    </button>
                  </div>
                  {shareMsg && (
                    <div className="text-xs text-[#a1db87] font-bold mt-1 flex items-center gap-2">
                      <Share2 className="w-4 h-4" /> {shareMsg}
                    </div>
                  )}
                  <div className="flex gap-2 items-center text-xs text-gray-400 flex-wrap">
                    <label>Título PDF:</label>
                    <input type="text" className="bg-[#181818] border border-[#333] rounded px-2 py-1 text-white" value={pdfOptions.titulo} onChange={e => setPdfOptions(o => ({...o, titulo: e.target.value}))} />
                    <label>Color:</label>
                    <input type="color" value={pdfOptions.color} onChange={e => setPdfOptions(o => ({...o, color: e.target.value}))} />
                    <label>Fuente:</label>
                    <select className="bg-[#181818] border border-[#333] rounded px-2 py-1 text-white" value={pdfOptions.font} onChange={e => setPdfOptions(o => ({...o, font: e.target.value}))}>
                      <option value="sans-serif">Sans-serif</option>
                      <option value="serif">Serif</option>
                      <option value="monospace">Monospace</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
