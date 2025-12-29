const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an audio buffer to Cloudinary and returns the secure URL.
 * Cloudinary treats audio under `resource_type: 'video'`.
 * @param {Buffer} buffer
 * @param {string} filename
 * @param {string} mimeType
 * @returns {Promise<{ url: string, duration?: number }>} 
 */
function uploadAudioBuffer(buffer, filename, mimeType) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'audio-shop',
        public_id: filename.replace(/\.[^/.]+$/, ''),
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, duration: result.duration });
      }
    );

    uploadStream.end(buffer);
  });
}

module.exports = {
  cloudinary,
  uploadAudioBuffer,
};
