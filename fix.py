import json
import os
os.chdir(r'C:\Users\LENOVO\Desktop\LADP-1\seminarios\seminario-evangelios-sinopticos3')
with open('src/data/data_seminario.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Remove empty pages
empty_ids = ['77', '78', '84', '85', '86', '87', '88']
data = [p for p in data if p['id'] not in empty_ids]
print(f"Removed {len(empty_ids)} empty pages")

# Renumber 79->83 to 77->81
import re
for p in data:
    pid = p['id']
    if pid.isdigit() and int(pid) >= 79 and int(pid) <= 83:
        new_id = str(int(pid) - 2)
        p['id'] = new_id
        print(f"Renumbered {pid} -> {new_id}")

with open('src/data/data_seminario.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("Saved. Total pages:", len(data))
