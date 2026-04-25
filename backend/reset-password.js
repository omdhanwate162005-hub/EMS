const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function reset() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Vaishuu@1611',
        database: process.env.DB_NAME || 'ems_db'
    });

    try {
        const username = 'admin';
        const password = 'admin123';
        
        console.log(`Generating new hash for password: ${password}...`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Updating admin user in database...');
        // This will update the admin password if they exist, or create them if they don't
        const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (rows.length > 0) {
            await connection.query('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username]);
            console.log('✅ Password updated successfully!');
        } else {
            await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'admin']);
            console.log('✅ Admin user created successfully!');
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await connection.end();
    }
}

reset();
