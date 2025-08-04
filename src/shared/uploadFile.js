import { ENDPOINTS } from './endpoints';

export async function uploadFile(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!(file instanceof File)) {
    throw new Error('Invalid file object');
  }

  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const res = await fetch(ENDPOINTS.upload, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed: ${res.status} - ${errorText}`);
    }
    
    const result = await res.json();
    return {
      url: result.url,
      name: file.name,
      type: file.type,
      size: file.size
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}