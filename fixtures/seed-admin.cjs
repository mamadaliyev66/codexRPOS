// fixtures/seed-admin.cjs
const admin = require('firebase-admin');
const path = require('path');
const sa = require('./serviceAccount.json');

// ----- CONFIG -----
const TENANT_ID = process.env.TENANT_ID || 'default';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rpos.uz';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123';
// -------------------

admin.initializeApp({
  credential: admin.credential.cert(sa),
});
const db = admin.firestore();
const auth = admin.auth();

async function ensureAdminUser() {
  let user;
  try { user = await auth.getUserByEmail(ADMIN_EMAIL); }
  catch { user = await auth.createUser({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, displayName: 'Admin', emailVerified: true }); }
  await db.doc(`tenants/${TENANT_ID}/users/${user.uid}`).set({
    uid: user.uid, tenantId: TENANT_ID, displayName: 'Admin', email: ADMIN_EMAIL,
    role: 'admin', active: true, createdAt: Date.now(),
  }, { merge: true });
  return user.uid;
}

async function seedSettings() {
  await db.doc(`tenants/${TENANT_ID}/settings/app`).set({
    currency: 'UZS', serviceRate: 0.10, taxRate: 0.12,
  }, { merge: true });
}

async function seedTables() {
  const batch = db.batch();
  for (let i = 1; i <= 8; i++) {
    const id = `T${String(i).padStart(2,'0')}`;
    batch.set(db.doc(`tenants/${TENANT_ID}/tables/${id}`), {
      id, tenantId: TENANT_ID, name: `Stol ${i}`, seats: 4, status: "bo'sh",
    }, { merge: true });
  }
  await batch.commit();
}

async function seedMenu() {
  const cats = [
    { id: 'hot', name: 'Issiq taomlar', index: 1 },
    { id: 'cold', name: 'Sovuq taomlar', index: 2 },
    { id: 'drink', name: 'Ichimliklar', index: 3 },
  ];
  const batch = db.batch();
  cats.forEach((c, i) => {
    batch.set(db.doc(`tenants/${TENANT_ID}/menuCategories/${c.id}`), {
      id: c.id, tenantId: TENANT_ID, name: c.name, index: i+1, active: true, createdAt: Date.now(),
    }, { merge: true });
  });
  [
    { id: 'plov', name: 'Osh', price: 35000, categoryId: 'hot' },
    { id: 'shashlik', name: 'Shashlik', price: 28000, categoryId: 'hot' },
    { id: 'lagman', name: 'Lagʻmon', price: 30000, categoryId: 'hot' },
    { id: 'salad', name: 'Salat', price: 15000, categoryId: 'cold' },
    { id: 'tea', name: 'Choy', price: 5000, categoryId: 'drink' },
    { id: 'cola', name: 'Coca-Cola 0.5L', price: 12000, categoryId: 'drink' },
  ].forEach((it) => {
    batch.set(db.doc(`tenants/${TENANT_ID}/menuItems/${it.id}`), {
      id: it.id, tenantId: TENANT_ID, name: it.name, price: it.price,
      categoryId: it.categoryId, active: true, createdAt: Date.now(),
    }, { merge: true });
  });
  await batch.commit();
}

(async () => {
  const uid = await ensureAdminUser();
  await seedSettings();
  await seedTables();
  await seedMenu();
  console.log(`✅ Seed complete for tenant "${TENANT_ID}". Admin UID: ${uid}`);
  process.exit(0);
})().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
