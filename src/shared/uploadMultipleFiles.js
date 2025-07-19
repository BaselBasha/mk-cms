import { uploadFile } from './uploadFile';

export async function uploadMultipleFiles(files) {
  if (!files || files.length === 0) return [];
  const fileArray = Array.isArray(files) ? files : [files];
  const uploads = await Promise.all(fileArray.map(file => uploadFile(file)));
  return uploads; // array of { url, ... }
} 