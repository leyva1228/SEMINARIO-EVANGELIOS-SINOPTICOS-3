import json
with open('src/data/data_seminario.json', encoding='utf-8') as f:
    data = json.load(f)
p = [x for x in data if x['id'] == '77'][0]
for i, c in enumerate(p['contenido']):
    print(f"  {i}: tipo={c['tipo']}")
    print(f"       full: {json.dumps(c, ensure_ascii=False, indent=2)[:300]}")
