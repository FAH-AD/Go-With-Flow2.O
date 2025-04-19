import Category from '../models/Category.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description, parentCategory, icon, order } = req.body;

    // Validate input
    if (!name) {
      return errorResponse(
        res,
        400,
        'Category name is required',
        { name: 'Category name is required' }
      );
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return errorResponse(
        res,
        400,
        'Category already exists',
        { name: 'A category with this name already exists' }
      );
    }

    // Create new category
    const category = new Category({
      name,
      description,
      parentCategory: parentCategory || null,
      icon: icon || 'briefcase',
      order: order || 0,
    });

    await category.save();

    return successResponse(
      res,
      201,
      'Category created successfully',
      { category }
    );
  } catch (error) {
    console.error('Create category error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    const { parentOnly = 'false' } = req.query;

    // Build query
    const query = { isActive: true };
    
    // Only get parent categories if requested
    if (parentOnly === 'true') {
      query.parentCategory = null;
    }

    // Get categories
    const categories = await Category.find(query).sort({ order: 1, name: 1 });

    return successResponse(
      res,
      200,
      'Categories retrieved successfully',
      { categories }
    );
  } catch (error) {
    console.error('Get categories error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);

    if (!category) {
      return errorResponse(
        res,
        404,
        'Category not found',
        { category: 'Category not found' }
      );
    }

    return successResponse(
      res,
      200,
      'Category retrieved successfully',
      { category }
    );
  } catch (error) {
    console.error('Get category error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, parentCategory, icon, order, isActive } = req.body;

    // Find category
    const category = await Category.findById(categoryId);

    if (!category) {
      return errorResponse(
        res,
        404,
        'Category not found',
        { category: 'Category not found' }
      );
    }

    // Check if name already exists (if changing)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });

      if (existingCategory) {
        return errorResponse(
          res,
          400,
          'Category name already exists',
          { name: 'A category with this name already exists' }
        );
      }
    }

    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (parentCategory !== undefined) category.parentCategory = parentCategory || null;
    if (icon) category.icon = icon;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return successResponse(
      res,
      200,
      'Category updated successfully',
      { category }
    );
  } catch (error) {
    console.error('Update category error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find category
    const category = await Category.findById(categoryId);

    if (!category) {
      return errorResponse(
        res,
        404,
        'Category not found',
        { category: 'Category not found' }
      );
    }

    // Check if category has subcategories
    const subcategories = await Category.find({ parentCategory: categoryId });

    if (subcategories.length > 0) {
      return errorResponse(
        res,
        400,
        'Cannot delete category with subcategories',
        { 
          subcategories: 'This category has subcategories. Please delete or reassign them first.'
        }
      );
    }

    // Delete category
    await category.remove();

    return successResponse(
      res,
      200,
      'Category deleted successfully',
      {}
    );
  } catch (error) {
    console.error('Delete category error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};

/**
 * @desc    Get subcategories
 * @route   GET /api/categories/:id/subcategories
 * @access  Public
 */
export const getSubcategories = async (req, res) => {
  try {
    const parentId = req.params.id;

    // Verify parent exists
    const parentCategory = await Category.findById(parentId);

    if (!parentCategory) {
      return errorResponse(
        res,
        404,
        'Parent category not found',
        { category: 'Parent category not found' }
      );
    }

    // Get subcategories
    const subcategories = await Category.find({ 
      parentCategory: parentId,
      isActive: true
    }).sort({ order: 1, name: 1 });

    return successResponse(
      res,
      200,
      'Subcategories retrieved successfully',
      { subcategories }
    );
  } catch (error) {
    console.error('Get subcategories error:', error);
    return errorResponse(
      res,
      500,
      'Server Error',
      { server: error.message }
    );
  }
};