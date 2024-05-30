const express = require('express');
const { pool } = require('./db.js');
const app = express();
const port = 3000;

// Middleware for parsing JSON data
app.use(express.json());

// Get all companies
app.get('/companies', async (req, res) => {
    try {
        const companies = await pool.query('SELECT * FROM companies');
        res.json(companies.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all the vessels
app.get('/vessels', async (req, res) => {
    try {
        const vessels = await pool.query('SELECT * FROM vessels');
        res.json(vessels.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Get all the operation table
app.get('/operations', async (req, res) => {
    try {
        const operations = await pool.query('SELECT * FROM operations');
        res.json(operations.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});