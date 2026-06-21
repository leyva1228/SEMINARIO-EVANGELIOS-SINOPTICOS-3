# Implementación: Generación de PDF con Puppeteer

## Resumen

Script Node.js que recorre las 88 páginas del seminario, captura cada una con Puppeteer en un headless browser, genera un PDF paginado sin inconsistencias ni pérdida de contenido.

---

## Arquitectura

```
generate-pdf.mjs          ← Script principal
├── Lanza dev server (vite preview)
├── Navega a cada página (?page=ID)
├── Espera renderizado completo
├── Captura full-height para páginas con scroll
├── Inyecta CSS de impresión temporal
├── Genera PDF con puppeteer
└── Output: seminario-evangelios-sinopticos.pdf
```

---

## Requisitos previos

```bash
npm install --save-dev puppeteer
```

Puppeteer descarga Chromium automáticamente (~300MB). Si ya tienes Chrome:

```bash
npm install --save-dev puppeteer-core
# Y apuntar a tu Chrome local en el script
```

---

## Paso 1: Crear `generate-pdf.mjs`

Crear en la raíz del proyecto:

```js
import puppeteer from 'puppeteer'
import { execSync, spawn } from 'child_process'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// --- Configuración ---
const PDF_OUTPUT = resolve(__dirname, 'seminario-evangelios-sinopticos.pdf')
const DEV_PORT = 4173          // puerto del preview server
const VIEWPORT_WIDTH = 1920
const VIEWPORT_HEIGHT = 1080
const WAIT_PER_PAGE = 1200    // ms para esperar animaciones
const BASE_URL = `http://localhost:${DEV_PORT}`

// IDs de todas las páginas (del JSON, orden secuencial)
const PAGE_IDS = [
  '1','2','3','4','5','6','7','8','9','10',
  '11','12','13','14','15','16','17','18','19','20',
  '21','22','23','24','25','26','27','28','29','30',
  '31','32','33','34','35','36','37','38','39','40',
  '41','42','43','44','45','46','47','48','49','50',
  '51','52','53','54','55','56','57','58','59','60',
  '61','62','63','64','65','66','67','68','69','70',
  '71','72','73','74','75','76','77','78','79','80',
  '81','82','83','84','85','86','87','88'
]

// Páginas con scroll=true (contenido desborda viewport)
const SCROLL_PAGES = new Set([
  '5','10','11','13','15','16','17','18','21','23',
  '24','26','29','30','31','33','38','39','41','42',
  '43','44','45','46','47','48','50','51','52','54','55'
])

// Páginas portada (tipo=portada, solo la '1')
const PORTADA_PAGES = new Set(['1'])

// CSS que se inyecta temporalmente para impresión
const PRINT_CSS = `
  /* Desactivar animaciones para captura estable */
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
  }

  /* Ocultar botones de navegación y footer */
  button[aria-label],
  footer,
  .fixed.left-*, .fixed.right-* {
    display: none !important;
  }

  /* Ocultar logo fijo */
  img[alt="LADP Logo"] {
    display: none !important;
  }

  /* Forzar overflow visible para captura full-height */
  html, body, #root {
    overflow: visible !important;
    height: auto !important;
    min-height: auto !important;
  }
`

// CSS específico para páginas con scroll (expandir contenido)
const SCROLL_CSS = `
  /* Las páginas con scroll necesitan altura completa */
  .max-h-full, .overflow-y-auto {
    max-height: none !important;
    overflow: visible !important;
    height: auto !important;
  }
`

