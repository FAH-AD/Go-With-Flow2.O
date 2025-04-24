import express from 'express';
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  deleteConversation,
  deleteMessage
} from '../controllers/messageController.js';
import { protect, isVerified } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.get('/conversations', protect, isVerified, getConversations);
router.post('/conversations', protect, isVerified, createConversation);
router.get('/conversations/:id', protect, isVerified, getMessages);
router.post('/', protect, isVerified, upload.array(5), sendMessage);
router.delete('/conversations/:id', protect, isVerified, deleteConversation);
router.delete('/:id', protect, isVerified, deleteMessage);

export default router;
