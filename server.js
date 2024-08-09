const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// SQLite Database Setup
const db = new sqlite3.Database('data.db');

// Create table if it doesn't exist
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, name TEXT, email TEXT, message TEXT)");
});

// Handle form submission
app.post('/api/index', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.send('All fields are required.');
    }

    // Insert data into the database
    const stmt = db.prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)");
    stmt.run(name, email, message, function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Failed to save message.');
        }
        res.send('Message saved successfully!');
    });
    stmt.finalize();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on  https://antxgonist.github.io/Ayjss-website/:${PORT}`);
});
