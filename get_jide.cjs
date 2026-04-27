require('esbuild').buildSync({
  entryPoints: ['src/mock/generatedData.ts', 'src/mock/zones.ts', 'src/mock/users.ts'],
  bundle: true,
  format: 'cjs',
  outdir: 'dist_mock',
});
const { GENERATED_USERS } = require('./dist_mock/generatedData.js');
const jide = GENERATED_USERS.find(u => u.name.includes('Jide') || u.name.includes('Johnson'));
console.log(jide ? jide.id : 'NOT FOUND');
