import { store } from './demoStore';
import { assertDemoMode } from './api';

// Session holds only { id, role }. No passwords, personal details, or ID documents are stored in browser storage.
const SESSION_KEY = 'civicfix.session';
const normalizePhone = (v) => v.replace(/[\s-]/g, '');

async function sha256(text) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure browser context required. Open CivicFix on localhost or over HTTPS.');
  }
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Hashing in the browser is NOT production-grade. The backend must use bcrypt or argon2.
async function verifyPassword(account, password) {
  if (account.passwordHash) return (await sha256(password)) === account.passwordHash;
  return account.demoPassword === password; // seeded demo accounts only
}

const toUser = (acc, role) => ({
  id: acc.id, role, name: acc.name, email: acc.email, phone: acc.phone, age: acc.age, address: acc.address,
  designation: acc.designation, department: acc.department, authorityId: acc.authorityId,
});

function startSession(role, acc) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: acc.id, role }));
  return toUser(acc, role);
}

export function getSessionUser() {
  try {
    const s = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (!s) return null;
    const acc = s.role === 'citizen'
      ? store.citizens.find((c) => c.id === s.id)
      : store.authorities.find((a) => a.id === s.id);
    if (!acc) return null;
    if (s.role === 'authority' && acc.verification !== 'approved') return null;
    return toUser(acc, s.role);
  } catch {
    return null;
  }
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export async function login(role, { identifier, password }) {
  assertDemoMode('Login');
  const key = identifier.trim().toLowerCase();
  if (role === 'citizen') {
    const acc = store.citizens.find(
      (c) => c.email.toLowerCase() === key || normalizePhone(c.phone) === normalizePhone(identifier)
    );
    if (!acc || !(await verifyPassword(acc, password))) throw new Error('The email/phone or password is incorrect.');
    return startSession(role, acc);
  }

  const acc = store.authorities.find((a) => a.email.toLowerCase() === key || a.authorityId.toLowerCase() === key);
  if (!acc || !(await verifyPassword(acc, password))) throw new Error('The authority ID/email or password is incorrect.');
  if (acc.verification !== 'approved') {
    throw new Error('Your authority account is awaiting verification. Portal access is not available yet.');
  }
  return startSession(role, acc);
}

export async function registerCitizen(d) {
  assertDemoMode('Registration');
  const email = d.email.trim().toLowerCase();
  const phone = normalizePhone(d.phone);
  if (store.citizens.some((c) => c.email.toLowerCase() === email)) throw new Error('An account with this email already exists.');
  if (store.citizens.some((c) => normalizePhone(c.phone) === phone)) throw new Error('An account with this phone number already exists.');

  const acc = {
    id: `c-${Date.now()}`, name: d.name.trim(), age: Number(d.age), address: d.address.trim(),
    email, phone, passwordHash: await sha256(d.password),
  };
  store.citizens.push(acc);
  return toUser(acc, 'citizen');
}

// Authority registration never grants access. The account stays pending until a verification process approves it.
export async function registerAuthority(d, file) {
  assertDemoMode('Authority registration');
  const email = d.email.trim().toLowerCase();
  const id = d.authorityId.trim().toLowerCase();
  if (store.authorities.some((a) => a.email.toLowerCase() === email || a.authorityId.toLowerCase() === id)) {
    throw new Error('An authority account with this email or ID already exists.');
  }
  store.authorities.push({
    id: `a-${Date.now()}`, name: d.name.trim(), designation: d.designation.trim(), department: d.department,
    authorityId: d.authorityId.trim(), email, phone: normalizePhone(d.phone),
    passwordHash: await sha256(d.password), verification: 'pending',
    idDocumentName: file?.name || '', // only the file name is kept; the document itself is not stored
    submittedAt: new Date().toISOString(),
  });
  return { status: 'pending' };
}

export async function updateProfile(userId, patch) {
  assertDemoMode('Profile update');
  const acc = store.citizens.find((c) => c.id === userId);
  if (!acc) throw new Error('Account not found.');
  Object.assign(acc, {
    name: patch.name.trim(), age: Number(patch.age), address: patch.address.trim(), phone: normalizePhone(patch.phone),
  });
  return toUser(acc, 'citizen');
}
