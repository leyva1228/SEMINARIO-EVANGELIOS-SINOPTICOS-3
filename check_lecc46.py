import json
d=json.load(open('src/data/data_seminario.json',encoding='utf-8'))
for p in d:
    for c in p.get('contenido',[]):
        if c['tipo']=='leccion_inicio' and c['leccion']['leccion_num']==46:
            print(f"Page {p['id']}: lecc 46 - {c['leccion']['leccion_titulo']}")
