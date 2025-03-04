const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/sales', authMiddleware, reportController.getSalesReport);
router.get('/products', authMiddleware, reportController.getProductReport);
router.get('/users', authMiddleware, reportController.getUserReport);
router.get('/orders', authMiddleware, reportController.getOrderReport);

module.exports = router;