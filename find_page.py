import json
with open('src/data/data_seminario.json', encoding='utf-8') as f:
    pages = json.load(f)
for i, p in enumerate(pages):
    pid = p.get('id', '?')
    t = p.get('tipo', '')
    h = p.get('header', {})
    lec = h.get('leccion', '')
    print(f'[{i+1}] ID={pid} tipo={t} leccion={lec}')
    if pid in ('77','78','79','80'):
        for item in p.get('contenido', []):
            if isinstance(item, dict):
                tp = item.get('tipo','')
                if tp == 'contexto':
                    desc = item.get('contexto_historico_descripcion','')
                    if isinstance(desc, list) and len(desc)>0:
                        print(f'  >>> CONTEXTO: {desc[0][:80]}')
                elif tp == 'texto':
                    print(f'  >>> TEXTO: {item.get("texto","")[:80]}')
                elif tp == 'imagen':
                    print(f'  >>> IMAGEN: scale={item.get("imagenScale","?")}')
                elif tp == 'alfabetizacion':
                    items = item.get('numeracionItems', [])
                    for ni in items:
                        segs = ni.get('segmentos',[])
                        for s in segs:
                            print(f'  >>> ALFAB: {s.get("texto","")[:80]}')
                elif tp == 'enumeracion':
                    items = item.get('numeracionItems', [])
                    for ni in items:
                        segs = ni.get('segmentos',[])
                        for s in segs:
                            print(f'  >>> ENUM: {s.get("texto","")[:80]}')
