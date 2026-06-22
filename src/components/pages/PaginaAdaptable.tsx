import type { PaginaData, ContenidoItem, SegmentoColor, TipoContenidoItem } from '../../types'
import TablaGenerica from '../tables/TablaGenerica'
import EncabezadoLeccion from '../layout/EncabezadoLeccion'
import EncabezadoCapitulo from '../layout/EncabezadoCapitulo'
import Texto, { BulletList, ViñetaList, renderNumeracionItem } from '../../utils/TextRenderer'
import { labels } from '../../utils/labels'

const CONTENT_FONT_SIZE = 3
const HEADER_FONT_SIZE = 3.2
const BLANCO = '#FFFFFF'

function ContenidoBloque({ item, fontSize }: { item: ContenidoItem; fontSize: number }) {
  const baseStyle = { fontSize: `${fontSize}vmin` }
  switch (item.tipo) {
    case 'parrafos': {
      const lines = Array.isArray(item.contenido) ? item.contenido : [item.contenido]
      return (
        <div className="space-y-[1.2vmin]">
          {lines.map((line, i) => (
            <Texto key={i} text={line} fontSize={fontSize} customColor={item.color} />
          ))}
        </div>
      )
    }
    case 'numeracion': {
      const indentClass = item.sangria !== false ? 'pl-[2.5vmin]' : ''
      const continuationClass = item.continuacion ? '-mt-[1.5vmin]' : ''
      if (item.numeracionItems) {
        return (
          <div className={`space-y-[0.8vmin] ${indentClass} ${continuationClass}`}>
            {item.numeracionItems.map((ni, i) => renderNumeracionItem(ni, fontSize, i))}
          </div>
        )
      }
      const items = Array.isArray(item.contenido) ? item.contenido : []
      return (
        <div className={`space-y-[0.8vmin] ${indentClass} ${continuationClass}`}>
          {items.map((t, i) => renderNumeracionItem(t, fontSize, i))}
        </div>
      )
    }
    case 'alfabetizacion': {
      const items = Array.isArray(item.contenido) ? item.contenido : []
      if (item.numeracionItems) {
        return (
          <div className="space-y-[0.8vmin]">
            {item.numeracionItems.map((ni, i) => renderNumeracionItem(ni, fontSize, i))}
          </div>
        )
      }
      return (
        <div className="space-y-[0.8vmin]">
          {items.map((t, i) => renderNumeracionItem(t, fontSize, i))}
        </div>
      )
    }
    case 'viñetas':
      if (item.numeracionItems) {
        const iconChar = item.icono === 'circulo' ? labels.label_circle : labels.label_bullet
        const items = item.numeracionItems.map((ni) => {
          if (typeof ni !== 'string' && ni.segmentos) {
            const segs = ni.segmentos as SegmentoColor[]
            const firstText = segs[0]?.texto?.trim() ?? ''
            const isBulletOnly = firstText === '►' || firstText === '•'
            const restSegs = isBulletOnly ? segs.slice(1) : segs
            return {
              icon: iconChar,
              iconColor: BLANCO,
              content: restSegs.map((seg, si) => (
                <span key={si} style={{ color: seg.color, marginLeft: si > 0 ? '0.15em' : undefined }}>
                  {seg.texto.trimStart()}
                </span>
              )),
            }
          }
          return { icon: iconChar, iconColor: BLANCO, content: typeof ni === 'string' ? ni : ni.texto || '' }
        })
        return <ViñetaList fontSize={fontSize} items={items} className={item.icono === 'circulo' ? 'pl-[8vmin]' : ''} />
      }
      return <BulletList items={Array.isArray(item.contenido) ? item.contenido : []} fontSize={fontSize} />
    case 'contexto':
      return (
        <div className="mb-[1vmin]">
          {item.contexto_historico && (
            <p className="text-[#00B0F0] font-bold leading-[1.5] text-justify drop-shadow-[0.2vmin_0.2vmin_0.2vmin_rgba(0,0,0,0.8)] mb-[0.5vmin]" style={baseStyle}>
              {item.contexto_historico}
            </p>
          )}
          {item.contexto_historico_descripción?.map((desc, i) => (
            <p key={i} className="text-[#FFFFFF] leading-[1.5] text-justify drop-shadow-[0.2vmin_0.2vmin_0.2vmin_rgba(0,0,0,0.8)]" style={baseStyle}>
              {desc}
            </p>
          ))}
        </div>
      )
    case 'texto': {
      const lines = item.textos ? item.textos.map(t => t.texto) : (item.texto ? [item.texto] : [])
      return (
        <div className="space-y-[1.2vmin]">
          {lines.map((line, i) => (
            <Texto key={i} text={line} fontSize={fontSize} />
          ))}
        </div>
      )
    }
    case 'enumeracion_por_alfabetizacion': {
      const h3style = { fontSize: `${fontSize}vmin`, color: '#00B0F0' }
      if (item.complemento) {
        return (
          <div className="mb-[0.5vmin]">
            <h3 className="font-bold leading-tight drop-shadow-[0.3vmin_0.3vmin_0.3vmin_rgba(0,0,0,0.9)] mt-[0.5vmin] mb-[0.3vmin]" style={h3style}>
              {item.complemento}
            </h3>
            <p className="text-[#FFFFFF] text-justify leading-[1.4] pl-[2.5vmin]" style={baseStyle}>
              {item.complemento}
            </p>
          </div>
        )
      }
      return (
        <h3 className="font-bold leading-tight drop-shadow-[0.3vmin_0.3vmin_0.3vmin_rgba(0,0,0,0.9)] mt-[0.5vmin] mb-[0.3vmin]" style={h3style}>
          {item.contenido}
        </h3>
      )
    }
    case 'letras':
      return (
        <div className="space-y-[0.8vmin] pl-[2.5vmin]">
          {Array.isArray(item.contenido) ? item.contenido.map((t, i) => renderNumeracionItem(t, fontSize, i)) : null}
        </div>
      )
    case 'tabla':
      return item.tabla ? (
        <div className="w-full flex justify-center my-[1vmin]">
          <TablaGenerica
            titulo={item.tabla.titulo}
            columnas={item.tabla.columnas}
            filas={item.tabla.filas}
          />
        </div>
      ) : null
    case 'encabezado_capitulo':
      return (
        <div className="w-full flex justify-center my-[1vmin]">
          <EncabezadoCapitulo
            cap_num={item.cap_num ?? 0}
            cap_titulo={item.cap_titulo ?? ''}
            cap_ref={item.cap_ref}
          />
        </div>
      )
    case 'leccion_inicio':
      return item.leccion ? (
        <div className="w-full flex justify-center my-[1vmin]">
          <EncabezadoLeccion
            leccion_num={item.leccion.leccion_num}
            leccion_titulo={item.leccion.leccion_titulo}
            leccion_ref={item.leccion.leccion_ref}
            objetivos={item.leccion.objetivos}
            scale={HEADER_FONT_SIZE / CONTENT_FONT_SIZE}
          />
        </div>
      ) : null
    case 'titulo_dorado':
      return (
        <h2 className="text-[#F5C518] font-bold leading-tight drop-shadow-[0.3vmin_0.3vmin_0.3vmin_rgba(0,0,0,0.8)]" style={{ fontSize: `${fontSize}vmin` }}>
          {item.contenido as string}
        </h2>
      )
    case 'imagen_placeholder':
      return null
    case 'imagen':
      return item.imagen ? (
        <div className="w-full flex justify-center">
          <img
            src={item.imagen}
            alt="Imagen"
            className="object-contain drop-shadow-[0.3vmin_0.3vmin_0.3vmin_rgba(0,0,0,0.8)] rounded-[1vmin]"
            style={{ maxWidth: `${50 * ((item as any).imagenScale ?? 1)}%`, maxHeight: `${22 * ((item as any).imagenScale ?? 1)}vmin` }}
          />
        </div>
      ) : null
    default:
      return null
  }
}

