import json

with open('src/data/data_seminario.json', encoding='utf-8') as f:
    data = json.load(f)

p = [x for x in data if x['id'] == '77'][0]

# Clear descripcion from contexto (keep title only)
for c in p['contenido']:
    if c['tipo'] == 'contexto':
        c['contexto_historico_descripcion'] = []
    # Convert texto singular to textos array
    if c['tipo'] == 'texto' and 'texto' in c:
        txt = c.pop('texto')
        c['textos'] = [{'texto': txt}]

with open('src/data/data_seminario.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("OK")
