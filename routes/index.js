const express = require('express');
const routerBrand = require('./brandRoutes'); // Rota de Marcas
const routerIngredient = require('./ingredientRoutes'); // Rota de Ingredientes
const routerCategory = require('./categoryRoutes'); // Rota de Categorias
const routerRecipe = require('./recipeRoutes'); // Rota de Receitas
const routerIngredientUsed = require('./ingredientUsedRoutes'); // Rota de Receitas
const routerAuth = require('./authRoutes'); // Rota de Login
const verifyToken = require('../middlewares/authMiddleware'); // Autenticação



const router = express.Router();

router.use('/auth', routerAuth);

router.use('/brand', verifyToken, routerBrand);
router.use('/ingredient', verifyToken, routerIngredient);
router.use('/category', verifyToken, routerCategory);
router.use('/recipe', verifyToken, routerRecipe);
router.use('/ingredientUsed', verifyToken, routerIngredientUsed);

module.exports = router;