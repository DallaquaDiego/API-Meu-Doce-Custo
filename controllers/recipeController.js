const Recipe = require('../models/recipe');
''
const listAllRecipes = (req, res) => {
  const search = req.query.search || '';

  Recipe.getAll(search, (err, data) => {
    if (err) return res.status(500).json({ error: "Erro ao listar receitas" });

    const { recipes, ingredientsUsed } = data;

    // Garantir que `ingredientsUsed` seja sempre um array
    const ingredients = ingredientsUsed || [];

    // Organizando os ingredientes usados por `recipe_id`
    const ingredientsByRecipe = {};
    ingredients.forEach(ingredient => {
      if (!ingredientsByRecipe[ingredient.recipe_id]) {
        ingredientsByRecipe[ingredient.recipe_id] = [];
      }
      ingredientsByRecipe[ingredient.recipe_id].push({
        id: ingredient.id,
        quantity: ingredient.quantity,
        cost: ingredient.cost,
        ingredient: {
          id: ingredient.ingredient_id,
          name: ingredient.ingredient_name,
          size: ingredient.ingredient_size,
          is_ml: ingredient.ingredient_is_ml,
          price: ingredient.ingredient_price,
          brand: {
            id: ingredient.brand_id,
            name: ingredient.brand_name
          }
        }
      });
    });

    // Modularizando os dados da resposta
    const recipesResponse = (recipes || []).map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      cost: recipe.cost,
      category: {
        id: recipe.recipe_category_id,
        name: recipe.category_name
      },
      user: {
        id: recipe.user_id,
        email: recipe.user_email
      },
      ingredients_used: ingredientsByRecipe[recipe.id] || []
    }));

    res.json(recipesResponse);
  });
};

const listRecipesByUserId = (req, res) => {
  const { user_id } = req.params;

  Recipe.getByUserId(user_id, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar receitas por user_id" });
    }

    const { recipes, ingredientsUsed } = data;

    // Garantir que `recipes` e `ingredientsUsed` sejam arrays
    const recipesList = recipes || [];
    const ingredients = ingredientsUsed || [];

    if (recipesList.length === 0) {
      return res.status(404).json({ message: "Nenhuma receita encontrada para este usuário" });
    }

    // Organizando os ingredientes usados por `recipe_id`
    const ingredientsByRecipe = {};
    ingredients.forEach(ingredient => {
      if (!ingredientsByRecipe[ingredient.recipe_id]) {
        ingredientsByRecipe[ingredient.recipe_id] = [];
      }
      ingredientsByRecipe[ingredient.recipe_id].push({
        id: ingredient.id,
        quantity: ingredient.quantity,
        cost: ingredient.cost,
        ingredient: {
          id: ingredient.ingredient_id,
          name: ingredient.ingredient_name,
          size: ingredient.ingredient_size,
          is_ml: ingredient.ingredient_is_ml,
          price: ingredient.ingredient_price,
          brand: {
            id: ingredient.brand_id,
            name: ingredient.brand_name
          }
        }
      });
    });

    // Modularizando os dados da resposta
    const recipesResponse = recipesList.map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      cost: recipe.cost,
      category: {
        id: recipe.recipe_category_id,
        name: recipe.category_name
      },
      user: {
        id: recipe.user_id,
        email: recipe.user_email
      },
      ingredients_used: ingredientsByRecipe[recipe.id] || []
    }));

    res.json(recipesResponse);
  });
};

const createRecipe = (req, res) => {
  const { recipe_category_id, user_id, name, cost } = req.body;

  if (!recipe_category_id || !user_id || !name) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const newRecipe = new Recipe(recipe_category_id, user_id, name, cost);
  newRecipe.post((err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao criar receita" });
    res.status(201).json({ message: "Receita criada com sucesso", id: result.insertId });
  });
};

const updateRecipe = (req, res) => {
  const { id } = req.params;
  const { recipe_category_id, user_id, name, cost } = req.body;

  if (!recipe_category_id || !user_id || !name) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  Recipe.update(id, recipe_category_id, user_id, name, cost, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao editar receita" });
    res.json({ message: `Receita ${id} atualizada com sucesso` });
  });
};

const deleteRecipe = (req, res) => {
  const { id } = req.params;

  Recipe.delete(id, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao deletar receita" });
    res.json({ message: `Receita ${id} deletada com sucesso` });
  });
};

module.exports = {
  listAllRecipes,
  listRecipesByUserId,
  createRecipe,
  updateRecipe,
  deleteRecipe
};
