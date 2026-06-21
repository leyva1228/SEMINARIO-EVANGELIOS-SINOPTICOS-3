import json
d=json.load(open('src/data/data_seminario.json',encoding='utf-8'))

# Find pages without leccion_inicio (continuations)
no_lecc = [p for p in d if p.get('contenido') and not any(c['tipo']=='leccion_inicio' for c in p['contenido'])]
num_ids = sorted([int(p['id']) for p in no_lecc if p['id'].isdigit()])
print(f"Pages without leccion_inicio: {num_ids[:20]}")
print("---")
for p in no_lecc[:5]:
    types = [c['tipo'] for c in p['contenido']]
    first_types = types[:4]
    print(f"  Page {p['id']}: {first_types}...")

# Find the last page in the JSON
print("---")
all_ids = sorted([int(p['id']) for p in d if p['id'].isdigit()])
print(f"All numeric IDs: {all_ids}")
print(f"Last ID: {all_ids[-1]}")
