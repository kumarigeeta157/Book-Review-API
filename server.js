const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
app.use(express.json());

app.use('/', authRoutes);
app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);

app.get('/', (req, res) => res.send('Book Review API is running 🚀'));

const PORT = process.env.PORT || 3306;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