async function main() {
  console.log('=== Generador PDF Seminario Evangelios Sinópticos ===\n')

  // --- Paso 1: Build del proyecto ---
  console.log('[1/4] Construyendo proyecto...')
  execSync('npx vite build', { stdio: 'inherit', cwd: __dirname })

  // --- Paso 2: Iniciar preview server ---
  console.log('[2/4] Iniciando servidor...')
  const server = spawn('npx', ['vite', 'preview', '--port', String(DEV_PORT)], {
    cwd: __dirname,
    stdio: 'pipe',
    shell: true
  })

  // Esperar a que el servidor esté listo
  await new Promise(resolve => setTimeout(resolve, 3000))
  console.log(`   Servidor en ${BASE_URL}`)

  // --- Paso 3: Generar PDF ---
  console.log('[3/4] Generando PDF...')
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      `--window-size=${VIEWPORT_WIDTH},${VIEWPORT_HEIGHT}`,
      '--no-sandbox',
      '--disable-gpu'
    ]
  })

  const page = await browser.newPage()
  await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT })

  // Recolectar cada página como un fragmento HTML para el PDF
  const pdfPages = []

  for (let i = 0; i < PAGE_IDS.length; i++) {
    const pageId = PAGE_IDS[i]
    const url = `${BASE_URL}?page=${pageId}`
    const progress = `[${i + 1}/${PAGE_IDS.length}]`

    console.log(`   ${progress} Capturando página ${pageId}...`)

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })

    // Inyectar CSS de impresión
    await page.addStyleTag({ content: PRINT_CSS })
    if (SCROLL_PAGES.has(pageId)) {
      await page.addStyleTag({ content: SCROLL_CSS })
    }

    // Esperar a que Framer Motion termine las animaciones
    await page.waitForTimeout(WAIT_PER_PAGE)

    // Para páginas portada, tratar como página normal (yellow text on dark bg)
    // Para páginas con scroll, necesitamos full height
    if (SCROLL_PAGES.has(pageId)) {
      // Obtener la altura real del contenido
      const bodyHeight = await page.evaluate(() => {
        const main = document.querySelector('main')
        const content = main?.firstElementChild?.firstElementChild
        return content ? content.scrollHeight : document.body.scrollHeight
      })
      
      // Ajustar viewport a la altura del contenido
      const cappedHeight = Math.min(bodyHeight + 100, 15000) // Cap a 15000px
      await page.setViewport({ width: VIEWPORT_WIDTH, height: cappedHeight })
      await page.waitForTimeout(300) // Re-flow
    }

    // Capturar screenshot como buffer (para debugging si necesario)
    // await page.screenshot({ path: `debug-page-${pageId}.png`, fullPage: SCROLL_PAGES.has(pageId) })

    pdfPages.push({ pageId, url, isScroll: SCROLL_PAGES.has(pageId) })

    // Resetear viewport
    await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT })
  }

  // --- Generar PDF página por página ---
  console.log('\n   Construyendo PDF final...')

  // Estrategia: Usar page.pdf() navegando a cada página
  // Puppeteer genera PDF desde la página actual
  // Necesitamos visitar cada página y usar pdf({ pageRanges })

  // Mejor estrategia: crear PDF concatenando páginas individuales
  await generateCombinedPDF(browser, page)

  // --- Paso 4: Limpieza ---
  console.log('[4/4] Limpiando...')
  await browser.close()
  server.kill('SIGTERM')

  console.log(`\n✓ PDF generado: ${PDF_OUTPUT}`)
  console.log(`  Total páginas: ${PAGE_IDS.length}`)
}

