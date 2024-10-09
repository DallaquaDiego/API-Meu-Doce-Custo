const { Router } = require('express');
const {
    listAllRecipes,
    listRecipesByUserId,
    createRecipe,
    updateRecipe,
    deleteRecipe
} = require('../controllers/recipeController');
const verifyToken = require('../middlewares/authMiddleware');

const router = Router();

// GET
router.get('/', verifyToken, listAllRecipes);

// GET com filtro
router.get('/:id', verifyToken, listRecipesByUserId);

// POST
router.post('/', verifyToken, createRecipe);

// PUT
router.put('/:id', verifyToken, updateRecipe);

// DELETE
router.delete('/:id', verifyToken, deleteRecipe);

module.exports = router;