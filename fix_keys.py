import json
path = 'src/data/data_seminario.json'
d = json.load(open(path, encoding='utf-8'))
fixed = 0
for p in d:
    for c in p.get('contenido', []):
        if isinstance(c, dict):
            if 'contexto_historico_descripcion' in c:
                c['contexto_historico_descripción'] = c.pop('contexto_historico_descripcion')
                fixed += 1
                print(f'Fixed page {p["id"]}')
json.dump(d, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'Done. Fixed {fixed} entries.')
