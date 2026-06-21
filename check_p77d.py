import json
with open('src/data/data_seminario.json', encoding='utf-8') as f:
    data = json.load(f)
p = [x for x in data if x['id'] == '77'][0]

# Show full contexto
c1 = p['contenido'][1]
print("=== CONTEXTO ===")
print(json.dumps(c1, ensure_ascii=False, indent=2))

# Show full texto
c2 = p['contenido'][2]
print("\n=== TEXTO ===")
print(json.dumps(c2, ensure_ascii=False, indent=2))
