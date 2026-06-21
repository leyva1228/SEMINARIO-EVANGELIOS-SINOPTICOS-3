import json
d = json.load(open('src/data/data_seminario.json', encoding='utf-8'))

p82 = next(x for x in d if x['id'] == '82')
for c in p82.get('contenido', []):
    tip = c['tipo']
    print(f'TIPO: {tip}')
    if tip == 'leccion_inicio':
        print(repr(c))
    elif tip == 'alfabetizacion':
        print('  contenido:', c.get('contenido', ''))
    elif tip == 'contexto':
        print('  contexto:', c.get('contexto_historico', ''))
        print('  desc:', c.get('contexto_historico_descripcion', '(no desc key)'))
        # Try accented key
        d2 = c.get('contexto_historico_descripcion', None)
        print('  desc(with accent):', c.get('contexto_historico_descripcion', 'MISSING'))
    else:
        for k, v in c.items():
            if k != 'tipo':
                print(f'  {k}: {json.dumps(v, ensure_ascii=False)[:300]}')
    print()
