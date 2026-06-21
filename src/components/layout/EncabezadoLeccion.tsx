import { labels } from '../../utils/labels'
import romboImg from '/rombo.png'

interface Props {
  leccion_num: number
  leccion_titulo: string
  leccion_ref?: string
  objetivos?: string[]
  scale?: number
}

function s(v: number, scale: number) {
  return `${v * scale}vmin`
}

export default function EncabezadoLeccion({ leccion_num, leccion_titulo, leccion_ref, objetivos, scale = 1 }: Props) {
  const gap = s(0.8, scale)

  return (
    <div className="w-full max-w-[140vmin] font-serif" style={{ marginTop: s(2, scale), marginBottom: s(1.5, scale) }}>
      <div className="bg-[#00B0F0] w-full" style={{ height: s(0.3, scale) }}></div>

      <div style={{ paddingTop: gap, paddingBottom: gap }}>
        <div className="flex flex-row" style={{ gap: s(2, scale) }}>
          <div className="flex flex-col items-center justify-center self-center flex-none">
            <span className="text-[#F5C518] font-bold uppercase leading-tight text-center" style={{ fontSize: s(2.8, scale) }}>{labels.label_leccion}</span>
            <div className="relative flex items-center justify-center" style={{ width: s(9, scale), height: s(9, scale), marginTop: s(0.2, scale) }}>
              <img
                src={romboImg}
                alt="Rombo"
                className="w-full h-full object-contain drop-shadow-[0.2vmin_0.2vmin_0.3vmin_rgba(0,0,0,0.6)]"
              />
              <span className="absolute inset-0 flex items-center justify-center text-[#FFFFFF] font-extrabold drop-shadow-[0.2vmin_0.2vmin_0.3vmin_rgba(0,0,0,0.8)]" style={{ fontSize: s(3.5, scale) }}>
                {leccion_num}
              </span>
            </div>
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <h2 className="text-[#F5C518] font-bold leading-tight drop-shadow-[0.3vmin_0.3vmin_0.3vmin_rgba(0,0,0,0.8)]" style={{ fontSize: s(4, scale) }}>
              {leccion_titulo}
            </h2>
            {leccion_ref && (
              <p className="text-white/80 italic leading-tight" style={{ fontSize: s(2.6, scale), marginTop: s(0.1, scale) }}>
                ({leccion_ref})
              </p>
            )}
            {objetivos && objetivos.length > 0 && (
              <div style={{ marginTop: s(0.08, scale) }}>
                {objetivos.map((obj, i) => (
                  <p key={i} className="text-[#00B0F0] font-medium leading-tight" style={{ fontSize: s(2.6, scale) }}>
                    {obj}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#00B0F0] w-full" style={{ height: s(0.3, scale) }}></div>
    </div>
  )
}
