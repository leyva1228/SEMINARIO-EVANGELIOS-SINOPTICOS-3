import type { NumeracionItem, SegmentoColor } from '../types'
import { labels } from './labels'

const CELESTE = '#00B0F0'
const BLANCO = '#FFFFFF'

function parsePrefixNumeroLetra(text: string) {
  const match = text.match(/^(\d+[.)]\s*)(.*)/) || text.match(/^([a-z]\.\s*)(.*)/);
  if (match) {
    return { prefix: match[1], resto: match[2] };
  }
  return null;
}

export function renderNumeracionItem(item: NumeracionItem, fontSize: number, idx: number) {
  const baseStyle = { fontSize: `${fontSize}vmin` };
  const hasVinetas = !Array.isArray(item) && (item as any).viñetas && (item as any).viñetas.length > 0;
  const hasNumeracionItems = !Array.isArray(item) && (item as any).numeracionItems && (item as any).numeracionItems.length > 0;

  if (typeof item === 'string') {
    const parsed = parsePrefixNumeroLetra(item);
    if (parsed) {
      return (
        <p key={idx} className="text-justify leading-[1.4]" style={{ ...baseStyle, color: BLANCO }}>
          <span className="font-bold" style={{ color: CELESTE }}>{parsed.prefix}</span>
          {parsed.resto}
        </p>
      );
    }
    return (
      <p key={idx} className="text-justify leading-[1.4]" style={{ ...baseStyle, color: BLANCO }}>
        {item}
      </p>
    );
  }

  if (item.segmentos || item.texto) {
    const mainContent = item.segmentos ? (
      item.segmentos.map((seg: SegmentoColor, si: number) => (
        <span key={si} className={si === 0 ? 'font-bold' : undefined} style={{ color: seg.color, marginLeft: si > 0 ? '0.15em' : undefined }}>
          {seg.texto.trimStart()}
        </span>
      ))
    ) : item.texto;

    if (hasVinetas) {
      const vinetasItems = ((item as any).viñetas as any[]).map((v) => {
        let vContent: React.ReactNode = '';
        if (v.segmentos) {
          const segs = v.segmentos as SegmentoColor[];
          const firstText = segs[0]?.texto?.trim() ?? '';
          const isBulletOnly = firstText === '►' || firstText === '•';
          const restSegs = isBulletOnly ? segs.slice(1) : segs;
          vContent = restSegs.map((seg, si) => (
            <span key={si} style={{ color: seg.color }}>
              {seg.texto}
            </span>
          ));
        } else {
          vContent = v.texto || '';
        }
        return {
          icon: labels.label_bullet,
          content: vContent,
        };
      });
      return (
        <div key={idx}>
          <p className="text-justify leading-[1.4]" style={baseStyle}>{mainContent}</p>
          <ViñetaList items={vinetasItems} fontSize={fontSize} className="mt-[0.5vmin]" />
        </div>
      );
    }

    if (hasNumeracionItems) {
      const nestedItems = ((item as any).numeracionItems as any[]).map((ni: any, i: number) => renderNumeracionItem(ni, fontSize, i));
      return (
        <div key={idx}>
          <p className="text-justify leading-[1.4]" style={baseStyle}>{mainContent}</p>
          <div className="space-y-[0.8vmin] mt-[0.5vmin]">
            {nestedItems}
          </div>
        </div>
      );
    }

    return (
      <p key={idx} className="text-justify leading-[1.4]" style={baseStyle}>
        {mainContent}
      </p>
    );
  }

  return null;
}

export default function Texto({ text, fontSize, className = '', customColor }: { text?: string; fontSize?: number; className?: string; customColor?: string }) {
  if (!text) return null;
  const combined = `text-justify font-bold ${className}`;
  if (fontSize !== undefined) {
    const baseStyle = { fontSize: `${fontSize}vmin` };
    const color = customColor || BLANCO;
    if (/^[A-Z]\./.test(text)) {
      return <p className={combined} style={{ ...baseStyle, color: CELESTE }}>{text}</p>;
    }
    if (/^\d+\./.test(text)) {
      return <p className={combined} style={{ ...baseStyle, color: BLANCO }}>{text}</p>;
    }
    return <p className={combined} style={{ ...baseStyle, color }}>{text}</p>;
  }
  return <p className={combined}>{text}</p>;
}

export function ViñetaItem({ icon, children, fontSize, iconColor = BLANCO }: { icon: React.ReactNode; children: React.ReactNode; fontSize: number; iconColor?: string }) {
  return (
    <div className="flex items-start text-justify font-bold" style={{ fontSize: `${fontSize}vmin` }}>
      <span className="mr-[1.5vmin] font-bold shrink-0" style={{ color: iconColor }}>{icon}</span>
      <span className="font-bold" style={{ color: BLANCO }}>{children}</span>
    </div>
  );
}

export function ViñetaList({ items, fontSize, className = '' }: { items: Array<{ icon: React.ReactNode; iconColor?: string; content: React.ReactNode }>; fontSize: number; className?: string }) {
  if (!items?.length) return null;
  return (
    <div className={`space-y-[0.8vmin] pl-[5vmin] ${className}`}>
      {items.map((item, idx) => (
        <ViñetaItem key={idx} icon={item.icon} iconColor={item.iconColor ?? BLANCO} fontSize={fontSize}>
          {item.content}
        </ViñetaItem>
      ))}
    </div>
  );
}

export function BulletList({ items, className = '', fontSize }: { items: string[]; className?: string; fontSize?: number }) {
  if (!items?.length) return null;
  const base = fontSize ?? 3;
  return (
    <ViñetaList
      fontSize={base}
      className={className}
      items={items.map((text) => ({ icon: labels.label_bullet, content: text }))}
    />
  );
}