async function generateCombinedPDF(browser, page) {
  // Estrategia: Navegar a cada página y generar un PDF de 1 página
  // Luego combinar todo con la librería pdf-lib

  const { PDFDocument } = await import('pdf-lib')
  const fs = await import('fs')

  const finalPdf = await PDFDocument.create()

  for (let i = 0; i < PAGE_IDS.length; i++) {
    const pageId = PAGE_IDS[i]
    const url = `${BASE_URL}?page=${pageId}`
    const progress = `[${i + 1}/${PAGE_IDS.length}]`

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 })
    await page.addStyleTag({ content: PRINT_CSS })
    if (SCROLL_PAGES.has(pageId)) {
      await page.addStyleTag({ content: SCROLL_CSS })
      // Expandir viewport
      const bodyHeight = await page.evaluate(() => {
        const main = document.querySelector('main')
        const content = main?.firstElementChild?.firstElementChild
        return content ? content.scrollHeight : document.body.scrollHeight
      })
      const cappedHeight = Math.min(bodyHeight + 60, 15000)
      await page.setViewport({ width: VIEWPORT_WIDTH, height: cappedHeight })
      await page.waitForTimeout(300)
    }

    await page.waitForTimeout(WAIT_PER_PAGE)

    // Generar PDF de esta página individual
    const pdfBytes = await page.pdf({
      width: `${VIEWPORT_WIDTH}px`,
      height: SCROLL_PAGES.has(pageId)
        ? `${Math.min(await page.evaluate(() => document.body.scrollHeight) + 60, 15000)}px`
        : `${VIEWPORT_HEIGHT}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    })

    // Incorporar al PDF final
    const pagePdf = await PDFDocument.load(pdfBytes)
    const [importedPage] = await finalPdf.copyPages(pagePdf, [0])
    finalPdf.addPage(importedPage)

    console.log(`   ${progress} Página ${pageId} procesada`)

    // Resetear viewport
    await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT })
  }

  const finalBytes = await finalPdf.save()
  fs.writeFileSync(PDF_OUTPUT, finalBytes)
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
```

---

## Paso 2: Instalar dependencias adicionales

El script usa `pdf-lib` para concatenar páginas individuales (necesario porque
páginas con scroll tienen alturas diferentes).

```bash
npm install --save-dev pdf-lib
```

`package.json` resultante (scripts section):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "generate-pdf": "node generate-pdf.mjs"
  }
}
```

---

## Paso 3: Ejecutar

```bash
npm run generate-pdf
```

Flujo automático:
1. Corre `vite build`
2. Levanta `vite preview` en puerto 4173
3. Abre Puppeteer (Chromium headless)
4. Navega página por página (`?page=1` → `?page=88`)
5. Inyecta CSS para desactivar animaciones y ocultar navegación
6. Captura cada página como una hoja PDF
7. Concatena todo con `pdf-lib`
8. Genera `seminario-evangelios-sinopticos.pdf`

---

## Detalles técnicos críticos

### 3.1 Unidades `vmin` → pixeles fijos

El proyecto usa `vmin` extensivamente (ej: `text-[3vmin]`, `w-[6vmin]`). Con un
viewport de 1920×1080, `1vmin = 10.8px`. Puppeteer fuerza este viewport antes
de cada captura, garantizando consistencia. Todas las páginas tendrán el mismo
aspecto visual.

### 3.2 Páginas con scroll (31 páginas)

Estas páginas tienen más contenido del que cabe en pantalla. El script:

1. Inyecta CSS que elimina `max-height` y `overflow` restrictions
2. Mide la altura real del contenido via `evaluate(() => scrollHeight)`
3. Expande el viewport de Puppeteer para que quepa todo
4. Captura con la altura expandida
5. Genera la página PDF con la altura correcta (no cortada)

> **Nota**: Las páginas PDF resultantes tendrán alturas diferentes. La mayoría
> será 1080px, pero las de scroll serán más altas. Si se desea todas del mismo
> tamaño (ej. A4), ver sección "Alternativa: formato A4" abajo.

### 3.3 Animaciones Framer Motion

Se inyecta CSS que fuerza `animation-duration: 0s` y `transition-duration: 0s`
en todos los elementos. Luego se espera 1200ms para que React haya renderizado
el estado final. Esto asegura que cada captura muestra el contenido completo,
no un frame intermedio de la animación.

### 3.4 Imágenes

Las imágenes cargan desde `/assets/` (relativo al servidor). Con `waitUntil:
'networkidle0'`, Puppeteer espera a que todas las imágenes terminen de cargar
antes de capturar. Las imágenes base64 inline (si las hubiera) también se
capturan correctamente.

### 3.5 Tablas

Las tablas (`TablaGenerica`) usan `motion.tr` con delays escalonados. El CSS
inyectado anula las animaciones, pero el contenido se preserva. La tabla se
renderiza completa sin animaciones escalonadas.

### 3.6 Elementos ocultos

El CSS de impresión oculta:
- Botones de navegación (‹ ›)
- Footer con barra de progreso
- Logo LADP fijo

Solo queda el contenido de la página.

---

## Alternativa: Formato A4 uniforme

Si se necesita que todas las páginas tengan exactamente tamaño A4 (210×297mm)
y el contenido largo se divida automáticamente:

```js
// En generateCombinedPDF, reemplazar page.pdf() con:
const pdfBytes = await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  preferCSSPageSize: false
})
```

**Trade-off**: El contenido de páginas scroll se dividirá en múltiples hojas A4.
Esto puede cortar texto a la mitad. Para evitarlo, se puede inyectar CSS adicional:

```css
/* Evitar cortes dentro de elementos */
p, li, h1, h2, h3, tr {
  break-inside: avoid;
}

