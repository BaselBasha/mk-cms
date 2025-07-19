export function getToken() {
  if (typeof window !== 'undefined') {
    const admin = JSON.parse(localStorage.getItem("admin"));
    return admin?.token;
  }
  return null;
} 