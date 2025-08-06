const express = require('express');
const router = express.Router();
const products = require('../controllers/productControllers');
const protect = require('../middlewares/authMiddleware');

router.post('/', protect, products.createProduct);
router.get('/', protect, products.getAllProducts);
router.get('/low-stock', protect, products.getLowStockProducts);
router.get('/:id', protect, products.getProductById);
router.put('/:id', protect, products.updateProduct);
router.delete('/:id', protect, products.deleteProduct);
router.patch('/:id/stock', protect, products.updateStock);

module.exports = router; 