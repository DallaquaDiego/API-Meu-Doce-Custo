const IngredientUsed = require('../models/ingredientUsed');

// Controlador para listar todos os ingredientes usados
const listAllIngredientUsed = (req, res) => {
  IngredientUsed.getAll((err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao listar os ingredientes usados" });

    // Modularizando os dados da resposta
    const ingredientsUsed = results.map(result => ({
      id: result.id,
      ingredient: {
        id: result.ingredient_id,
        name: result.ingredient_name,
        brand: {
          id: result.brand_id,
          name: result.brand_name
        }
      },
      recipe: {
        id: result.recipe_id,
        name: result.recipe_name,
        category: {
          id: result.category_id,
          name: result.category_name
        }
      },
      user: {
        id: result.user_id,
        name: result.user_email
      },
      quantity: result.quantity,
      cost: result.cost
    }));

    res.json(ingredientsUsed);
  });
};

// Controlador para listar ingredientes usados por user_id
const listIngredientUsedByUserId = (req, res) => {
  const { user_id } = req.params;

  IngredientUsed.getByUserId(user_id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar os ingredientes usados por user_id" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Nenhum ingrediente usado encontrado para este usuário" });
    }

    // Modularizando os dados resposta
    const ingredientsUsed = results.map(result => ({
      id: result.id,
      ingredient: {
        id: result.ingredient_id,
        name: result.ingredient_name,
        brand: {
          id: result.brand_id,
          name: result.brand_name
        }
      },
      recipe: {
        id: result.recipe_id,
        name: result.recipe_name,
        category: {
          id: result.category_id,
          name: result.category_name
        }
      },
      user: {
        id: result.user_id,
        name: result.user_email
      },
      quantity: result.quantity,
      cost: result.cost
    }));

    res.json(ingredientsUsed);
  });
};

const createIngredientUsed = (req, res) => {
  const { ingredient_id, recipe_id, user_id, quantity, cost } = req.body;

  if (ingredient_id === undefined || recipe_id === undefined || user_id === undefined || quantity === undefined) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const newIngredientUsed = new IngredientUsed(ingredient_id, recipe_id, user_id, quantity, cost);
  
  newIngredientUsed.post((err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao criar o registro de ingrediente usado" });
    res.status(201).json({ message: "Ingrediente usado criado com sucesso", id: result.insertId });
  });
};

const updateIngredientUsed = (req, res) => {
  const { id } = req.params;
  const { ingredient_id, recipe_id, user_id, quantity, cost } = req.body;

  if (!ingredient_id || !recipe_id || !user_id || !quantity) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  IngredientUsed.update(id, ingredient_id, recipe_id, user_id, quantity, cost, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao atualizar o registro de ingrediente usado" });
    res.json({ message: `Registro de ingrediente usado ${id} atualizado com sucesso` });
  });
};

const deleteIngredientUsed = (req, res) => {
  const { id } = req.params;

  IngredientUsed.delete(id, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao deletar o registro de ingrediente usado" });
    res.json({ message: `Registro de ingrediente usado ${id} deletado com sucesso` });
  });
};

module.exports = {
  listAllIngredientUsed,
  listIngredientUsedByUserId,
  createIngredientUsed,
  updateIngredientUsed,
  deleteIngredientUsed
};
