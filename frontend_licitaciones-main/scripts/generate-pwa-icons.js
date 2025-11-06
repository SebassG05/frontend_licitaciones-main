import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de rutas
const INPUT_LOGO = join(__dirname, '../public/Corporatives/Images/Logo/Logo.png');
const OUTPUT_DIR = join(__dirname, '../public/pwa-icons');

// Tamaños de iconos requeridos
const ICON_SIZES = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'manifest-icon-192.maskable.png', maskable: true },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'manifest-icon-512.maskable.png', maskable: true },
  { size: 180, name: 'apple-icon-180.png' }
];

/**
 * Crea un icono con canvas transparente del tamaño exacto
 * @param {Buffer} buffer - Buffer de la imagen original
 * @param {number} size - Tamaño final del icono (debe ser exacto)
 * @param {boolean} isMaskable - Si es maskable, reduce el logo al 80% del tamaño
 * @returns {Promise<Buffer>}
 */
async function createIconWithTransparentCanvas(buffer, size, isMaskable = false) {
  // Para iconos maskable, reducir el logo al 80% del tamaño total
  // Para iconos normales, usar el 90% del tamaño para dejar espacio
  const logoSize = isMaskable ? Math.round(size * 0.8) : Math.round(size * 0.9);

  // Redimensionar el logo manteniendo aspecto y transparencia
  const resizedLogo = await sharp(buffer)
    .resize(logoSize, logoSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparencia total
    })
    .toBuffer();

  // Obtener dimensiones reales del logo redimensionado
  const metadata = await sharp(resizedLogo).metadata();
  const logoWidth = metadata.width;
  const logoHeight = metadata.height;

  // Calcular posición para centrar el logo
  const left = Math.round((size - logoWidth) / 2);
  const top = Math.round((size - logoHeight) / 2);

  // Crear canvas TRANSPARENTE del tamaño exacto requerido
  const canvas = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 } // ✅ Fondo transparente
    }
  })
    .composite([{
      input: resizedLogo,
      top: top,
      left: left
    }])
    .png()
    .toBuffer();

  return canvas;
}

/**
 * Genera un icono individual
 * @param {object} config - Configuración del icono
 */
async function generateIcon(config) {
  const { size, name, maskable } = config;
  const outputPath = join(OUTPUT_DIR, name);

  try {
    console.log(`📦 Generando ${name} (${size}x${size})...`);

    // Leer el logo original
    const logoBuffer = await sharp(INPUT_LOGO).toBuffer();

    // Crear icono en canvas transparente del tamaño exacto
    const finalBuffer = await createIconWithTransparentCanvas(logoBuffer, size, maskable);

    // Verificar dimensiones finales
    const metadata = await sharp(finalBuffer).metadata();
    
    if (metadata.width !== size || metadata.height !== size) {
      throw new Error(`Tamaño incorrecto: ${metadata.width}x${metadata.height} (esperado: ${size}x${size})`);
    }

    if (maskable) {
      console.log(`   ↳ PWA Maskable - Logo al 80% en canvas ${size}x${size} transparente`);
    } else {
      console.log(`   ↳ Navegador - Logo al 90% en canvas ${size}x${size} transparente`);
    }

    // Guardar el icono
    await sharp(finalBuffer).toFile(outputPath);

    console.log(`✅ ${name} generado exitosamente (${metadata.width}x${metadata.height})\n`);
  } catch (error) {
    console.error(`❌ Error generando ${name}:`, error.message);
    throw error;
  }
}

/**
 * Función principal
 */
async function generateAllIcons() {
  console.log('🚀 Iniciando generación de iconos PWA...\n');
  console.log('💡 Estrategia de diseño:');
  console.log('   - Logo original SIN MODIFICACIONES');
  console.log('   - Canvas transparente del tamaño exacto');
  console.log('   - Logo centrado: 90% (normal) / 80% (maskable)');
  console.log('   - Fondo #333333 aplicado por vite.config.js\n');

  // Verificar que existe el logo
  if (!existsSync(INPUT_LOGO)) {
    console.error(`❌ Error: No se encontró el logo en ${INPUT_LOGO}`);
    console.error('📝 Por favor, asegúrate de que Logo.png existe en public/Corporatives/Images/Logo/');
    process.exit(1);
  }

  // Crear directorio de salida si no existe
  if (!existsSync(OUTPUT_DIR)) {
    console.log(`📁 Creando directorio ${OUTPUT_DIR}...\n`);
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generar todos los iconos
  try {
    for (const iconConfig of ICON_SIZES) {
      await generateIcon(iconConfig);
    }

    console.log('\n✨ ¡Todos los iconos PWA han sido generados exitosamente!');
    console.log(`📂 Ubicación: ${OUTPUT_DIR}`);
    
    console.log('\n📋 Iconos generados:');
    
    const browserIcons = ICON_SIZES.filter(i => !i.maskable);
    const maskableIcons = ICON_SIZES.filter(i => i.maskable);
    
    console.log('\n   🌐 Iconos para navegadores (90% del tamaño):');
    browserIcons.forEach(icon => {
      console.log(`      - ${icon.name} (${icon.size}x${icon.size})`);
    });
    
    console.log('\n   📱 Iconos PWA Maskable (80% del tamaño):');
    maskableIcons.forEach(icon => {
      console.log(`      - ${icon.name} (${icon.size}x${icon.size})`);
    });

    console.log('\n🎯 Resultado:');
    console.log('   ✓ Canvas del tamaño exacto declarado');
    console.log('   ✓ Logo original centrado con transparencia');
    console.log('   ✓ Fondo corporativo aplicado por PWA manifest');
    console.log('\n⚙️  El fondo #333333 se aplica automáticamente desde vite.config.js');

  } catch (error) {
    console.error('\n❌ Error durante la generación de iconos:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
generateAllIcons();