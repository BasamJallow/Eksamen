
// Azure SQL-konfiguration
const config = {
    user: 'your-username',
    password: 'your-password',
    server: 'your-server.database.windows.net',
    database: 'your-database-name',
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

class Portfolio {
    static async create(name, accountId, userId) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('name', sql.NVarChar, name)
                .input('account_id', sql.Int, accountId)
                .input('user_id', sql.Int, userId)
                .query(`
                    INSERT INTO portfolios (name, account_id, user_id)
                    VALUES (@name, @account_id, @user_id);
                    SELECT SCOPE_IDENTITY() AS id;
                `);
            return result.recordset[0].id;
        } catch (err) {
            throw new Error('Fejl ved oprettelse af portefølje: ' + err.message);
        }
    }

    static async getAllForUser(userId) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('user_id', sql.Int, userId)
                .query('SELECT * FROM portfolios WHERE user_id = @user_id');
            return result.recordset;
        } catch (err) {
            throw new Error('Fejl ved hentning af porteføljer: ' + err.message);
        }
    }
}

module.exports = Portfolio;



