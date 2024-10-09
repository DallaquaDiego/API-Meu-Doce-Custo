const { Router } = require('express');
const {
  listAllBrands,
  listBrandsByUserId,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');
const verifyToken = require('../middlewares/authMiddleware');

const router = Router();

// GET
router.get('/', verifyToken, listAllBrands);

// GET com filtro
router.get('/:id', verifyToken, listBrandsByUserId);

// POST
router.post('/', verifyToken, createBrand);

// PUT
router.put('/:id', verifyToken, updateBrand);

// DELETE
router.delete('/:id', verifyToken, deleteBrand);

module.exports = router;