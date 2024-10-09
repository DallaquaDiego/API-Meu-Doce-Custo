const Brand = require('../models/brand');

// Controlador para listar todas as marcas
const listAllBrands = (req, res) => {
  const search = req.query.search || ''; 

  Brand.getAll(search, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar as marcas" });
    }
    res.json(results);
  });
};

// Controlador para listar marcas por user_id
const listBrandsByUserId = (req, res) => {
  const { id } = req.params;
  Brand.getByUserId(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar marcas por user_id" });
    }
    if (results.length === 0) {
      return res.status(200).json({ message: "Nenhuma marca encontrada para este usuário" });
    }
    res.json(results);
  });
};

// Controlador para criar uma nova marca
const createBrand = (req, res) => {
  const { name, user_id } = req.body;
  const newBrand = new Brand(name, user_id);
  newBrand.create((err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao criar marca" });
    res.status(201).json({ message: "Marca criada com sucesso", id: result.insertId });
  });
};

// Controlador para editar uma marca existente
const updateBrand = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  Brand.update(id, name, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao editar marca" });
    res.json({ message: `Marca ${id} atualizada com sucesso` });
  });
};

// Controlador para deletar uma marca
const deleteBrand = (req, res) => {
  const { id } = req.params;

  Brand.delete(id, (err) => {
    if (err) return res.status(500).json({ error: "Erro ao deletar marca" });
    res.json({ message: `Marca ${id} deletada com sucesso` });
  });
};

module.exports = {
  listAllBrands,
  listBrandsByUserId,
  createBrand,
  updateBrand,
  deleteBrand
};
