import { ENDPOINTS } from './endpoints';

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(ENDPOINTS.upload, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return await res.json(); // { url: ... }
}