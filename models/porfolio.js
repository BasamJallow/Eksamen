const db = require('../database');

class Portfolio {
    static async create(name, userId) {
        try {
            return new Promise((resolve, reject) => {
                const created_at = new Date().toISOString();
                db.run(
                    'INSERT INTO portfolios (name, user_id, created_at) VALUES (?, ?, ?)',
                    [name, userId, created_at],
                    function(err) {
                        if (err) reject(err);
                        resolve(this.lastID);
                    }
                );
            });
        } catch (error) {
            throw error;
        }
    }

    static async addStock(portfolioId, stockSymbol, quantity, purchasePrice) {
        try {
            return new Promise((resolve, reject) => {
                db.run(
                    'INSERT INTO portfolio_stocks (portfolio_id, stock_symbol, quantity, purchase_price) VALUES (?, ?, ?, ?)',
                    [portfolioId, stockSymbol, quantity, purchasePrice],
                    function(err) {
                        if (err) reject(err);
                        resolve(this.lastID);
                    }
                );
            });
        } catch (error) {
            throw error;
        }
    }

    static async calculateGAK(portfolioId, stockSymbol) {
        try {
            return new Promise((resolve, reject) => {
                db.all(
                    `SELECT SUM(quantity * purchase_price) as total_cost, 
                     SUM(quantity) as total_quantity 
                     FROM portfolio_stocks 
                     WHERE portfolio_id = ? AND stock_symbol = ?`,
                    [portfolioId, stockSymbol],
                    (err, rows) => {
                        if (err) reject(err);
                        const row = rows[0];
                        const gak = row.total_quantity > 0 ? 
                            row.total_cost / row.total_quantity : 0;
                        resolve(gak);
                    }
                );
            });
        } catch (error) {
            throw error;
        }
    }
}


module.exports = Portfolio; 
