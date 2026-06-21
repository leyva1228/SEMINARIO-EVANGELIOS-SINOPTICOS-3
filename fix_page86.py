import json

d = json.load(open('src/data/data_seminario.json', encoding='utf-8'))

for p in d:
    if p['id'] == '86':
        # Add "B. La Gran Comisión..." between the paragraph and CONTEXTO HISTORICO
        # Current structure: [parrafos, contexto]
        # Target: [parrafos, alfabetizacion, contexto]

        subtitulo = {
            "tipo": "enumeracion_por_alfabetizacion",
            "contenido": "B. La Gran Comisi\u00f3n. Mt 28:18-20; Mr 16:15-18; Lc 24:45-49"
        }

        # Insert at index 1 (after the paragraph, before contexto)
        p['contenido'].insert(1, subtitulo)

        print("Fixed page 86")
        print(json.dumps(p, indent=2, ensure_ascii=False))
        break

with open('src/data/data_seminario.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print("\nDone!")
