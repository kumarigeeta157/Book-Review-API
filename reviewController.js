const pool = require('../config/db');

// Add review 
exports.addReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { id: bookId } = req.params;
    const userId = req.user.id;
    try {
        const [existing] = await pool.query(
            'SELECT * FROM reviews WHERE user_id = ? AND book_id = ?',
            [userId, bookId]
        );
        if (existing.length > 0)
            return res.status(400).json({ message: 'You already reviewed this book' });

        await pool.query(
            'INSERT INTO reviews (user_id, book_id, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, bookId, rating, comment]
        );
        res.status(201).json({ message: 'Review added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// update review 
exports.updateReview = async (req, res) => {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;
    const userId = req.user.id;
    try {
        const [reviews] = await pool.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
        if (!reviews[0] || reviews[0].user_id !== userId)
            return res.status(403).json({ message: 'Not allowed' });

        await pool.query('UPDATE reviews SET rating = ?, comment = ? WHERE id = ?', [
            rating || reviews[0].rating,
            comment || reviews[0].comment,
            reviewId
        ]);
        res.json({ message: 'Review updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// delete review 

exports.deleteReview = async (req, res) => {
    const reviewId = req.params.id;
    const userId = req.user.id;
    try {
        const [reviews] = await pool.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
        if (!reviews[0] || reviews[0].user_id !== userId)
            return res.status(403).json({ message: 'Not allowed' });

        await pool.query('DELETE FROM reviews WHERE id = ?', [reviewId]);
        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
