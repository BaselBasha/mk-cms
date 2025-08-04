import { uploadFile } from './uploadFile';

export async function uploadMultipleFiles(files) {
  if (!files || files.length === 0) return [];

  const fileArray = Array.isArray(files) ? files : [files];
  
  try {
    const uploads = await Promise.all(
      fileArray.map(async (file) => {
        try {
          return await uploadFile(file);
        } catch (error) {
          console.error('Failed to upload file:', file.name || file, error);
          return null;
        }
      })
    );
    return uploads.filter(upload => upload !== null); // Filter out null results from uploadFile
  } catch (error) {
    console.error('Upload multiple files error:', error);
    return [];
  }
}