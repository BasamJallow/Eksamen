const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));

// Opret tabeller hvis de ikke findes
db.serialize(() => {
    // Portfolios tabel
    db.run(`CREATE TABLE IF NOT EXISTS portfolios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME NOT NULL
    )`);

    // Portfolio stocks tabel
    db.run(`CREATE TABLE IF NOT EXISTS portfolio_stocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        portfolio_id INTEGER NOT NULL,
        stock_symbol TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        purchase_price REAL NOT NULL,
        FOREIGN KEY (portfolio_id) REFERENCES portfolios(id)
    )`);
});

module.exports = db; 