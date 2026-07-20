import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('[Cloudinary] Configured successfully.');
} else {
  console.log('[Cloudinary] Credentials not configured. Using fallback Base64 database storage.');
}

/**
 * Uploads an image (either base64 data URL or external URL) to Cloudinary if configured.
 * If not configured, returns the original image string back (fallback to base64/URL database storage).
 * @param imageStr The base64 data URL or external URL string
 * @param folder The target folder name in Cloudinary (e.g. 'posts', 'testimonials')
 */
export const uploadImage = async (imageStr: string, folder: string): Promise<string> => {
  if (!imageStr) return '';
  
  // If it's already an external HTTP URL and not base64, keep it
  if (imageStr.startsWith('http') && !isCloudinaryConfigured) {
    return imageStr;
  }

  // If not configured or not a base64 string, just return the string
  if (!isCloudinaryConfigured || !imageStr.startsWith('data:')) {
    return imageStr;
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(imageStr, {
      folder: `pratibha_brand/${folder}`,
      resource_type: 'image'
    });
    return uploadResponse.secure_url;
  } catch (error: any) {
    console.error(`[Cloudinary] Upload failed: ${error.message}. Falling back to original string.`);
    return imageStr;
  }
};
