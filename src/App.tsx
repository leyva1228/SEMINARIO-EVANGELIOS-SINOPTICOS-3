import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PaginaAdaptable from './components/pages/PaginaAdaptable'
import datos from './data/data_seminario.json'
import type { PaginaData, ContenidoItem } from './types'
import logoladp from './assets/logoladp.png'
import { labels } from './utils/labels'

const CORDEBO_IMG = '/assets/cordero.png'
const REBANO_IMG = '/assets/rebano_corderos.png'

function splitContenido(contenido: ContenidoItem[], maxItems: number = 6, forceSplitAfter?: number): ContenidoItem[][] {
  if (contenido.length <= maxItems && forceSplitAfter === undefined) return [contenido]

  const sections: ContenidoItem[][] = []
  let currentSection: ContenidoItem[] = []

  for (let i = 0; i < contenido.length; i++) {
    const item = contenido[i]
    const isNewSection = item.tipo === 'enumeracion_por_alfabetizacion' || item.tipo === 'leccion_inicio'

    if ((isNewSection && currentSection.length > 0) || (forceSplitAfter !== undefined && i === forceSplitAfter && currentSection.length > 0)) {
      sections.push(currentSection)
      currentSection = [item]
    } else {
      currentSection.push(item)
    }
  }

  if (currentSection.length > 0) {
    sections.push(currentSection)
  }

  const chunks: ContenidoItem[][] = []
  let currentChunk: ContenidoItem[] = []

  for (const section of sections) {
    if (currentChunk.length + section.length <= maxItems) {
      currentChunk.push(...section)
    } else {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk)
      }
      currentChunk = section
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }

  return chunks.length > 0 ? chunks : [contenido]
}

function reorganizeLec21Lec22(paginas: PaginaData[]): PaginaData[] {
  return paginas
}

function mergePages(pages: PaginaData[]): PaginaData[] {
  const merged: PaginaData[] = []
  let i = 0
  while (i < pages.length) {
    const p = pages[i]
    if (p.tipo === 'introduccion_capitulo' || p.tipo === 'contenido') {
      const m: PaginaData = { ...p, contenido: p.contenido || [] }
      let j = i + 1

      const chunks = splitContenido(m.contenido || [], 50, m.forceSplitAfter)

      if (chunks.length === 1) {
        merged.push(m)
      } else {
        chunks.forEach((chunk, idx) => {
          const isFirst = idx === 0
          merged.push({
            ...m,
            contenido: chunk,
            id: isFirst ? m.id : `${m.id}_split${idx}`,
          })
        })
      }
      i = j
    } else {
      merged.push(p)
      i++
    }
  }
  return merged
}

const rawPaginas: PaginaData[] = mergePages(datos as PaginaData[])
const reorganizedPaginas: PaginaData[] = reorganizeLec21Lec22(rawPaginas)

const paginas: PaginaData[] = reorganizedPaginas

const total = paginas.length

for (const p of paginas) {
  if (p.id === 'cap9_lec27') {
    p.imagen = CORDEBO_IMG
  } else if (p.id === 'lec28' || p.id.startsWith('lec28_split')) {
    p.imagen = REBANO_IMG
  }
}

const portadaData = paginas.find(p => p.tipo === 'portada')
const pastorName = portadaData?.profesor ?? ''

const btnNav = 'z-10 w-[6vmin] h-[6vmin] flex items-center justify-center rounded-full bg-[#254A6C]/60 hover:bg-[#254A6C] text-[#F5C518] text-[3vmin] font-bold transition-all duration-200 border border-[#00B0F0]/30 hover:border-[#00B0F0] cursor-pointer select-none'

