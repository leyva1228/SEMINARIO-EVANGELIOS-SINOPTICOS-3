import json
d = json.load(open('src/data/data_seminario.json', encoding='utf-8'))
ids = sorted([int(p['id']) for p in d])
print('Total:', len(d), '| IDs:', ids[0], 'to', ids[-1])
for idx in [83, 84, 85, 86, 87]:
    p = d[idx]
    print('\n=== INDEX ' + str(idx) + ' (id=' + p['id'] + ') ===')
    for c in p.get('contenido', []):
        t = c['tipo']
        if t == 'numeracion':
            for item in c['numeracionItems']:
                segs = item.get('segmentos', [])
                colors = [s['color'] for s in segs] if segs else ['NONE']
                print('  NUM: ' + item['texto'][:70])
                print('       Colors: ' + str(colors))
        elif t == 'vinetas':
            items = c['numeracionItems']
            print('  VINETAS: ' + str(len(items)) + ' items')
            for item in items:
                print('    - ' + item['texto'][:60])
        elif t == 'parrafos':
            for par in c['contenido']:
                print('  PAR: ' + par[:70])
        elif t == 'contexto':
            print('  CTX: ' + c.get('contexto_historico',''))
            for desc in c.get('contexto_historico_descripcion', []):
                print('  DESC: ' + desc[:70])
