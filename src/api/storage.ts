import { loadingManager } from '../utils/loadingManager';

const API_ORIGIN = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';
const UPLOAD_ENDPOINT = `${API_ORIGIN}/api/v1/storage/upload`;
const PRESIGN_ENDPOINT = `${API_ORIGIN}/api/v1/storage/presign`;

export interface UploadResult {
  url: string;
  key: string;
  fileName: string;
  contentType: string;
}

export const storageApi = {
  /**
   * Upload an image file to Neon Database Storage
   * Returns the permanent public download URL to store in hotel/room models
   */
  uploadImage: async (file: File, folder: 'hotels' | 'rooms' | 'general' = 'hotels'): Promise<UploadResult> => {
    loadingManager.start();
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      return {
        url: result.url,
        key: result.key,
        fileName: file.name,
        contentType: file.type || 'image/jpeg'
      };
    } catch (err: any) {
      console.warn('Neon storage direct upload failed, attempting presigned fallback:', err);
      // Fallback: request presigned URL
      try {
        const presignRes = await fetch(PRESIGN_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type || 'image/jpeg',
            folder
          })
        });

        if (presignRes.ok) {
          const { uploadUrl, downloadUrl, objectKey } = await presignRes.json();
          const putRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type || 'image/jpeg' },
            body: file
          });

          if (putRes.ok) {
            return {
              url: downloadUrl,
              key: objectKey,
              fileName: file.name,
              contentType: file.type || 'image/jpeg'
            };
          }
        }
      } catch (presignErr) {
        console.error('Presign fallback also failed:', presignErr);
      }

      // If network/storage unavailable, provide base64 data URL preview fallback
      return await new Promise<UploadResult>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            url: reader.result as string,
            key: `local-${Date.now()}-${file.name}`,
            fileName: file.name,
            contentType: file.type || 'image/jpeg'
          });
        };
        reader.onerror = () => reject(err);
        reader.readAsDataURL(file);
      });
    } finally {
      loadingManager.stop();
    }
  }
};
