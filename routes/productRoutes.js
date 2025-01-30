const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); 
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/apply-offer', authMiddleware(['admin']), productController.applyOffer);
router.post('/bulk', authMiddleware(['admin']), productController.createMultipleProducts);

module.exports = router;

