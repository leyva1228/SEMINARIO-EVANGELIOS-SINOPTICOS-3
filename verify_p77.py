import json
with open('src/data/data_seminario.json', encoding='utf-8') as f:
    data = json.load(f)
p = [x for x in data if x['id'] == '77'][0]
for i, c in enumerate(p['contenido']):
    tipo = c['tipo']
    if tipo == 'contexto':
        desc = c.get('contexto_historico_descripcion', [])
        print(f'[{i}] contexto: descripcion={desc}')
    elif tipo == 'texto':
        textos = c.get('textos', [])
        for t in textos:
            txt = t['texto']
            print(f'[{i}] texto: "{txt[:80]}..."')
    else:
        print(f'[{i}] {tipo}')
