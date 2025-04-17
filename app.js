const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', portfolioRoutes);

// Render hovedsiden
app.get('/', (req, res) => {
    res.render('index');
});

// Tilføj denne nye route for porteføljesiden
app.get('/portfolio', (req, res) => {
    res.render('portfolio');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Noget gik galt!' });
});

module.exports = app; 