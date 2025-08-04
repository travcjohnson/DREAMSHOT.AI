// Simplified auth utils for build purposes
// These will be updated when we implement full authentication

export async function getCurrentUser() {
  return null;
}

export async function requireAuth() {
  // Placeholder - will redirect to login
  return { id: '', email: '', name: '', role: 'USER' };
}

export async function requireAdmin() {
  // Placeholder - will redirect to dashboard
  return { id: '', email: '', name: '', role: 'ADMIN' };
}