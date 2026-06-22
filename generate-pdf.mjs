import puppeteer from 'puppeteer-core'
import { execSync, spawn } from 'child_process'
import { writeFileSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const PDF_OUTPUT = resolve(__dirname, 'seminario-evangelios-sinopticos.pdf')
const DEV_PORT = 4173
const VIEWPORT_WIDTH = 1920
const VIEWPORT_HEIGHT = 1080
const WAIT_PER_PAGE = 1200
const BASE_URL = `http://localhost:${DEV_PORT}`

const PAGE_IDS = [
  '1','2','3','4','5','6','7','8','9','10',
  '11','12','13','14','15','16','17','18','19','20',
  '21','22','23','24','25','26','27','28','29','30',
  '31','32','33','34','35','36','37','38','39','40',
  '41','42','43','44','45','46','47','48','49','50',
  '51','52','53','54','55','56','57','58','59','60',
  '61','62','63','64','65','66','67','68','69','70',
  '71','72','73','74','75','76','77','78','79','80',
  '81','82','83','84','85','86','87','88','agradecimiento'
]

const SCROLL_PAGES = new Set([
  '5','10','11','13','15','16','17','18','21','23',
  '24','26','29','30','31','33','38','39','41','42',
  '43','44','45','46','47','48','50','51','52','54','55'
])

const PRINT_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
  }
  .fixed, footer, nav {
    display: none !important;
  }
  html, body, #root {
    overflow: visible !important;
    height: auto !important;
    min-height: auto !important;
  }
`

const SCROLL_RESET_CSS = `
  .max-h-full, .overflow-y-auto, [class*="overflow-y-"] {
    max-height: none !important;
    overflow: visible !important;
    height: auto !important;
  }
`

async function main() {
  console.log('=== Generador PDF Seminario Evangelios Sinópticos ===\n')

  console.log('[1/4] Construyendo proyecto...')
  execSync('npx vite build', { stdio: 'inherit', cwd: __dirname })

  console.log('[2/4] Iniciando servidor...')
  const server = spawn('npx', ['vite', 'preview', '--port', String(DEV_PORT)], {
    cwd: __dirname,
    stdio: 'pipe',
    shell: true
  })

  await new Promise(r => setTimeout(r, 3000))
  console.log(`   Servidor en ${BASE_URL}`)

  console.log('[3/4] Generando PDF...')
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage'
    ]
  })

  const page = await browser.newPage()
  await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT })

  const { PDFDocument } = await import('pdf-lib')
  const finalPdf = await PDFDocument.create()

  for (let i = 0; i < PAGE_IDS.length; i++) {
    const pageId = PAGE_IDS[i]
    const url = `${BASE_URL}?page=${pageId}`
    const progress = `[${i + 1}/${PAGE_IDS.length}]`
    const isScroll = SCROLL_PAGES.has(pageId)

    console.log(`   ${progress} Página ${pageId}...`)

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 })
    await page.addStyleTag({ content: PRINT_CSS })
    if (isScroll) {
      await page.addStyleTag({ content: SCROLL_RESET_CSS })

      const scrollH = Math.round(await page.evaluate(() => document.body.scrollHeight))
      const capped = Math.min(scrollH + 60, 15000)
      await page.setViewport({ width: VIEWPORT_WIDTH, height: capped })
      await new Promise(r => setTimeout(r, 300))
    }

    await new Promise(r => setTimeout(r, WAIT_PER_PAGE))

    const pdfHeight = isScroll
      ? Math.round(Math.min(await page.evaluate(() => document.body.scrollHeight), 15000) + 60)
      : VIEWPORT_HEIGHT

    const pdfBytes = await page.pdf({
      width: `${VIEWPORT_WIDTH}px`,
      height: `${pdfHeight}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    })

    const singlePdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
    const [importedPage] = await finalPdf.copyPages(singlePdf, [0])
    finalPdf.addPage(importedPage)

    await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT })
  }

  finalPdf.setTitle('SEMINARIO - EVANGELIOS SINÓPTICOS 3 - LADP')
  finalPdf.setSubject('Seminario Evangelios Sinópticos')
  finalPdf.setAuthor('LADP - Desiderio Leyva')
  const finalBytes = await finalPdf.save()
  writeFileSync(PDF_OUTPUT, finalBytes)

  console.log('[4/4] Limpiando...')
  await browser.close()
  server.kill('SIGTERM')

  console.log(`\n✓ PDF generado: ${PDF_OUTPUT}`)
  console.log(`  Total páginas: ${PAGE_IDS.length}`)
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
