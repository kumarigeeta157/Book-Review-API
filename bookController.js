const pool = require('../config/db');

exports.addBook = async (req, res) => {
    const { title, author, genre } = req.body;
    try {
        await pool.query('INSERT INTO books (title, author, genre) VALUES (?, ?, ?)', [
            title,
            author,
            genre
        ]);
        res.status(201).json({ message: 'Book added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBooks = async (req, res) => {
    const { page = 1, limit = 10, author, genre } = req.query;
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (author) {
        query += ' AND author LIKE ?';
        params.push(`%${author}%`);
    }
    if (genre) {
        query += ' AND genre = ?';
        params.push(genre);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(+limit, +offset);

    try {
        const [books] = await pool.query(query, params);
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBookDetails = async (req, res) => {
    const bookId = req.params.id;
    try {
        const [[book]] = await pool.query('SELECT * FROM books WHERE id = ?', [bookId]);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const [reviews] = await pool.query(
            `SELECT r.id, r.rating, r.comment, u.username 
       FROM reviews r JOIN users u ON r.user_id = u.id
       WHERE r.book_id = ?`,
            [bookId]
        );

        const avg = reviews.length
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
            : 'No ratings yet';

        res.json({ book, averageRating: avg, reviews });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.searchBooks = async (req, res) => {
    const { query } = req.query;
    try {
        const [books] = await pool.query(
            'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?',
            [`%${query}%`, `%${query}%`]
        );
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
