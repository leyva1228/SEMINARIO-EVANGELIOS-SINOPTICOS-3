export type TipoElemento = 'portada' | 'introduccion_capitulo' | 'contenido';

export type TipoContenidoItem =
  | 'parrafos'
  | 'viñetas'
  | 'numeracion'
  | 'enumeracion_por_alfabetizacion'
  | 'letras'
  | 'contexto'
  | 'tabla'
  | 'leccion_inicio'
  | 'imagen_placeholder'
  | 'imagen'
  | 'alfabetizacion'
  | 'titulo_dorado'
  | 'encabezado_capitulo'
  | 'texto';

export interface FilaTabla {
  tipo_fila: 'tema' | 'unidad';
  [key: string]: string | undefined;
}

export interface ColumnaTabla {
  label: string;
  clave: string;
  color?: string;
}

export interface TablaData {
  titulo?: string;
  columnas: ColumnaTabla[];
  filas: FilaTabla[];
}

export interface LeccionInicioData {
  leccion_num: number;
  leccion_titulo: string;
  leccion_ref: string;
  objetivos: string[];
}

export interface SegmentoColor {
  texto: string;
  color: string;
}

export type NumeracionItem = string | { texto: string; segmentos?: SegmentoColor[] };

export interface ContenidoItem {
  tipo: TipoContenidoItem;
  contenido?: string | string[];
  complemento?: string;
  numeracionItems?: NumeracionItem[];
  contexto_historico?: string;
  contexto_historico_descripción?: string[];
  tabla?: TablaData;
  leccion?: LeccionInicioData;
  imagen?: string;
  texto?: string;
  textos?: { texto: string }[];
  color?: string;
  sangria?: boolean;
  continuacion?: boolean;
  cap_num?: number;
  cap_titulo?: string;
  cap_ref?: string;
}

export interface LessonHeader {
  titulo: string;
  ref: string;
  objetivos: { letra: string; texto: string }[];
}

export interface PaginaData {
  tipo: TipoElemento;
  id: string;
  cap_num?: number;
  cap_titulo?: string;
  cap_ref?: string;
  label_curso?: string;
  curso?: string;
  label_profesor?: string;
  profesor?: string;
  label_seminario?: string;
  seminario?: string;
  label_region?: string;
  region?: string;
  label_parte_2?: string;
  label_anterior?: string;
  label_siguiente?: string;
  label_continuacion?: string;
  anio?: string;
  contenido?: ContenidoItem[];
  imagen?: string;
  imagenScale?: number;
  forceSplitAfter?: number;
  noContinuacion?: boolean;
  reduceFont?: boolean;
  fontSize?: number;
  scroll?: boolean;
  noScroll?: boolean;
  itemSpacing?: string;
  lateralPadding?: number;
}
