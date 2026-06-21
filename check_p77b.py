import json
with open('src/data/data_seminario.json', encoding='utf-8') as f:
    data = json.load(f)
p = [x for x in data if x['id'] == '77'][0]
for i, c in enumerate(p['contenido']):
    print(f"  {i}: tipo={c['tipo']}")
    if c['tipo'] == 'texto':
        for j, t in enumerate(c.get('textos', [])):
            print(f"       texto[{j}]: {t['texto'][:100]}...")
