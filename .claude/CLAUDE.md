# Reglas generales

## Flujo de trabajo con el usuario
- **NUNCA usar playwright/herramientas de browser** - el usuario verifica visualmente
- Solo implementar lo que el usuario indique explícitamente
- El usuario confirma cuándo una página está bien y cuándo avanzar
- Si dice "seguimos en la misma página" → seguir modificando esa misma página
- Si dice "pasemos a la siguiente página" → borrar todo el contenido de esa página y usar solo la data que proporcione
- Páginas que el usuario NO ha mencionado: ignorar contenido existente (se está renovando todo)

## Viñetas (bullet items)
- Siempre usar "► " como carácter de viñeta, NUNCA "•" ni ningún otro
- El carácter está definido en `labels.label_bullet` del código
- Todas las viñetas usan sangría tipo tab `pl-[5vmin]` y separación bulín-texto `mr-[1.5vmin]` (centralizado en `ViñetaList` en `TextRenderer.tsx`)
- `BulletList` es un wrapper de `ViñetaList` para viñetas con `contenido` array
- La viñeta `numeracion` usa sangría condicional vía `item.sangria !== false ? 'pl-[2.5vmin]' : ''`

## alfabetizacion (A./B./C./D./E.)
- NUNCA usar el caso `alfabetizacion` del sistema que agrega letras como icono
- Renderizar como texto plano usando `renderNumeracionItem` sobre los segmentos del JSON
- Las letras "A.", "B." etc. YA vienen en el primer segmento del JSON (`"texto": "A. "`), no agregarlas en código

## fontSize
- Cuando exista `fontSize` a nivel página (`PaginaData.fontSize`), este valor se pasa a todos los `ContenidoBloque` de esa página
- Si se necesita un fontSize distinto para un ítem específico, cambiar el valor a nivel página

## Identificadores de tipo
- No cambiar `tipo` de los items de contenido (ej. no cambiar `numeracion` a `parrafos`)
- En su lugar, modificar propiedades del identificador existente

## IDs de página
- Secuenciales sin sufijos (ej. no "5-1")

## Colores
- Título dorado: #F5C518
- Celeste para alfabetizaciones (A., B., C.) y viñetas: #00B0F0
- Dorado para enumeraciones (1., 2., 3.): #F5C518
- Texto normal: #FFFFFF
- Reglas de colores en items con `segmentos`:
  - Si el primer segmento empieza con número (1., 2., etc.) → prefijo + título (primera oración) en **dorado** (#F5C518)
  - Si el primer segmento empieza con letra (A., B., etc.) → prefijo + título (primera oración) en **celeste** (#00B0F0)
  - El resto de los segmentos en **blanco** (#FFFFFF)
- Para `enumeracion_por_alfabetizacion` con `contenido` + `complemento`:
  - `contenido` (la primera oración con "A."/"B."/etc.) → h3 en **celeste**
  - `complemento` (el resto) → p en **blanco**

## Formato de enumeración
- Default: prefijo con punto `1.`, `2.`, `3.`
- Alternativa con paréntesis: `1)`, `2)`, `3)` (soportado por `parsePrefixNumeroLetra` con regex `\d+[.)]\s*`)

## Scroll por página
- `scroll?: boolean` (default false): si es `true`, contenido alineado al inicio (`justify-start`) con scroll
- `noScroll?: boolean`: si es `true`, oculta el scroll y centra el contenido (`overflow-hidden justify-center`)
- Sin `scroll` ni `noScroll`: contenido centrado verticalmente con scroll si no cabe

## Espaciado por página
- `itemSpacing?: string` (default `1.5vmin`): controla el `space-y` entre items del contenido
- Útil para páginas con mucho texto donde se quiere más separación visual