export default function PaginaAdaptable({ pagina }: { pagina: PaginaData }) {
  if (!pagina) return null

  const lateral = pagina.lateralPadding ?? (pagina.reduceFont ? 2 : 6)
  const maxWClass = pagina.reduceFont ? 'max-w-[160vmin]' : 'max-w-[140vmin]'

  switch (pagina.tipo) {
    case 'introduccion_capitulo':
      return (
        <div className={`flex flex-col w-full ${maxWClass} mx-auto space-y-[${pagina.itemSpacing ?? '1.5vmin'}] py-[2vmin] ${pagina.noScroll ? 'justify-center overflow-hidden' : pagina.scroll ? 'max-h-full overflow-y-auto justify-start' : 'justify-center overflow-y-auto'}`} style={{ paddingLeft: `${lateral}vmin`, paddingRight: `${lateral}vmin` }}>
          {(pagina.cap_num !== undefined || pagina.cap_titulo) && (
            <EncabezadoCapitulo
              cap_num={pagina.cap_num ?? 0}
              cap_titulo={pagina.cap_titulo ?? ''}
              cap_ref={pagina.cap_ref}
            />
          )}
          {pagina.imagen && (
            <div className="w-full flex justify-center mb-[2vmin]">
              <img
                src={pagina.imagen}
                alt="Capítulo"
                className="object-contain drop-shadow-[0.3vmin_0.3vmin_0.3vmin_rgba(0,0,0,0.8)] rounded-[1vmin]"
                style={{ maxWidth: `${50 * (pagina.imagenScale ?? 1)}%`, maxHeight: `${22 * (pagina.imagenScale ?? 1)}vmin` }}
              />
            </div>
          )}
          {pagina.contenido?.map((item, idx) => (
            <ContenidoBloque key={idx} item={item} fontSize={pagina.fontSize ?? CONTENT_FONT_SIZE} />
          ))}
        </div>
      )
    case 'contenido':
      return (
        <div className={`flex flex-col w-full ${maxWClass} mx-auto space-y-[${pagina.itemSpacing ?? '1.5vmin'}] py-[2vmin] ${pagina.noScroll ? 'justify-center overflow-hidden' : pagina.scroll ? 'max-h-full overflow-y-auto justify-start' : 'justify-center overflow-y-auto'}`} style={{ paddingLeft: `${lateral}vmin`, paddingRight: `${lateral}vmin` }}>
          {pagina.imagen && (
            <div className="w-full flex justify-center mb-[2vmin]">
              <img
                src={pagina.imagen}
                alt="Lección"
                className="object-contain drop-shadow-[0.3vmin_0.3vmin_0.3vmin_rgba(0,0,0,0.8)] rounded-[1vmin]"
                style={{ maxWidth: `${50 * (pagina.imagenScale ?? 1)}%`, maxHeight: `${22 * (pagina.imagenScale ?? 1)}vmin` }}
              />
            </div>
          )}
          {pagina.contenido?.map((item, idx) => (
            <ContenidoBloque key={idx} item={item} fontSize={pagina.fontSize ?? CONTENT_FONT_SIZE} />
          ))}
        </div>
      )

    case 'portada':
      return null

    case 'agradecimiento':
      return <PaginaAgradecimiento />

    default:
      return null
  }
}

