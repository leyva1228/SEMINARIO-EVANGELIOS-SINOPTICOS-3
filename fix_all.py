import json

d = json.load(open('src/data/data_seminario.json', encoding='utf-8'))

# 1. Renumber: close the gap at id=43
# After this: all ids become sequential 1..88
for p in d:
    old_id = int(p['id'])
    if old_id >= 44:
        p['id'] = str(old_id - 1)

new_ids = [int(p['id']) for p in d]
print(f"Total: {len(d)}, IDs: {min(new_ids)}..{max(new_ids)}")
assert len(set(new_ids)) == len(new_ids), "Duplicate IDs after renumber!"
assert min(new_ids) == 1 and max(new_ids) == len(d), f"IDs not sequential!"

# 2. After renumbering, find the page at counter position "86" (index 85)
# and the page at counter position "85" (index 84) which has "2. Jesus..."
# Actually find them by their content

idx_85 = None  # page with "2. Jesús resucitado..."
idx_86 = None  # page with "Saulo" vinetas
idx_87 = None  # page with "CONTEXTO HISTORICO" on the resurrection section
idx_84 = None  # page with "1. La Resurrección" 

for i, p in enumerate(d):
    for c in p.get('contenido', []):
        t = c.get('tipo', '')
        if t == 'numeracion':
            for item in c.get('numeracionItems', []):
                txt = item.get('texto', '')
                if '2. Jesús resucitado' in txt:
                    idx_85 = i
                elif '3. La gente cambia' in txt:
                    if idx_85 is None: idx_85 = i
                elif '1. La Resurrección de Jesús separa' in txt:
                    idx_84 = i
                elif '2. Las consecuencias' in txt:
                    idx_87 = i
        elif t == 'contexto':
            ctx = c.get('contexto_historico', '')
            if ctx == 'CONTEXTO HISTORICO' and idx_86 is None:
                # Find the one about "palabras finales de Jesús" not the one on page 82
                for desc in c.get('contexto_historico_descripcion', []):
                    if 'Estudiaremos' in desc:
                        idx_86 = i

print(f"Index 84 (page with 1. La Resurrección): {idx_84}")
print(f"Index 85 (page with 2. Jesús resucitado): {idx_85}")
print(f"Index 86 (page with CONTEXTO HISTORICO + Estudiaremos): {idx_86}")
print(f"Index 87 (page with 2. Las consecuencias): {idx_87}")

# 3. Fix page at idx_85:
#   a) Make "2. Jesús resucitado..." have gold title
#   b) Add all 4 viñetas to this page (move from idx_86)

# Fix the gold coloring on "2. Jesús resucitado..."
page85 = d[idx_85]
for c in page85['contenido']:
    if c['tipo'] == 'numeracion':
        for item in c['numeracionItems']:
            txt = item.get('texto', '')
            if txt.startswith('2. Jesús resucitado'):
                # Fix segmentos: make the title part gold
                item['segmentos'] = [
                    {"texto": "2. ", "color": "#F5C518"},
                    {"texto": "Jesús resucitado está siempre presente, aunque los cristianos no siempre lo reconocen Lc 24:13-32", "color": "#F5C518"},
                    {"texto": ", este pasaje habla de los dos discípulos caminando en el camino a Emaús.", "color": "#FFFFFF"}
                ]

# 4. Move all 4 viñetas to page at idx_85

# Get the 4 viñetas from the page at idx_86
page86 = d[idx_86]
vinetas_to_move = []
for c in page86['contenido']:
    if c['tipo'] == 'vinetas':
        for item in c['numeracionItems']:
            vinetas_to_move.append(item)
        # Remove this content block from page86
        page86['contenido'].remove(c)

print(f"Viñetas to move: {len(vinetas_to_move)}")
for v in vinetas_to_move:
    print(f"  - {v['texto'][:50]}...")

# Also get the 2 viñetas from page at idx_85 itself (Cleofas, María)
# They should already be there. We just need to add the other 2 (Saulo, joven)
# Actually, let's check what's on page85 currently
print("\nCurrent page85 contenido types:")
for c in page85['contenido']:
    print(f"  - tipo: {c['tipo']}")
    if c['tipo'] == 'vinetas':
        for item in c['numeracionItems']:
            print(f"      VIN: {item['texto'][:50]}")

# Add vinetas as a new block at the end if they're not already there
# Check if we already have a vinetas block at the end
last_block = page85['contenido'][-1]
if last_block['tipo'] == 'vinetas':
    # Append to existing vinetas block
    for v in vinetas_to_move:
        if v not in last_block['numeracionItems']:
            last_block['numeracionItems'].append(v)
else:
    # Add new vinetas block
    page85['contenido'].append({
        "tipo": "vinetas",
        "numeracionItems": vinetas_to_move
    })

print("\nAfter fix, page85 contains:")
for c in page85['contenido']:
    print(f"  - tipo: {c['tipo']}")
    if c['tipo'] == 'vinetas':
        print(f"      Total viñetas: {len(c['numeracionItems'])}")
        for item in c['numeracionItems']:
            print(f"      VIN: {item['texto'][:60]}")

# Save
with open('src/data/data_seminario.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print("\nDone! IDs are now sequential and content is fixed.")
