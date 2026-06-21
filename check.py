import json
import os
os.chdir(r'C:\Users\LENOVO\Desktop\LADP-1\seminarios\seminario-evangelios-sinopticos3')
with open('src/data/data_seminario.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
# Show full content of pages 77-84
for p in data:
    if p['id'] in ['77', '78', '79', '80', '81', '82', '83', '84']:
        print(f"=== Page {p['id']} ===")
        print(json.dumps(p, ensure_ascii=False, indent=2)[:500])
        print()
