import { motion } from 'framer-motion'
import { labels } from '../../utils/labels'
import type { ColumnaTabla } from '../../types'

interface FilaTabla {
  tipo_fila: 'tema' | 'unidad'
  [key: string]: string | undefined
}

interface Props {
  titulo?: string
  columnas: ColumnaTabla[]
  filas: FilaTabla[]
}

function Fila({ fila, idx, columnas }: { fila: FilaTabla; idx: number; columnas: ColumnaTabla[] }) {
  const esTema = fila.tipo_fila === 'tema'
  const esUnidad = fila.tipo_fila === 'unidad'

  if (esUnidad) {
    return (
      <motion.tr
        className="bg-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: idx * 0.05, duration: 0.3 }}
      >
        <td colSpan={columnas.length} className="p-[1vmin] font-bold text-center text-[3vmin] text-[#F5C518] align-middle border border-[#F5C518]/20">
          {fila.texto || fila.tema || 'Unidad'}
        </td>
      </motion.tr>
    )
  }

  return (
    <motion.tr
      className={`border-b border-[#F5C518]/20 ${esTema ? '' : 'bg-[#00B0F0]/5'}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.3 }}
    >
      {columnas.map((col, colIdx) => (
        <td key={colIdx} className="p-[1vmin] text-[2.5vmin] border-r border-[#F5C518]/20 text-center align-middle last:border-r-0" style={{ color: col.color ?? '#FFFFFF' }}>
          {fila[col.clave] || ''}
        </td>
      ))}
    </motion.tr>
  )
}

export default function TablaGenerica({ titulo, columnas, filas }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-[4vmin]">
      {titulo && (
        <motion.h2
          className="text-[#00B0F0] font-bold text-[4.2vmin] uppercase text-center mb-[4.5vmin] drop-shadow-[0.5vmin_0.5vmin_0.5vmin_rgba(0,0,0,0.9)]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {titulo}
        </motion.h2>
      )}

      <motion.div
        className="w-full max-w-[140vmin] max-h-[80vh] overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {filas.length === 0 && (
          <p className="text-[#F5C518] text-[2.5vmin] italic text-center mb-[3vmin]">
            {labels.label_tabla_vacia_desc}
          </p>
        )}
        <table className="w-full border-collapse border border-[#F5C518]/30 text-[#FFFFFF] text-[3vmin] leading-tight drop-shadow-[0.4vmin_0.4vmin_0.4vmin_rgba(0,0,0,0.9)]">
          <thead>
            <tr className="bg-[#071825]/50">
              {columnas.map((col, idx) => (
                <th key={idx} className="p-[1vmin] font-bold uppercase text-center" style={{ color: col.color ?? '#F5C518' }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 ? (
              <tr>
                <td colSpan={columnas.length} className="text-center text-[#FFFFFF]/50 text-[2.5vmin] py-[4vmin]">
                  {labels.label_tabla_vacia}
                </td>
              </tr>
            ) : (
              filas.map((fila, idx) => <Fila key={idx} fila={fila} idx={idx} columnas={columnas} />)
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
