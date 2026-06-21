import json
with open('src/data/data_seminario.json', encoding='utf-8') as f:
    data = json.load(f)

# Check how texto type is used elsewhere
count_singular = 0
count_array = 0
for p in data:
    for c in p.get('contenido', []):
        if c['tipo'] == 'texto':
            if 'textos' in c:
                count_array += 1
            elif 'texto' in c:
                count_singular += 1

print(f"texto with 'textos' (array): {count_array}")
print(f"texto with 'texto' (singular): {count_singular}")

# Show one example of each
for p in data:
    for c in p.get('contenido', []):
        if c['tipo'] == 'texto' and 'textos' in c:
            print(f"\nExample with textos array:")
            print(json.dumps(c, ensure_ascii=False, indent=2)[:300])
            break
    else:
        continue
    break

for p in data:
    for c in p.get('contenido', []):
        if c['tipo'] == 'texto' and 'texto' in c and 'textos' not in c:
            print(f"\nExample with texto singular:")
            print(json.dumps(c, ensure_ascii=False, indent=2)[:300])
            break
    else:
        continue
    break
