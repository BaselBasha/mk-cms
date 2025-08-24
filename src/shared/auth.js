export function getToken() {
  if (typeof window !== 'undefined') {
    const admin = JSON.parse(localStorage.getItem("admin"));
    return admin?.token;
  }
  return null;
}

export function isSuperAdmin() {
  if (typeof window !== 'undefined') {
    const admin = JSON.parse(localStorage.getItem("admin"));
    return admin?.admin?.role === 'super_admin';
  }
  return false;
}

export function getCurrentUserRole() {
  if (typeof window !== 'undefined') {
    const admin = JSON.parse(localStorage.getItem("admin"));
    return admin?.admin?.role || 'admin';
  }
  return 'admin';
} 