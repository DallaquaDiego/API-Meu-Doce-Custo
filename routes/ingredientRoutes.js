const { Router } = require('express');
const {
  listAllIngredients,
  listIngredientsByUserId,
  createIngredient,
  updateIngredient,
  deleteIngredient
} = require('../controllers/ingredientController');
const verifyToken = require('../middlewares/authMiddleware');

const router = Router();

// GET
router.get('/', verifyToken, listAllIngredients);

// GET com filtro
router.get('/:id', verifyToken, listIngredientsByUserId);

// POST
router.post('/', verifyToken, createIngredient);

// PUT
router.put('/:id', verifyToken, updateIngredient);

// DELETE
router.delete('/:id', verifyToken, deleteIngredient);

module.exports = router;