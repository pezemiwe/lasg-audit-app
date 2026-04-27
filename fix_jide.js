const fs = require('fs');

const storePath = 'src/store/useAuditStore.ts';
let content = fs.readFileSync(storePath, 'utf8');

if (!content.includes('Jide Johnson')) {
  // We will patch SEED_AUDITS before initializing state to find Jide Johnson
  const patch = \
// --- Jide Johnson Patch ---
const jide = MOCK_USERS.find(u => u.name && u.name.includes('Jide') && u.name.includes('Johnson'));
if (jide) {
  SEED_AUDITS.forEach(a => {
    a.leadId = jide.id;
  });
  LGAS.forEach(l => {
    l.auditLeadId = jide.id;
  });
}
// --------------------------
\;

  content = content.replace('export const useAuditStore = create<AuditStore>()(', patch + '\nexport const useAuditStore = create<AuditStore>()(');
  fs.writeFileSync(storePath, content);
  console.log('Patched');
} else {
  console.log('Already patched');
}
