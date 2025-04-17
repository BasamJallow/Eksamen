const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Opret portfolios tabel hvis den ikke eksisterer
db.run(`
  CREATE TABLE IF NOT EXISTS portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    account_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

class Portfolio {
    static async create(name, accountId, userId) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO portfolios (name, account_id, user_id) VALUES (?, ?, ?)',
                [name, accountId, userId],
                function(err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    static async getAllForUser(userId) {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM portfolios WHERE user_id = ?',
                [userId],
                (err, portfolios) => {
                    if (err) reject(err);
                    resolve(portfolios);
                }
            );
        });
    }
}

module.exports = Portfolio;