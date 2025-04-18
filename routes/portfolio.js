const express = require('express');
const router = express.Router();
const db = require('../database');
const axios = require('axios'); // Import af axios for API requests



async function fetchStockPrices(symbols) {
  const apiKey = 'YOUR_API_KEY';
  const symbolList = symbols.join(',');
  const url = `ht

  try {
    const response = await axios.get(url);
    return response.data; // Array of stock price objects
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    return [];
  }
}
router.get('/portfolio', async (req, res) => {
    try {
      // Fetch portfolios and associated stocks from your database
      const portfolios = await getPortfoliosFromDB(); // Implement this function
      const portfolioStocks = await getPortfolioStocksFromDB(); // Implement this function
  
      // Extract unique stock symbols
      const symbols = [...new Set(portfolioStocks.map(stock => stock.stock_symbol))];
  
      // Fetch real-time stock prices
      const stockPrices = await fetchStockPrices(symbols);
  
      // Map stock prices to portfolio stocks
      const updatedPortfolioStocks = portfolioStocks.map(stock => {
        const priceData = stockPrices.find(price => price.symbol === stock.stock_symbol);
        return {
          ...stock,
          currentPrice: priceData ? priceData.price : null,
        };
      });
  
      res.render('portfolio', {
        portfolios,
        portfolioStocks: updatedPortfolioStocks,
        error: null,
      });
    } catch (error) {
      console.error('Error rendering portfolio:', error);
      res.status(500).send('Server Error');
    }
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
