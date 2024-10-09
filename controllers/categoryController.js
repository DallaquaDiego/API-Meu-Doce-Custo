const Category = require('../models/category');

// Controlador para listar todas as categorias
const listAllCategories = (req, res) => {
  const search = req.query.search || ''; 

  Category.getAll(search, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar as categorias" });
    }
    res.json(results);
  });
};

// Controlador para listar categorias por user_id
const listCategoriesByUserId = (req, res) => {
  const { id } = req.params;
  Category.getByUserId(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar categorias por user_id" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Nenhuma categoria encontrada para este usuário" });
    }
    res.json(results);
  });
};

// Controlador para criar uma nova categoria
const createCategory = (req, res) => {
  const { name, user_id } = req.body;
  const newCategory = new Category(name, user_id);
  newCategory.create((err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao criar categoria" });
    res.status(201).json({ message: "Categoria criada com sucesso", id: result.insertId });
  });
};

// Controlador para editar uma categoria existente
const updateCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  Category.update(id, name, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao editar categoria" });
    res.json({ message: "Categoria ${id} atualizada com sucesso" });
  });
};

// Controlador para deletar uma categoria
const deleteCategory = (req, res) => {
  const { id } = req.params;

  Category.delete(id, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao deletar categoria" });
    res.json({ message: "Categoria ${id} deletada com sucesso" });
  });
};

module.exports = {
  listAllCategories,
  listCategoriesByUserId,
  createCategory,
  updateCategory,
  deleteCategory
};
