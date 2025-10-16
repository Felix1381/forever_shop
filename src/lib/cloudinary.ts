import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadImage = async (file: File | string, folder: string = 'rita-aloe') => {
  try {
    const result = await cloudinary.uploader.upload(file as string, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit', quality: 'auto' },
      ],
    });
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
};

export const getOptimizedImageUrl = (publicId: string, options?: {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
}) => {
  const { width = 400, height = 400, quality = 'auto', format = 'auto' } = options || {};
  
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality,
    format,
    fetch_format: 'auto',
  });
};
