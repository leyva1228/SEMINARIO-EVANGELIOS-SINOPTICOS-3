import { labels } from '../../utils/labels'

interface Props {
  cap_num: number
  cap_titulo: string
  cap_ref?: string
}

export default function EncabezadoCapitulo({ cap_num, cap_titulo, cap_ref }: Props) {
  return (
    <div className="w-full max-w-[140vmin] text-center p-[2.5vmin] mb-[2.5vmin]">
      <h1 className="text-[#00B0F0] text-[3.5vmin] font-extrabold uppercase tracking-wide">
        {labels.label_capitulo} {cap_num}
      </h1>
      <h2 className="text-[#F5C518] text-[3vmin] font-bold mt-[0.5vmin]">
        {cap_titulo}{cap_ref ? ` ${cap_ref}` : ''}
      </h2>
    </div>
  );
}
