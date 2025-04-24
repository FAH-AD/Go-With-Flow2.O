import express from 'express';
import { upload,uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

router.post('/test-upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      
      const cloudinaryResult = await uploadToCloudinary(req.file);
  
  
      res.status(200).json({
        message: 'File uploaded successfully',
        file: {
          url: cloudinaryResult.secure_url,
          public_id: cloudinaryResult.public_id,
          format: cloudinaryResult.format,
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        message: 'Error uploading file',
        error: error.message || 'Unknown error',
      });
    }
  });
  

export default router;