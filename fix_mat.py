content = open(r'c:\Users\pezemiwe\Documents\lasg-audit-platform\src\pages\AuditPlanning\MaterialityAssessment.tsx', 'r', encoding='utf-8').read()

# Remove duplicate import s
content = content.replace('\nimport s from "../../styles/pages.module.css";\n\nimport s from "../../styles/pages.module.css";', '\nimport s from "../../styles/pages.module.css";')

# Remove TYPE_META (not needed in materiality component)
import re
content = re.sub(r'\nconst TYPE_META.*?\};\n', '\n', content, flags=re.DOTALL)

open(r'c:\Users\pezemiwe\Documents\lasg-audit-platform\src\pages\AuditPlanning\MaterialityAssessment.tsx', 'w', encoding='utf-8').write(content)
print('Fixed!')
