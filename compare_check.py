import json, sys

d = json.load(open('src/data/data_seminario.json', encoding='utf-8'))

for pid in ['82', '85', '86', '87', '88', '89']:
    p = next(x for x in d if x['id'] == pid)
    print(f'========== PAGE {pid} ==========')
    for c in p.get('contenido', []):
        tip = c['tipo']
        print(f'--- tipo: {tip} ---')
        if tip == 'parrafos':
            for i, para in enumerate(c['contenido']):
                print(f'  p{i}: {para[:200]}...')
        elif tip == 'numeracion':
            for item in c.get('numeracionItems', []):
                txt = item['texto'][:200]
                print(f'  num: {txt}...')
                if 'segmentos' in item:
                    seg_text = ' | '.join(s['texto'][:50] for s in item['segmentos'])
                    print(f'    segs: {seg_text}')
        elif tip == 'vinetas':
            for item in c.get('numeracionItems', []):
                txt = item['texto'][:200]
                print(f'  vi: {txt}...')
        elif tip == 'contexto':
            print(f'  contexto: {c.get("contexto_historico","")}')
            desc = c.get('contexto_historico_descripcion', c.get('contexto_historico_descripcion', ''))
            if desc:
                print(f'  desc: {str(desc)[:200]}...')
        elif tip == 'leccion_inicio':
            print(f'  leccion: {c.get("contenido","")}')
        elif tip == 'alfabetizacion':
            print(f'  alfa: {c.get("contenido","")}')
        else:
            j = json.dumps(c, ensure_ascii=False)
            print(f'  {j[:200]}...')
    print()
