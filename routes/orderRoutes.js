const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(['user']), orderController.createOrder);
router.get('/user', authMiddleware(['user']), orderController.getUserOrders);
router.get('/:id', authMiddleware(['user', 'admin']), orderController.getOrderById);
router.get('/', authMiddleware(['admin']), orderController.getOrders);
router.put('/:id/status', authMiddleware(['deliveryBoy']), orderController.updateOrderStatus);

module.exports = router;