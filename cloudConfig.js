const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary configuration:
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // key must be same as these are the keywords
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({     // Cloudinary storage is used to store images in cloudinary
  cloudinary: cloudinary,
  params: {
    folder: "wanderLust_DEV",   // Folder name in cloudinary
    allowedFormats: ["jpeg", "png", "jpg"], // Allowed these formats to upload
  },
});

module.exports = {
  cloudinary,
  storage,
};
