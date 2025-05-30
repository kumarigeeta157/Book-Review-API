const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.protect = (req, res, next) => {
    var authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))

        return res.status(401).json({ message: 'No token' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};
