// Import file system and path modules
const fs = require('fs');
const path = require('path');
// Import multer for handling file uploads
const multer = require('multer');

// This function creates the multer upload handler for image files
function createUpload() {
  // Define the folder where uploaded files are stored
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  // Create the uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure where and how to store uploaded files
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    // Generate a unique filename for each upload
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname || '').toLowerCase() || '.jpg';
      cb(null, `post-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
    },
  });

  // Create and return the multer upload handler with file restrictions
  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB per file
    // Only allow image files
    fileFilter: (req, file, cb) => {
      const extension = path.extname(file.originalname || '').toLowerCase();
      const allowedExtensions = new Set([
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tif', '.tiff', '.svg',
        '.heic', '.heif', '.avif', '.jfif', '.ico',
      ]);

      if ((file.mimetype && file.mimetype.startsWith('image/')) || allowedExtensions.has(extension)) {
        cb(null, true);
        return;
      }
      cb(new Error('Only image files are allowed'));
    },
  });
}

module.exports = createUpload;
