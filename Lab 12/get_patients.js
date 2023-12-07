// In get_patients.js
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
host: "127.0.0.1",
port: "5432",
user: "postgres",
password: "wHOAREYOU0304!",
database: "emergency_waitlist"
});

app.use(express.json());

app.get('/patients', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM PATIENTS');
        res.json(result.rows);
        client.release();
    } catch (err) {
        res.status(500).send('Server error');
        console.error('Database error', err.stack);
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});