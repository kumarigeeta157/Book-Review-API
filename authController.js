const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Email already registered' });

        const hashed = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
            username,
            email,
            hashed
        ]);
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
