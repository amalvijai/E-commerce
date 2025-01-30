const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(['admin']), offerController.createOffer);
router.get('/', authMiddleware(['admin', 'user']), offerController.getOffers);

module.exports = router;