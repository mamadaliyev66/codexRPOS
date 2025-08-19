import { addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/client';

async function seed() {
  await createUserWithEmailAndPassword(auth, 'admin@rpos.uz', 'Admin123!');
  const tables = Array.from({ length: 5 }).map((_, i) => ({ name: `Stol ${i + 1}`, status: "bo'sh" }));
  for (const t of tables) await addDoc(collection(db, 'tenants', 'default', 'tables'), t);
  const items = [
    { name: 'Osh', price: 30000, categoryId: '1' },
    { name: 'Shashlik', price: 25000, categoryId: '1' },
    { name: 'Somsa', price: 8000, categoryId: '1' },
    { name: 'Choy', price: 5000, categoryId: '2' },
    { name: 'Kofe', price: 10000, categoryId: '2' },
  ];
  for (const m of items) await addDoc(collection(db, 'tenants', 'default', 'menuItems'), m);
}

seed().then(() => console.log('Seeded')); 