function PaginaAgradecimiento() {
  const waUrl = 'https://wa.me/51976286325'
  const mailUrl = 'mailto:desiderioleyva13@gmail.com'

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center px-[6vmin]">
      <div className="bg-white/5 backdrop-blur-sm rounded-[2vmin] border border-[#00B0F0]/20 p-[5vmin] max-w-[100vmin] shadow-[0_0_3vmin_rgba(0,176,240,0.1)]">
        <h2 className="text-[#F5C518] text-[5vmin] font-bold mb-[3vmin] drop-shadow-[0.3vmin_0.3vmin_0.3vmin_rgba(0,0,0,0.8)]">
          ¡Gracias por completar este estudio!
        </h2>
        <p className="text-[#FFFFFF] text-[3vmin] leading-[1.6] mb-[3vmin] drop-shadow-[0.2vmin_0.2vmin_0.2vmin_rgba(0,0,0,0.6)]">
          Dios les bendiga. Que el Señor Jesucristo les siga guiando en el estudio de Su Palabra.
        </p>
        <p className="text-[#00B0F0] text-[3vmin] font-bold leading-[1.5] mb-[4vmin] drop-shadow-[0.2vmin_0.2vmin_0.2vmin_rgba(0,0,0,0.6)]">
          Su hermano en Cristo,<br />
          Pastor Desiderio Leyva Mejía
        </p>

        <div className="flex flex-col items-center gap-[1.5vmin]">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-[50vmin] flex items-center justify-center gap-[1.5vmin] py-[1.5vmin] px-[3vmin] rounded-[1vmin] text-[2.8vmin] font-bold transition-all duration-200 border cursor-pointer"
            style={{ backgroundColor: '#25D36620', borderColor: '#25D366', color: '#25D366' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#25D36640' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#25D36620' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[3.5vmin] h-[3.5vmin]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 2C6.48 2 2 6.48 2 12c0 2.14.71 4.14 1.91 5.77L2 22l4.47-1.97C8.08 20.69 10 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.85 0-3.57-.64-4.94-1.72-.19-.15-.43-.22-.67-.19l-3.02 1.33 1.01-3.05c.05-.15.03-.32-.06-.45C3.57 14.56 3 13.32 3 12 3 7.03 7.03 3 12 3s9 4.03 9 9-4.03 9-9 9z" />
            </svg>
            WhatsApp
          </a>

          <a
            href={mailUrl}
            className="w-full max-w-[50vmin] flex items-center justify-center gap-[1.5vmin] py-[1.5vmin] px-[3vmin] rounded-[1vmin] text-[2.8vmin] font-bold transition-all duration-200 border cursor-pointer"
            style={{ backgroundColor: '#EA433520', borderColor: '#EA4335', color: '#EA4335' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EA433540' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#EA433520' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[3.5vmin] h-[3.5vmin]">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            Correo electrónico
          </a>

          <a
            href="/seminario-evangelios-sinopticos.pdf"
            download="SEMINARIO - EVANGELIOS SINÓPTICOS 3 - LADP.pdf"
            className="w-full max-w-[50vmin] flex items-center justify-center gap-[1.5vmin] py-[1.5vmin] px-[3vmin] rounded-[1vmin] text-[2.8vmin] font-bold border no-underline"
            style={{ backgroundColor: '#34A85320', borderColor: '#34A853', color: '#34A853' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[3.5vmin] h-[3.5vmin]">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            Descargar PDF
          </a>
        </div>
      </div>
    </div>
  )
}
