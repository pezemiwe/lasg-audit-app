import re

file_path = r'c:\Users\pezemiwe\Documents\lasg-audit-platform\src\pages\AuditPlanning\index.tsx'
content = open(file_path, 'r', encoding='utf-8').read()

# Add import after PreliminaryAnalytics import
content = content.replace(
    'import { PreliminaryAnalytics } from "./PreliminaryAnalytics";',
    'import { PreliminaryAnalytics } from "./PreliminaryAnalytics";\nimport { MaterialityAssessment } from "./MaterialityAssessment";'
)

# Replace the entire MaterialityStep component with a thin wrapper
# Find start
mat_start = content.find('const MaterialityStep: React.FC<{')
# Find 'const RiskMatrixStep'
risk_start = content.find('const RiskMatrixStep: React.FC<{')

old_materiality = content[mat_start:risk_start]

new_materiality = '''const MaterialityStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  materialityData: AuditStore["materiality"][0] | undefined;
  analytics: PreliminaryAnalytic[];
  store: AuditStore;
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
}> = ({ audit, lgaName, materialityData, analytics, store, user }) => {
  return <MaterialityAssessment />;
};

'''

content = content.replace(old_materiality, new_materiality)
open(file_path, 'w', encoding='utf-8').write(content)
print('Replaced MaterialityStep!')
