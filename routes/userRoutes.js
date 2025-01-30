const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', authMiddleware(['user', 'admin', 'deliveryBoy']), userController.logout);
router.get('/profile', authMiddleware(['user', 'admin', 'deliveryBoy']), userController.getProfile);
router.put('/profile', authMiddleware(['user', 'admin', 'deliveryBoy']), userController.updateProfile);

module.exports = router;