function PaginaPortada({ data }: { data: PaginaData }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-[#F5C518] font-serif drop-shadow-[0.5vmin_0.5vmin_0.5vmin_rgba(0,0,0,0.9)]">
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.div
          className="grid grid-cols-[auto_1fr] gap-x-[3vmin] gap-y-[1.5vmin] text-[6.5vmin] font-bold leading-tight text-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="whitespace-nowrap">{data.label_curso}</div>
          <div className="font-normal">{data.curso}</div>
          <div className="whitespace-nowrap">{data.label_profesor}</div>
          <div className="font-normal leading-tight">{data.profesor}</div>
        </motion.div>

        <motion.div
          className="mt-[6vmin] text-[6.5vmin] font-bold leading-tight text-center uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div>
            {data.label_seminario} <span className="font-normal uppercase">{data.seminario}</span>
          </div>
          <div className="mt-[1.5vmin] uppercase">
            {data.label_region} <span className="font-normal uppercase">{data.region}</span>
          </div>
        </motion.div>

        <motion.div
          className="mt-[3vmin] text-[4.5vmin] text-[#00B0F0] font-bold tracking-[0.8vmin]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {labels.label_parte_2}
        </motion.div>

        <motion.div
          className="mt-[5vmin] text-[9vmin] font-bold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {data.anio}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function App() {
  const [currentPageId, setCurrentPageId] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const p = params.get('page')
    return p && paginas.some(page => page.id === p) ? p : '1'
  })
  const [direction, setDirection] = useState(1)
  const [valorSalto, setValorSalto] = useState('')

  const currentIdx = paginas.findIndex(p => p.id === currentPageId)
  const pagina = paginas[currentIdx]
  if (!pagina) return null

  const goNext = useCallback(() => {
    if (currentIdx < total - 1) {
      setDirection(1)
      setCurrentPageId(paginas[currentIdx + 1].id)
    }
  }, [currentIdx])
  const goPrev = useCallback(() => {
    if (currentIdx > 0) {
      setDirection(-1)
      setCurrentPageId(paginas[currentIdx - 1].id)
    }
  }, [currentIdx])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('page', currentPageId)
    window.history.replaceState({}, '', url)
  }, [currentPageId])

  const handleJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const targetId = valorSalto.trim()
      if (targetId && paginas.some(p => p.id === targetId)) {
        const targetIdx = paginas.findIndex(p => p.id === targetId)
        setDirection(targetIdx > currentIdx ? 1 : -1)
        setCurrentPageId(targetId)
        setValorSalto('')
      }
    }
  }

  const isPortada = pagina.tipo === 'portada'

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '30%' : '-30%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-30%' : '30%', opacity: 0 }),
  }

  return (
    <div
      className="relative w-screen h-screen flex flex-col overflow-hidden font-serif"
      style={{ backgroundImage: 'radial-gradient(circle at center, #11293D 0%, #071825 100%)' }}
    >
      <img
        src={logoladp}
        alt={labels.label_logo}
        className="absolute top-[2vmin] left-[2vmin] w-[8vmin] h-[8vmin] object-contain z-20 drop-shadow-[0.2vmin_0.2vmin_0.4vmin_rgba(0,0,0,0.8)]"
      />

      <main className="flex-1 flex items-center justify-center w-full min-h-0 overflow-hidden px-[4vmin] py-[6vmin]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentPageId}
          className="w-full h-full flex items-center justify-center"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {isPortada ? <PaginaPortada data={pagina} /> : <PaginaAdaptable pagina={pagina} />}
        </motion.div>
      </AnimatePresence>
      </main>

      {currentIdx > 0 && (
        <button
          onClick={goPrev}
          className={`${btnNav} fixed left-[2vmin] top-1/2 -translate-y-1/2`}
          aria-label={labels.label_anterior}
        >‹</button>
      )}

      {currentIdx < total - 1 && (
        <button
          onClick={goNext}
          className={`${btnNav} fixed right-[2vmin] top-1/2 -translate-y-1/2`}
          aria-label={labels.label_siguiente}
        >›</button>
      )}

      <footer className="relative shrink-0 z-20 pb-[3vmin] pt-[1vmin]">
        <div className="flex items-center justify-center relative px-[4vmin]">
          <div className="flex flex-col items-center gap-[0.8vmin] max-w-[60vmin]">
            <div className="w-full h-[0.5vmin] bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F5C518] rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-[2.5vmin]">
              <span className="font-serif text-[2.5vmin] text-white/40 drop-shadow-[0.2vmin_0.2vmin_0.2vmin_rgba(0,0,0,0.5)]">
                {pastorName}
              </span>

              <div className="flex items-center bg-white/10 rounded-sm px-[1vmin] font-serif drop-shadow-[0.2vmin_0.2vmin_0.2vmin_rgba(0,0,0,0.5)]">
                <input
                  type="text"
                  value={valorSalto}
                  onChange={e => setValorSalto(e.target.value)}
                  onKeyDown={handleJump}
                  placeholder={currentPageId}
                  className="bg-transparent text-white text-center w-[5vmin] outline-none text-[2.5vmin] font-bold py-[0.2vmin]"
                />
                <span className="text-white/50 text-[2.5vmin] font-medium ml-[0.5vmin]">/ {total}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
