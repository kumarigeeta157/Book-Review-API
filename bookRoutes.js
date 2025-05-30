const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { addBook, getBooks, getBookDetails, searchBooks } = require('../controllers/bookController');
const { addReview } = require('../controllers/reviewController');

const router = express.Router();

router.post('/', protect, addBook);
router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookDetails);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
