file_path = r'c:\Users\pezemiwe\Documents\lasg-audit-platform\src\pages\AuditPlanning\index.tsx'
content = open(file_path, 'r', encoding='utf-8').read()

pas_start = content.find('const PreliminaryAnalyticsStep: React.FC<{')
mat_start = content.find('const MaterialityStep: React.FC<{')
old_pas = content[pas_start:mat_start]

new_pas = '''const PreliminaryAnalyticsStep: React.FC<{
  audit: AuditStore["audits"][0];
  lgaName: string;
  analytics: PreliminaryAnalytic[];
  store: AuditStore;
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
}> = ({ audit, lgaName, analytics, store, user }) => {
  void audit; void lgaName; void analytics; void store; void user;
  return <PreliminaryAnalytics />;
};

'''
content = content.replace(old_pas, new_pas)
open(file_path, 'w', encoding='utf-8').write(content)
print('Replaced PreliminaryAnalyticsStep! Saved.')
