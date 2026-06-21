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
        const items = item.numeracionItems.map((ni) => {
          if (typeof ni !== 'string' && ni.segmentos) {
            const segs = ni.segmentos as SegmentoColor[]
            const firstText = segs[0]?.texto?.trim() ?? ''
            const isBulletOnly = firstText === '►' || firstText === '•'
            const restSegs = isBulletOnly ? segs.slice(1) : segs
            return {
              icon: labels.label_bullet,
              iconColor: BLANCO,
              content: restSegs.map((seg, si) => (
                <span key={si} style={{ color: seg.color, marginLeft: si > 0 ? '0.15em' : undefined }}>
                  {seg.texto.trimStart()}
                </span>
              )),
            }
          }
          return { icon: labels.label_bullet, iconColor: BLANCO, content: typeof ni === 'string' ? ni : ni.texto || '' }
        })
        return <ViñetaList fontSize={fontSize} items={items} />
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

    default:
      return null
  }
}
