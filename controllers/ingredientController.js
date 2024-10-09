const Ingredient = require('../models/ingredient');

// Controlador para listar todas as Ingredientes
const listAllIngredients = (req, res) => {
  const search = req.query.search || '';

  Ingredient.getAll(search, (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao listar Ingredientes" });

    // Modularizando os dados de brand e user no objeto retornado
    const ingredients = results.map(result => ({
      id: result.id,
      name: result.name,
      size: result.size,
      is_ml: result.is_ml,
      price: result.price,
      user: {
        id: result.user_id,
        name: result.user_email
      },
      brand: {
        id: result.brand_id,
        name: result.brand_name
      }
    }));

    res.json(ingredients);
  });
};

// Controlador para listar Ingredientes por user_id
const listIngredientsByUserId = (req, res) => {
  const { id } = req.params;
  Ingredient.getByUserId(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar Ingredientes por user_id" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Nenhum Ingrediente encontrado para este usuário" });
    }

    // Modularizando os dados da resposta
    const ingredients = results.map(result => ({
      id: result.id,
      brand: {
        id: result.brand_id,
        name: result.brand_name,
        userId: result.brand_userId,
      },
      user: {
        id: result.user_id,
        name: result.user_email
      },
      name: result.name,
      size: result.size,
      is_ml: result.is_ml,
      price: result.price,
    }));

    res.json(ingredients);
  });
};

// Controlador para criar uma nova Ingrediente
const createIngredient = (req, res) => {
  const { brand_id, user_id, name, size, is_ml, price } = req.body;

  if (brand_id === undefined || user_id === undefined || !name || size === undefined || is_ml === undefined || price === undefined) 
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });

  const newIngredient = new Ingredient(brand_id, user_id, name, size, is_ml, price);

  newIngredient.create((err, result) => {
    if (err) {
      console.error("Erro ao criar ingrediente:", err);
      return res.status(500).json({ error: "Erro ao criar ingrediente" });
    }
    res.status(201).json({ message: "Ingrediente criado com sucesso", id: result.insertId });
  });
};

// Controlador para editar uma Ingrediente existente
const updateIngredient = (req, res) => {
  const { id } = req.params;
  const { brand_id, user_id, name, size, is_ml, price } = req.body;

  if (brand_id === undefined || user_id === undefined || !name || size === undefined || is_ml === undefined || price === undefined) 
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  

  Ingredient.update(id, brand_id, user_id, name, size, is_ml, price, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao editar Ingrediente" });
    res.json({ message: `Ingrediente ${id} atualizado com sucesso` });
  });
};

// Controlador para deletar uma Ingrediente
const deleteIngredient = (req, res) => {
  const { id } = req.params;

  Ingredient.delete(id, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao deletar Ingrediente" });
    res.json({ message: `Ingrediente ${id} deletado com sucesso` });
  });
};

module.exports = {
  listAllIngredients,
  listIngredientsByUserId,
  createIngredient,
  updateIngredient,
  deleteIngredient
};
