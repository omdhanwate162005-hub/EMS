const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function setup() {
    // First connection without database to create it
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Vaishuu@1611'
    });

    console.log('Connected to MySQL server...');

    try {
        // Read the SQL file
        const sqlPath = path.join(__dirname, 'database.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon, but be careful with multi-line statements
        // For simplicity, we'll execute the whole file if the driver supports multiple statements
        // Or we can just run the specific commands we need.
        
        console.log('Creating database ems_db...');
        await connection.query('CREATE DATABASE IF NOT EXISTS ems_db');
        await connection.query('USE ems_db');

        console.log('Creating tables and inserting default data...');
        // We'll split the SQL by semicolon to execute one by one
        const queries = sql.split(';').filter(query => query.trim() !== '');
        
        for (let query of queries) {
            if (query.trim()) {
                await connection.query(query);
            }
        }

        console.log('✅ Database setup complete!');
        console.log('Admin User: admin');
        console.log('Password: admin123');

    } catch (err) {
        console.error('❌ Error during setup:', err.message);
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Check if your DB_PASSWORD in .env is correct.');
        }
    } finally {
        await connection.end();
    }
}

setup();
