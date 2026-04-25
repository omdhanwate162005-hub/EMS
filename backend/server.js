require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'EMS API is running',
        timestamp: new Date().toISOString()
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
        console.error('\n⚠️  Please ensure MySQL is running and database is set up.');
        console.error('   Run: mysql -u root -p < database.sql\n');
    }

    app.listen(PORT, () => {
        console.log(`\n🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
    });
};

startServer();
