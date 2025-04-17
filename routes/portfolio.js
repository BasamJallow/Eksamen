const express = require('express');
const router = express.Router();
const db = require('../database');

// Simpel funktion til at hente aktiekurser (simuleret data)
function getStockPrices() {
    // Hårdkodede test-data (i virkeligheden ville dette komme fra en API)
    return [
        { navn: "Apple", symbol: "AAPL", kurs: 180.25 },
        { navn: "Microsoft", symbol: "MSFT", kurs: 325.50 },
        { navn: "Tesla", symbol: "TSLA", kurs: 245.75 }
    ];
}

// === PORTFOLIO VISNING ===
router.get('/portfolio', (req, res) => {
    res.render('portfolio');  // sørg for portfolio.ejs eksisterer
    // Hent alle porteføljer
    db.all('SELECT * FROM portfolios', [], (err, portfolios) => {
        if (err) {
            console.error('Database fejl:', err);
            return res.status(500).send('Database fejl');
        }

        // Hent aktier for hver portefølje
        db.all('SELECT * FROM portfolio_stocks', [], (err, stocks) => {
            if (err) {
                console.error('Database fejl:', err);
                return res.status(500).send('Database fejl');
            }

            // Demo aktiekurser
            const marketStocks = [
                {
                    name: "Apple Inc.",
                    symbol: "AAPL",
                    portfolio: "Growth Tech",
                    change: 1.27,
                    value: 35201
                },
                {
                    name: "Microsoft Corporation",
                    symbol: "MSFT",
                    portfolio: "Growth Tech",
                    change: -1.21,
                    value: 11000
                },
                {
                    name: "Alphabet Inc.",
                    symbol: "GOOGL",
                    portfolio: "Tech Leaders",
                    change: -2.13,
                    value: 7584
                },
                {
                    name: "Meta Platforms Inc.",
                    symbol: "META",
                    portfolio: "Growth Tech",
                    change: 0.32,
                    value: 6500
                }
            ];

            res.render('portfolio', {
                portfolios: portfolios || [],
                portfolioStocks: stocks || [],
                marketStocks: marketStocks,
                error: null
            });
        });
    });
});

// Opret ny portefølje
router.post('/portfolio/create', (req, res) => {
    const { name, userId } = req.body; //
    const created_at = new Date().toISOString(); // Opretter en ny dato

    db.run(
        'INSERT INTO portfolios (name, user_id, created_at) VALUES (?, ?, ?)',
        [name, userId, created_at],
        function(err) {
            if (err) {
                console.error('Kunne ikke oprette portefølje:', err); // Log fejl
                return res.status(500).send('Kunne ikke oprette portefølje'); // Send fejlmeddelelse
            }
            res.redirect('/portfolio'); // Redirect til porteføljevisning
        }
    );
});


// Tilføj aktie til portefølje
router.post('/portfolio/add-stock', (req, res) => {
    const { portfolioId, stockSymbol, quantity, purchasePrice } = req.body;
    
    db.run(
        'INSERT INTO portfolio_stocks (portfolio_id, stock_symbol, quantity, purchase_price) VALUES (?, ?, ?, ?)',
        [portfolioId, stockSymbol, quantity, purchasePrice],
        function(err) {
            if (err) {
                console.error('Kunne ikke tilføje aktie:', err);
                return res.status(500).send('Kunne ikke tilføje aktie');
            }
            res.redirect('/portfolio');
        }
    );
});

module.exports = router;
