import re
file_path = r'c:\Users\pezemiwe\Documents\lasg-audit-platform\src\pages\AuditPlanning\index.tsx'
content = open(file_path, 'r', encoding='utf-8').read()

# Remove unused lucide imports
content = content.replace('  Sparkles,\n', '')
content = content.replace('  Target,\n', '')
content = content.replace('  Layers,\n', '')

# Remove unused const flagConfig and fmtCurrency (need to find and remove them)
content = re.sub(r'\nconst flagConfig = \{.*?\};\n', '\n', content, flags=re.DOTALL)
content = re.sub(r'\nconst fmtCurrency = \(.*?\};\n', '\n', content, flags=re.DOTALL)
content = re.sub(r'\nconst fmtCurrency = [^\n]+\n', '\n', content)

open(file_path, 'w', encoding='utf-8').write(content)
print('Cleaned imports!')
