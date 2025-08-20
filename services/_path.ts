// services/_path.ts
import { collection, doc } from 'firebase/firestore';
import { db } from '../firebase/client';

export const tenantId = process.env.EXPO_PUBLIC_TENANT_ID || 'default';

// Firestore helpers (collection/doc under /tenants/{tenantId}/…)
export const tcol = (...segments: string[]) => collection(db, 'tenants', tenantId, ...segments);
export const tdoc = (...segments: string[]) => doc(db, 'tenants', tenantId, ...segments);
