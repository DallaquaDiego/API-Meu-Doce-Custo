const { Router } = require('express');
const {
  listAllIngredientUsed,
  listIngredientUsedByUserId,
  createIngredientUsed,
  updateIngredientUsed,
  deleteIngredientUsed
} = require('../controllers/ingredientUsedController');
const verifyToken = require('../middlewares/authMiddleware');

const router = Router();

// GET
router.get('/', verifyToken, listAllIngredientUsed);

// GET com filtro
router.get('/:id', verifyToken, listIngredientUsedByUserId);

// POST
router.post('/', verifyToken, createIngredientUsed);

// PUT
router.put('/:id', verifyToken, updateIngredientUsed);

// DELETE
router.delete('/:id', verifyToken, deleteIngredientUsed);

module.exports = router;