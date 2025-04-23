const sql = require('mssql');
const bcrypt = require('bcryptjs');

// Azure SQL-konfiguration
const config = {
    user: 'your-username',
    password: 'your-password',
    server: 'your-server.database.windows.net',
    database: 'your-database-name',
    options: {
        encrypt: true, // Kræves af Azure
        enableArithAbort: true
    }
};

class User {
    // Opret en ny bruger
    static async create(username, email, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('username', sql.NVarChar, username)
                .input('email', sql.NVarChar, email)
                .input('password', sql.NVarChar, hashedPassword)
                .query(`
                    INSERT INTO users (username, email, password)
                    VALUES (@username, @email, @password);
                    SELECT SCOPE_IDENTITY() AS id;
                `);
            return result.recordset[0].id;
        } catch (err) {
            throw new Error('Fejl ved oprettelse af bruger: ' + err.message);
        }
    }

    // Find en bruger baseret på brugernavn
    static async findByUsername(username) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('username', sql.NVarChar, username)
                .query('SELECT * FROM users WHERE username = @username');
            return result.recordset[0];
        } catch (err) {
            throw new Error('Fejl ved hentning af bruger: ' + err.message);
        }
    }

    // Find en bruger baseret på ID
    static async findById(userId) {
        try {
            const pool = await sql.connect(config);
            const result = await pool.request()
                .input('id', sql.Int, userId)
                .query('SELECT * FROM users WHERE id = @id');
            return result.recordset[0];
        } catch (err) {
            throw new Error('Fejl ved hentning af bruger: ' + err.message);
        }
    }

    // Verificer adgangskode
    static async verifyPassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    // Opdater adgangskode
    static async updatePassword(userId, newPassword) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const pool = await sql.connect(config);
            await pool.request()
                .input('id', sql.Int, userId)
                .input('password', sql.NVarChar, hashedPassword)
                .query('UPDATE users SET password = @password WHERE id = @id');
            return true;
        } catch (err) {
            throw new Error('Fejl ved opdatering af adgangskode: ' + err.message);
        }
    }
}

module.exports = User;