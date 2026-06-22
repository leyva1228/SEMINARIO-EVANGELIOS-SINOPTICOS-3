# Architecture

## Project Structure

```
├── public/                  # Static assets (served at /)
│   ├── *.png, *.svg
│   ├── assets/              # Public images
│   └── SEMINARIO - ...pdf   # PDF descargable
├── src/
│   ├── App.tsx              # Root component, routing by page ID
│   ├── main.tsx             # Entry point
│   ├── index.css            # Tailwind global styles
│   ├── assets/              # Imported images
│   ├── components/
│   │   └── pages/
│   │       └── PaginaAdaptable.tsx  # All 89 page renderers
│   ├── data/
│   │   └── data_seminario.json      # All slide content
│   ├── types/
│   │   └── index.ts                 # TypeScript types
│   └── utils/
│       ├── labels.ts                # Spanish labels
│       └── TextRenderer.tsx         # Text rendering helper
├── generate-pdf.mjs        # Puppeteer PDF generator
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Data Flow

1. `data_seminario.json` contains all 89 pages with typed content blocks
2. `App.tsx` reads `?page=` query param, loads matching page data
3. `PaginaAdaptable.tsx` renders each page by `tipo` (portada, cita, texto, viñetas, imagen, etc.)
4. Types are validated at runtime with Zod

## Page Types

Each page has a `tipo` field that determines the renderer:
- `portada`, `cita`, `texto`, `viñetas`, `imagen`, `imagen_texto`, `tabla`, `pregunta`, `agradecimiento`

## PDF Generation

`generate-pdf.mjs` uses Puppeteer to capture each page as PDF, then concatenates with pdf-lib. Run via `npm run generate-pdf`.

## Deployment

Hosted on Vercel. Production build at `https://seminario-evangelios-sinopticos-3.vercel.app`.
