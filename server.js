const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here
  database: 'eventsphere_db'
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and create table if it doesn't exist
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();

    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS eventsphere_db');
    await connection.execute('USE eventsphere_db');

    // Create users table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        accountType VARCHAR(50),
        eventType VARCHAR(100),
        decorations TEXT,
        profilePicture VARCHAR(255),
        age INT,
        referrer VARCHAR(255),
        suggestion TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createTableQuery);
    console.log('Database and users table initialized successfully');
    connection.release();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Helper function to insert user into database
async function insertUser(userData) {
  try {
    const connection = await pool.getConnection();
    const insertQuery = `
      INSERT INTO users
      (firstName, lastName, email, password, accountType, eventType, decorations, profilePicture, age, referrer, suggestion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(insertQuery, [
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password,
      userData.accountType,
      userData.eventType,
      userData.decorations,
      userData.profilePicture,
      userData.age,
      userData.referrer,
      userData.suggestion
    ]);

    connection.release();
    return result;
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
}

// Helper function to check if email exists
async function emailExists(email) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
    connection.release();
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking email:', error);
    throw error;
  }
}

// Initialize database on startup
initializeDatabase();
console.log('Using MySQL database: eventsphere_db');

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'register.html'));
});

app.post('/register', upload.single('file'), async (req, res) => {
  try {
    const {
      'first-name': firstName,
      'last-name': lastName,
      email,
      'new-password': password,
      'account-type': accountType,
      'event-type': eventType,
      decoration,
      age,
      referrer,
      suggestion
    } = req.body;

    // Handle decorations array
    const decorations = Array.isArray(decoration) ? decoration.join(', ') : decoration || '';

    // Handle profile picture
    const profilePicture = req.file ? req.file.filename : null;

    const userData = {
      firstName,
      lastName,
      email,
      password,
      accountType,
      eventType,
      decorations,
      profilePicture,
      age: age ? parseInt(age) : null,
      referrer,
      suggestion
    };

    // Check if email already exists
    const exists = await emailExists(email);
    if (exists) {
      return res.status(400).send(`
        <html>
          <head><title>Registration Error</title></head>
          <body style="font-family: Arial; text-align: center; padding: 50px;">
            <h2>Registration Failed</h2>
            <p>Email already exists. Please use a different email.</p>
            <a href="/register" style="color: blue; text-decoration: underline;">Go back to registration</a>
          </body>
        </html>
      `);
    }

    // Insert new user into database
    const result = await insertUser(userData);
    console.log('User registered successfully:', userData.email);
    console.log('User ID:', result.insertId);

    // Redirect to thank you page
    res.redirect('/thank-you');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send(`
      <html>
        <head><title>Registration Error</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h2>Registration Failed</h2>
          <p>An error occurred during registration. Please try again.</p>
          <a href="/register" style="color: blue; text-decoration: underline;">Go back to registration</a>
        </body>
      </html>
    `);
  }
});

app.get('/thank-you', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You - EventSphere</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .thank-you-container {
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 500px;
                width: 90%;
            }
            h1 {
                color: #667eea;
                margin-bottom: 20px;
                font-size: 2.5em;
            }
            .checkmark {
                color: #28a745;
                font-size: 4em;
                margin-bottom: 20px;
            }
            p {
                color: #666;
                font-size: 1.1em;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            .home-button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 30px;
                border: none;
                border-radius: 25px;
                font-size: 1.1em;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                transition: transform 0.3s ease;
            }
            .home-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
        </style>
    </head>
    <body>
        <div class="thank-you-container">
            <div class="checkmark">✓</div>
            <h1>Thank You!</h1>
            <p>Your registration has been successfully submitted to our database. We're excited to help you create an amazing event experience!</p>
            <p>Our team will contact you soon with more details about your event planning.</p>
            <a href="/" class="home-button">Return to Home</a>
        </div>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure to install dependencies with: npm install');
  console.log('Make sure MySQL is running and create database "eventsphere_db"');
});