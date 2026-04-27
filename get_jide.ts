import { GENERATED_USERS } from './src/mock/generatedData';
const jide = GENERATED_USERS.find(u => u.name.includes('Jide') || u.name.includes('Johnson'));
console.log(jide ? jide.id : 'NOT FOUND');
