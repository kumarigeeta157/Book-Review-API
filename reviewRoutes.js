const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { updateReview, deleteReview } = require('../controllers/reviewController');

const router = express.Router();

router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
