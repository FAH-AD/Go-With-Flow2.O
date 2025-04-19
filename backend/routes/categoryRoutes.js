import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getSubcategories
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = express.Router();

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
router.get('/', getCategories);

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
router.get('/:id', getCategoryById);

/**
 * @desc    Get subcategories
 * @route   GET /api/categories/:id/subcategories
 * @access  Public
 */
router.get('/:id/subcategories', getSubcategories);

// Admin routes
router.post('/', protect, isAdmin, createCategory);
router.put('/:id', protect, isAdmin, updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

export default router;