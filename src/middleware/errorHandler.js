// Import multer for error handling
const multer = require('multer');

// This middleware catches errors from file uploads and other requests
function errorHandler(err, req, res, next) {
  // Handle multer (file upload) specific errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Image must be 5MB or less' });
    }
    return res.status(400).json({ message: err.message });
  }

  // Handle any other errors
  if (err) {
    return res.status(400).json({ message: err.message || 'Request failed' });
  }

  // If no error, continue to next middleware
  next();
}

module.exports = errorHandler;
