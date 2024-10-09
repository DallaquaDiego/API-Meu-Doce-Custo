const { Router } = require('express');
const {
  listAllCategories,
  listCategoriesByUserId,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const verifyToken = require('../middlewares/authMiddleware');

const router = Router();

// GET
router.get('/', verifyToken, listAllCategories);

// GET com filtro
router.get('/:id', verifyToken, listCategoriesByUserId);

// POST
router.post('/', verifyToken, createCategory);

// PUT
router.put('/:id', verifyToken, updateCategory);

// DELETE
router.delete('/:id', verifyToken, deleteCategory);

module.exports = router;