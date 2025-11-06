import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageBackground = ({ children }) => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-[#333333] overflow-x-hidden">
      {/* Elementos decorativos de fondo - TODOS CON ANIMACIONES DE ENTRADA */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">

        {/* ELEMENTOS GRANDES QUE ENTRAN DESDE ARRIBA */}

        {/* Círculo superior derecho - entra desde arriba */}
        <motion.div
          key="circle-1-top-entry"
          className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#a1db87]/10 rounded-full blur-3xl"
          initial={{ y: -400, opacity: 0, scale: 0.3 }}
          animate={{
            y: 0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            y: { duration: 1.8, ease: "easeOut", delay: 0 },
            opacity: { duration: 1.5, ease: "easeOut", delay: 0 },
            scale: { duration: 1.7, ease: "easeOut", delay: 0 }
          }}
        />

        {/* Círculo medio derecho - entra desde arriba derecha */}
        <motion.div
          key="circle-4-top-right-entry"
          className="absolute top-1/2 -right-20 w-1/4 h-1/4 bg-[#a1db87]/8 rounded-full blur-3xl"
          initial={{ x: 300, y: -300, opacity: 0, scale: 0.4 }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            x: { duration: 2.0, ease: "easeOut", delay: 0.2 },
            y: { duration: 2.0, ease: "easeOut", delay: 0.2 },
            opacity: { duration: 1.5, ease: "easeOut", delay: 0.1 },
            scale: { duration: 1.8, ease: "easeOut", delay: 0.1 }
          }}
        />

        {/* ELEMENTOS GRANDES QUE ENTRAN DESDE ABAJO */}

        {/* Círculo inferior izquierdo - entra desde abajo */}
        <motion.div
          key="circle-2-bottom-entry"
          className="absolute -bottom-20 -left-20 w-1/3 h-1/3 bg-[#a1db87]/10 rounded-full blur-3xl"
          initial={{ y: 400, opacity: 0, scale: 0.3 }}
          animate={{
            y: 0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            y: { duration: 2.0, ease: "easeOut", delay: 0 },
            opacity: { duration: 1.7, ease: "easeOut", delay: 0 },
            scale: { duration: 1.9, ease: "easeOut", delay: 0 }
          }}
        />

        {/* ELEMENTOS DEL CENTRO QUE ENTRAN DESDE DIFERENTES DIRECCIONES */}

        {/* Forma cuadrada rotada - entra desde el centro expandiéndose */}
        <motion.div
          key="square-1-center-entry"
          className="absolute top-1/3 left-1/2 w-16 h-16 border-2 border-[#a1db87]/20 rotate-45"
          initial={{ scale: 0, opacity: 0, rotate: -315 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: 45
          }}
          transition={{
            scale: { duration: 1.2, ease: "easeOut", delay: 0.1 },
            opacity: { duration: 0.8, ease: "easeOut", delay: 0.1 },
            rotate: { duration: 1.4, ease: "easeOut", delay: 0.1 }
          }}
        />

        {/* Cuadrado rotado adicional - entra desde la izquierda rotando */}
        <motion.div
          key="square-2-left-rotate-entry"
          className="absolute bottom-1/3 left-1/4 w-12 h-12 border border-[#a1db87]/15 rotate-12"
          initial={{ x: -200, opacity: 0, rotate: -348 }}
          animate={{
            x: 0,
            opacity: 1,
            rotate: 12
          }}
          transition={{
            x: { duration: 1.5, ease: "easeOut", delay: 0.3 },
            opacity: { duration: 1.2, ease: "easeOut", delay: 0.2 },
            rotate: { duration: 1.7, ease: "easeOut", delay: 0.2 }
          }}
        />

        {/* Rombo decorativo - entra desde la derecha girando */}
        <motion.div
          key="diamond-1-right-spin-entry"
          className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-[#a1db87]/20 rotate-45"
          initial={{ x: 150, opacity: 0, rotate: -315, scale: 0.2 }}
          animate={{
            x: 0,
            opacity: 1,
            rotate: 45,
            scale: 1
          }}
          transition={{
            x: { duration: 1.6, ease: "easeOut", delay: 0.15 },
            opacity: { duration: 1.3, ease: "easeOut", delay: 0.15 },
            rotate: { duration: 1.8, ease: "easeOut", delay: 0.15 },
            scale: { duration: 1.4, ease: "easeOut", delay: 0.15 }
          }}
        />

        {/* Rombo adicional - entra desde arriba derecha */}
        <motion.div
          key="diamond-2-top-right-entry"
          className="absolute top-2/3 right-1/3 w-8 h-8 bg-[#a1db87]/15 rotate-45"
          initial={{ x: 120, y: -120, opacity: 0, scale: 0.3 }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            x: { duration: 1.4, ease: "easeOut", delay: 0.4 },
            y: { duration: 1.4, ease: "easeOut", delay: 0.4 },
            opacity: { duration: 1.2, ease: "easeOut", delay: 0.3 },
            scale: { duration: 1.3, ease: "easeOut", delay: 0.3 }
          }}
        />

        {/* CÍRCULOS PEQUEÑOS Y MEDIANOS */}

        {/* Círculo pequeño animado - entra desde el centro expandiéndose */}
        <motion.div
          key="circle-3-center-expand-entry"
          className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full border border-[#a1db87]/30"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          transition={{
            scale: { duration: 0.9, ease: "easeOut", delay: 0.05 },
            opacity: { duration: 0.7, ease: "easeOut", delay: 0.05 }
          }}
        />

        {/* Círculo mediano adicional - entra desde abajo izquierda */}
        <motion.div
          key="circle-5-bottom-left-entry"
          className="absolute top-2/3 left-1/3 w-12 h-12 rounded-full border-2 border-[#a1db87]/20"
          initial={{ x: -100, y: 100, opacity: 0, scale: 0.4 }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            x: { duration: 1.5, ease: "easeOut", delay: 0.5 },
            y: { duration: 1.5, ease: "easeOut", delay: 0.5 },
            opacity: { duration: 1.2, ease: "easeOut", delay: 0.45 },
            scale: { duration: 1.3, ease: "easeOut", delay: 0.45 }
          }}
        />

        {/* LÍNEAS DECORATIVAS */}

        {/* Línea diagonal - entra rotando desde el centro */}
        <motion.div
          key="line-1-center-rotate-entry"
          className="absolute top-[30%] right-[20%] w-32 h-[1px] bg-[#a1db87]/25 rotate-45"
          initial={{ scaleX: 0, opacity: 0, rotate: -315 }}
          animate={{
            scaleX: 1,
            opacity: 1,
            rotate: 45
          }}
          transition={{
            scaleX: { duration: 1.0, ease: "easeOut", delay: 0.6 },
            opacity: { duration: 0.9, ease: "easeOut", delay: 0.6 },
            rotate: { duration: 1.1, ease: "easeOut", delay: 0.6 }
          }}
        />

        {/* Línea horizontal - entra desde la izquierda */}
        <motion.div
          key="line-2-left-slide-entry"
          className="absolute bottom-[25%] left-[15%] w-24 h-[1px] bg-[#a1db87]/25"
          initial={{ scaleX: 0, opacity: 0, transformOrigin: "left" }}
          animate={{
            scaleX: 1,
            opacity: 1
          }}
          transition={{
            scaleX: { duration: 1.3, ease: "easeOut", delay: 0.8 },
            opacity: { duration: 1.0, ease: "easeOut", delay: 0.7 }
          }}
        />

        {/* TRIÁNGULO CENTRAL */}

        {/* Triángulo - entra desde arriba rotando */}
        <motion.div
          key="triangle-top-rotate-entry"
          className="absolute top-[60%] left-[60%]"
          initial={{ y: -150, opacity: 0, rotate: 180, scale: 0.3 }}
          animate={{
            y: 0,
            opacity: 1,
            rotate: 0,
            scale: 1
          }}
          transition={{
            y: { duration: 1.6, ease: "easeOut", delay: 0.25 },
            opacity: { duration: 1.4, ease: "easeOut", delay: 0.25 },
            rotate: { duration: 1.8, ease: "easeOut", delay: 0.25 },
            scale: { duration: 1.5, ease: "easeOut", delay: 0.25 }
          }}
        >
          <svg width="40" height="35" viewBox="0 0 40 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 0L39.0526 35H0.947441L20 0Z"
              fill="rgba(161, 219, 135, 0.12)"
            />
          </svg>
        </motion.div>

        {/* PUNTOS DECORATIVOS - ENTRAN EN SECUENCIA */}

        {/* Conjunto de pequeños puntos - entran en cascada desde diferentes direcciones */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`dot-${i}-cascade-entry`}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#a1db87]/30"
            style={{
              left: `${15 + i * 12}%`,
              top: `${45 + (i % 3) * 10}%`,
            }}
            initial={{
              scale: 0,
              opacity: 0,
              x: i % 2 === 0 ? -50 : 50,
              y: i % 3 === 0 ? -30 : i % 3 === 1 ? 0 : 30
            }}
            animate={{
              scale: 1,
              opacity: 1,
              x: 0,
              y: 0
            }}
            transition={{
              scale: { duration: 0.8, ease: "easeOut", delay: 0.5 + i * 0.06 },
              opacity: { duration: 0.6, ease: "easeOut", delay: 0.5 + i * 0.06 },
              x: { duration: 1.0, ease: "easeOut", delay: 0.5 + i * 0.06 },
              y: { duration: 1.0, ease: "easeOut", delay: 0.5 + i * 0.06 }
            }}
          />
        ))}

        {/* FORMAS SVG COMPLEJAS */}

        {/* Forma hexagonal - entra desde abajo derecha rotando */}
        <motion.div
          key="hexagon-bottom-right-rotate-entry"
          className="absolute bottom-[15%] right-[10%]"
          initial={{ x: 120, y: 120, opacity: 0, rotate: -120, scale: 0.4 }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
            scale: 1
          }}
          transition={{
            x: { duration: 1.8, ease: "easeOut", delay: 0.65 },
            y: { duration: 1.8, ease: "easeOut", delay: 0.65 },
            opacity: { duration: 1.6, ease: "easeOut", delay: 0.65 },
            rotate: { duration: 2.0, ease: "easeOut", delay: 0.65 },
            scale: { duration: 1.7, ease: "easeOut", delay: 0.65 }
          }}
        >
          <svg
            className="w-16 h-16 opacity-20"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z"
              fill="none"
              stroke="rgba(161, 219, 135, 0.4)"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>

        {/* Anillo circular - entra desde arriba izquierda girando */}
        <motion.div
          key="ring-top-left-spin-entry"
          className="absolute top-[10%] left-[15%]"
          initial={{ x: -100, y: -100, opacity: 0, rotate: -180, scale: 0.3 }}
          animate={{
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
            scale: 1
          }}
          transition={{
            x: { duration: 1.7, ease: "easeOut", delay: 0.9 },
            y: { duration: 1.7, ease: "easeOut", delay: 0.9 },
            opacity: { duration: 1.5, ease: "easeOut", delay: 0.8 },
            rotate: { duration: 2.0, ease: "easeOut", delay: 0.8 },
            scale: { duration: 1.6, ease: "easeOut", delay: 0.8 }
          }}
        >
          <svg
            className="w-24 h-24 opacity-25"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(161, 219, 135, 0.3)"
              strokeWidth="1"
            />
          </svg>
        </motion.div>

        {/* ELEMENTOS ADICIONALES QUE YA TENÍAS - AHORA CON ANIMACIONES DE ENTRADA */}

        {/* Círculo que entra desde la izquierda */}
        <motion.div
          key="circle-left-entry"
          className="absolute top-[15%] left-[5%] w-14 h-14 rounded-full border-2 border-[#a1db87]/25"
          initial={{ x: -200, opacity: 0, scale: 0.5 }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            x: { duration: 1.2, ease: "easeOut", delay: 0 },
            opacity: { duration: 1.0, ease: "easeOut", delay: 0 },
            scale: { duration: 1.1, ease: "easeOut", delay: 0 }
          }}
        />

        {/* Cuadrado que entra desde la izquierda */}
        <motion.div
          key="square-left-entry"
          className="absolute top-[75%] left-[8%] w-10 h-10 bg-[#a1db87]/15 rotate-45"
          initial={{ x: -150, opacity: 0, rotate: -45 }}
          animate={{
            x: 0,
            opacity: 1,
            rotate: 45
          }}
          transition={{
            x: { duration: 1.3, ease: "easeOut", delay: 0.05 },
            opacity: { duration: 1.1, ease: "easeOut", delay: 0.05 },
            rotate: { duration: 1.2, ease: "easeOut", delay: 0.05 }
          }}
        />

        {/* Triángulo desde la izquierda */}
        <motion.div
          key="triangle-left-entry"
          className="absolute top-[45%] left-[3%]"
          initial={{ x: -180, opacity: 0, scale: 0.3 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{
            x: { duration: 1.6, ease: "easeOut", delay: 0.1 },
            opacity: { duration: 1.4, ease: "easeOut", delay: 0.1 },
            scale: { duration: 1.4, ease: "easeOut", delay: 0.1 }
          }}
        >
          <svg
            width="28"
            height="24"
            viewBox="0 0 28 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 0L27.0566 24H0.943417L14 0Z"
              fill="rgba(161, 219, 135, 0.18)"
            />
          </svg>
        </motion.div>

        {/* Rombo grande desde la derecha */}
        <motion.div
          key="diamond-right-entry"
          className="absolute top-[20%] right-[6%] w-16 h-16 border border-[#a1db87]/20 rotate-45"
          initial={{ x: 200, opacity: 0, scale: 0.4 }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            x: { duration: 1.3, ease: "easeOut", delay: 0 },
            opacity: { duration: 1.0, ease: "easeOut", delay: 0 },
            scale: { duration: 1.2, ease: "easeOut", delay: 0 }
          }}
        />

        {/* Círculo mediano desde la derecha */}
        <motion.div
          key="circle-right-entry"
          className="absolute top-[65%] right-[4%] w-12 h-12 rounded-full bg-[#a1db87]/12"
          initial={{ x: 170, opacity: 0, scale: 0.6 }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            x: { duration: 1.5, ease: "easeOut", delay: 0.15 },
            opacity: { duration: 1.2, ease: "easeOut", delay: 0.1 },
            scale: { duration: 1.4, ease: "easeOut", delay: 0.1 }
          }}
        />

        {/* Hexágono desde la derecha */}
        <motion.div
          key="hexagon-right-entry"
          className="absolute top-[40%] right-[2%]"
          initial={{ x: 160, opacity: 0, rotate: -60 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{
            x: { duration: 1.7, ease: "easeOut", delay: 0.2 },
            opacity: { duration: 1.5, ease: "easeOut", delay: 0.2 },
            rotate: { duration: 1.6, ease: "easeOut", delay: 0.2 }
          }}
        >
          <svg
            className="w-20 h-20 opacity-25"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 5 L88.3 27.5 V72.5 L50 95 L11.7 72.5 V27.5 Z"
              fill="none"
              stroke="rgba(161, 219, 135, 0.35)"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>

        {/* Línea vertical que sube desde abajo */}
        <motion.div
          key="line-bottom-entry"
          className="absolute bottom-[10%] left-[35%] w-[1px] h-20 bg-[#a1db87]/30"
          initial={{ y: 200, opacity: 0, scaleY: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            scaleY: 1
          }}
          transition={{
            y: { duration: 1.4, ease: "easeOut", delay: 0.3 },
            opacity: { duration: 1.1, ease: "easeOut", delay: 0.3 },
            scaleY: { duration: 1.3, ease: "easeOut", delay: 0.3 }
          }}
        />

        {/* Círculo pequeño que sube desde abajo */}
        <motion.div
          key="small-circle-bottom-entry"
          className="absolute bottom-[20%] left-[70%] w-6 h-6 rounded-full border-2 border-[#a1db87]/40"
          initial={{ y: 150, opacity: 0, scale: 0.2 }}
          animate={{
            y: 0,
            opacity: 1,
            scale: 1
          }}
          transition={{
            y: { duration: 1.5, ease: "easeOut", delay: 0.4 },
            opacity: { duration: 1.2, ease: "easeOut", delay: 0.35 },
            scale: { duration: 1.3, ease: "easeOut", delay: 0.35 }
          }}
        />

        {/* Cuadrado rotado que sube desde abajo */}
        <motion.div
          key="rotated-square-bottom-entry"
          className="absolute bottom-[15%] left-[85%] w-8 h-8 bg-[#a1db87]/20 rotate-45"
          initial={{ y: 180, opacity: 0, rotate: -135 }}
          animate={{
            y: 0,
            opacity: 1,
            rotate: 45
          }}
          transition={{
            y: { duration: 1.6, ease: "easeOut", delay: 0.55 },
            opacity: { duration: 1.3, ease: "easeOut", delay: 0.5 },
            rotate: { duration: 1.5, ease: "easeOut", delay: 0.5 }
          }}
        />

        {/* Puntos decorativos que suben desde abajo */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`bottom-dot-${i}-entry`}
            className="absolute w-2 h-2 rounded-full bg-[#a1db87]/35"
            style={{
              bottom: "8%",
              left: `${45 + i * 8}%`,
            }}
            initial={{ y: 120, opacity: 0, scale: 0.3 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1
            }}
            transition={{
              y: { duration: 1.0 + i * 0.15, ease: "easeOut", delay: 0.4 + i * 0.08 },
              opacity: { duration: 0.8 + i * 0.1, ease: "easeOut", delay: 0.4 + i * 0.08 },
              scale: { duration: 0.9 + i * 0.1, ease: "easeOut", delay: 0.4 + i * 0.08 }
            }}
          />
        ))}

        {/* Anillo que sube desde abajo */}
        <motion.div
          key="ring-bottom-entry"
          className="absolute bottom-[25%] left-[55%]"
          initial={{ y: 200, opacity: 0, scale: 0.4 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            y: { duration: 1.8, ease: "easeOut", delay: 0.7 },
            opacity: { duration: 1.5, ease: "easeOut", delay: 0.7 },
            scale: { duration: 1.7, ease: "easeOut", delay: 0.7 }
          }}
        >
          <svg
            className="w-16 h-16 opacity-30"
            viewBox="0 0 60 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="30"
              cy="30"
              r="25"
              fill="none"
              stroke="rgba(161, 219, 135, 0.4)"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>
      </div>

      {/* Contenido de la página */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PageBackground;