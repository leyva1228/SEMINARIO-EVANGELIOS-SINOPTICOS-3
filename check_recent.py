import json
d=json.load(open('src/data/data_seminario.json',encoding='utf-8'))
for p in d:
    if p['id'] in ['80','81','82','83','84']:
        types = [c['tipo'] for c in p.get('contenido',[])]
        print(f"Page {p['id']}: {types}")
