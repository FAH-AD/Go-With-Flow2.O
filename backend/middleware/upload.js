import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Create uploads directory if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        '-' +
        uniqueSuffix +
        path.extname(file.originalname).toLowerCase()
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images, PDFs, and common document formats
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|xls|xlsx|ppt|pptx/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file format. Allowed formats: images, PDFs, and common document formats.'
      )
    );
  }
};

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter,
});

/**
 * Middleware for handling single file uploads
 * @param {string} fieldName - Form field name for the file
 */
export const uploadSingle = (fieldName) => {
  return upload.single(fieldName);
};

/**
 * Middleware for handling multiple file uploads
 * @param {string} fieldName - Form field name for the files
 * @param {number} maxCount - Maximum number of files to upload
 */
export const uploadMultiple = (fieldName, maxCount = 5) => {
  return upload.array(fieldName, maxCount);
};

/**
 * Delete file from server
 * @param {string} filePath - Path to the file
 */
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};