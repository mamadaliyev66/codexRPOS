# rPOS

Modern Expo TypeScript restoran POS ilovasi. Barcha ko'rinadigan matnlar o'zbek tilida.

## Boshlash

```bash
npm install
npm run seed:admin   # bir martalik ma'lumotlarni to'ldirish
npm start
```

## Muhit

Quyidagi Expo public env o'zgaruvchilarini `.env` faylida belgilang:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `EXPO_PUBLIC_FIREBASE_DATABASE_URL`
- `EXPO_PUBLIC_TENANT_ID` *(ixtiyoriy, default `default`)*

## Skriptlar

- `npm run start` – Expo server
- `npm run android` / `npm run ios` / `npm run web`
- `npm run web:clean` – keshni tozalab webni ishga tushurish
- `npm run typecheck` – TypeScript tekshiruvi
- `npm run lint` – ESLint
- `npm test` – Jest testlari
- `npm run seed:admin` – Firebasega boshlang'ich ma'lumotlarni yuborish
- `npm run rules:deploy` – Firestore xavfsizlik qoidalarini jo'natish

## Eslatma

UI barcha foydalanuvchilarga o'zbek tilida ko'rsatiladi.
