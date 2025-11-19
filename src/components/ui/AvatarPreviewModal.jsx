import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AvatarPreviewModal({ image, open, onClose, onConfirm }) {
  // Estado para posición, rotación y zoom
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [startDrag, setStartDrag] = useState(null);
  const [closing, setClosing] = useState(false);

  // Drag logic
  const handleMouseDown = (e) => {
    setDragging(true);
    setStartDrag({ x: e.clientX, y: e.clientY, ...pos });
  };
  const handleMouseUp = () => setDragging(false);
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startDrag.x;
    const dy = e.clientY - startDrag.y;
    setPos({ x: startDrag.x + dx - startDrag.x, y: startDrag.y + dy - startDrag.y });
  };

  // Controls
  const handleRotate = (angle) => setRotation(r => r + angle);
  const handleZoom = (factor) => setZoom(z => Math.max(0.5, Math.min(z + factor, 2)));

  // Helper to animate close
  const closeWithAnimation = (cb) => {
    setClosing(true);
    setTimeout(() => {
      cb();
      setClosing(false);
    }, 350); // Duration matches AnimatePresence exit
  };

  return (
    <AnimatePresence>
      {open && !closing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="bg-[#232323] rounded-2xl shadow-2xl px-8 py-6 max-w-lg w-full border border-[#a1db87] relative"
          >
            <h2 className="text-xl font-bold text-[#a1db87] mb-4">Ajusta tu imagen de perfil</h2>
            <div className="flex flex-col items-center mb-4">
              <div
                className="rounded-full overflow-hidden border-2 border-[#a1db87] bg-[#181818] flex items-center justify-center w-40 h-40 mb-2 cursor-move"
                style={{ position: 'relative' }}
                onMouseDown={handleMouseDown}
              >
                <img
                  src={image}
                  alt="Previsualización avatar"
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotation}deg) scale(${zoom})`,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    pointerEvents: 'none',
                  }}
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button className="cursor-pointer bg-[#a1db87] text-[#232323] px-3 py-1 rounded" onClick={() => handleRotate(-15)}>
                  Rotar -15°
                </button>
                <button className="cursor-pointer bg-[#a1db87] text-[#232323] px-3 py-1 rounded" onClick={() => handleRotate(15)}>
                  Rotar +15°
                </button>
                <button className="cursor-pointer bg-[#a1db87] text-[#232323] px-3 py-1 rounded" onClick={() => handleZoom(-0.1)}>
                  -
                </button>
                <button className="cursor-pointer bg-[#a1db87] text-[#232323] px-3 py-1 rounded" onClick={() => handleZoom(0.1)}>
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer bg-gray-700 text-gray-200 px-4 py-2 rounded transition-transform"
                onClick={() => closeWithAnimation(onClose)}
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer bg-[#a1db87] text-[#232323] px-4 py-2 rounded font-bold transition-transform"
                onClick={() => closeWithAnimation(() => onConfirm({ image, pos, rotation, zoom }))}
              >
                Confirmar
              </motion.button>
            </div>
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-[#a1db87] text-lg"
              onClick={() => closeWithAnimation(onClose)}
              title="Cerrar"
            >
              ×
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