/* Permitir saltos entre secciones */
.leccion_inicio,
.encabezado_capitulo {
  break-before: page;
}
```

---

## Botón de descarga en la última página

Para agregar un botón en la última página (ID `88`) que descargue un PDF
pre-generado:

### Opción A: PDF estático pre-generado (recomendado)

1. Correr `npm run generate-pdf` una vez
2. Copiar el PDF a `public/seminario-evangelios-sinopticos.pdf`
3. Agregar un tipo de página `descarga` al JSON:

```json
{
  "id": "89",
  "tipo": "contenido",
  "contenido": [
    {
      "tipo": "titulo_dorado",
      "contenido": "Descargar Seminario en PDF"
    },
    {
      "tipo": "parrafos",
      "contenido": ["Puede descargar todo el contenido del seminario en formato PDF para estudio offline."]
    }
  ]
}
```

4. En `App.tsx`, detectar la última página y mostrar el botón:

```tsx
// En App.tsx, después de la navegación, agregar:
{currentIdx === total - 1 && (
  <div className="fixed bottom-[12vmin] left-1/2 -translate-x-1/2 z-30">
    <a
      href="/seminario-evangelios-sinopticos.pdf"
      download
      className="inline-flex items-center gap-[2vmin] px-[4vmin] py-[2vmin] bg-[#F5C518] text-[#071825] text-[3vmin] font-bold rounded-[1.5vmin] hover:bg-[#e6b817] transition-colors"
    >
      <span>📥</span>
      <span>Descargar PDF</span>
    </a>
  </div>
)}
```

### Opción B: Generación client-side con botón

Si se quiere que el botón genere el PDF en tiempo real (sin pre-generar):

1. En la última página, agregar un botón que llama a un endpoint
2. Necesitaría un backend (ej. Express) que corra Puppeteer y sirva el PDF
3. Más complejo, pero el PDF siempre estará actualizado

> **Recomendación**: Opción A. Pre-generar el PDF es más simple, rápido,
> y no requiere servidor.

---

## Checklist de verificación post-generación

Después de generar el PDF, verificar:

- [ ] Total de páginas = 88 (una por cada página del seminario)
- [ ] Página 1 (portada) muestra correctamente el fondo oscuro con texto dorado
- [ ] Imágenes aparecen (cordero, templo, etc.) — no placeholders rotos
- [ ] Tablas se renderizan completas con bordes y colores
- [ ] Páginas scroll (5, 10, 11, etc.) no están cortadas
- [ ] No hay botones de navegación en el PDF
- [ ] No hay barra de progreso en el PDF
- [ ] Colores segmentados (#00B0F0, #F5C518, #FFFFFF) se mantienen
- [ ] TipografíaGeorgia/Times New Roman se preserva
- [ ] Fondo oscuro radial gradient se imprime con `printBackground: true`

---

## Troubleshooting

| Problema | Solución |
|---|---|
| `Error: Could not find Chrome` | Instalar `puppeteer` (no `puppeteer-core`) o configurar `executablePath` |
| Página en blanco | Aumentar `WAIT_PER_PAGE` a 2000ms |
| Imágenes faltantes | Verificar que `vite preview` sirve las imágenes. Revisar `public/assets/` |
| Texto cortado en scroll | Aumentar el cap de `15000` px o reducir font-size temporalmente |
| PDF demasiado pesado | Agregar `--disable-dev-shm-usage` a los args de Puppeteer |
| Puerto 4173 ocupado | Cambiar `DEV_PORT` a otro puerto libre |

---

## Estimación de tiempo

- Build: ~5s
- Inicio server: ~3s
- Captura de 88 páginas × 1.2s: ~106s
- Generación PDF final: ~5s
- **Total: ~2 minutos**
