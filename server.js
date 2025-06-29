const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const predefinedFlights = require('./flightsData');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const port = 3000;

// Database setup
const db = new sqlite3.Database('./flight_booking.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the database.');
    
    // Create tables
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            passport_number TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS flights (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            flight_number TEXT NOT NULL,
            airline TEXT NOT NULL,
            departure_airport TEXT NOT NULL,
            arrival_airport TEXT NOT NULL,
            departure_time TEXT NOT NULL,
            arrival_time TEXT NOT NULL,
            price REAL NOT NULL,
            available_seats INTEGER NOT NULL,
            aircraft_type TEXT
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            flight_id INTEGER NOT NULL,
            booking_date TEXT DEFAULT CURRENT_TIMESTAMP,
            seat_number TEXT,
            status TEXT DEFAULT 'confirmed',
            passenger_name TEXT NOT NULL,
            passenger_passport TEXT,
            special_requests TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (flight_id) REFERENCES flights(id)
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS addons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL
        )`);
        
        db.run(`CREATE TABLE IF NOT EXISTS booking_addons (
            booking_id INTEGER NOT NULL,
            addon_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            PRIMARY KEY (booking_id, addon_id),
            FOREIGN KEY (booking_id) REFERENCES bookings(id),
            FOREIGN KEY (addon_id) REFERENCES addons(id)
        )`);
    });
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: 'lax' } // set to true if using HTTPS
}));

// User info endpoint
app.get('/api/me', (req, res) => {
    console.log('API /api/me called, session userId:', req.session.userId);
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized: Please log in' });
    }
    const query = `SELECT id, username, email, full_name FROM users WHERE id = ?`;
    db.get(query, [req.session.userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    });
});

// Authentication middleware
const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        if (req.originalUrl.startsWith('/api/')) {
            return res.status(401).json({ error: 'Unauthorized: Please log in' });
        } else {
            return res.redirect('/login.html');
        }
    }
    next();
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// User info endpoint
app.get('/api/me', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized: Please log in' });
    }
    const query = `SELECT id, username, email, full_name FROM users WHERE id = ?`;
    db.get(query, [req.session.userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    });
});

// User registration endpoint
app.post('/api/register', (req, res) => {
    const { username, password, email, full_name } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Username, password, and email are required' });
    }

    // Hash password
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        // Insert user into database
        const query = `INSERT INTO users (username, password, email, full_name) VALUES (?, ?, ?, ?)`;
        db.run(query, [username, hashedPassword, email, full_name], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Username or email already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'User registered successfully', userId: this.lastID });
        });
    });
});

// User login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', username);
    if (!username || !password) {
        console.log('Missing username or password');
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Error comparing passwords' });
            }
            if (!result) {
                console.log('Invalid password for user:', username);
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Set session userId
            req.session.userId = user.id;
            console.log('Login successful for user:', username);
            res.json({ message: 'Login successful' });
        });
    });
});

// Temporary endpoint to list users for testing
app.get('/api/users', (req, res) => {
    db.all(`SELECT id, username, email, full_name FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/register.html'));
});

// Helper function to generate flights for a given date
function generateFlightsForDate(date) {
    const flights = [];
    predefinedFlights.forEach(flight => {
        flight.departure_times.forEach((depTime, index) => {
            const depDateTime = new Date(`${date}T${depTime}:00`);
            const arrDateTime = new Date(`${date}T${flight.arrival_times[index]}:00`);
            flights.push({
                flight_number: flight.flight_number,
                airline: flight.airline,
                departure_airport: flight.departure_airport,
                arrival_airport: flight.arrival_airport,
                departure_time: depDateTime.toISOString(),
                arrival_time: arrDateTime.toISOString(),
                price: flight.price,
                available_seats: flight.available_seats,
                aircraft_type: flight.aircraft_type
            });
        });
    });
    return flights;
}

app.get('/api/flights', (req, res) => {
    const { departure, destination } = req.query;
    // Generate flights for a fixed date (today) or ignore date for filtering
    const today = new Date().toISOString().split('T')[0];
    const flights = generateFlightsForDate(today);
    const filteredFlights = flights.filter(flight => {
        const depMatch = departure ? flight.departure_airport.toLowerCase().includes(departure.toLowerCase()) : true;
        const destMatch = destination ? flight.arrival_airport.toLowerCase().includes(destination.toLowerCase()) : true;
        return depMatch && destMatch;
    });
    res.json(filteredFlights);
});

// Bookings
app.post('/api/bookings', requireLogin, (req, res) => {
    const { flight_id, passenger_name, passenger_passport, seat_number, special_requests } = req.body;
    
    db.run(
        `INSERT INTO bookings (user_id, flight_id, passenger_name, passenger_passport, seat_number, special_requests)
        VALUES (?, ?, ?, ?, ?, ?)`,

        [req.session.userId, flight_id, passenger_name, passenger_passport, seat_number, special_requests],
        function(err) {
            if (err) return res.status(400).json({ error: err.message });
            
            // Handle addons if any
            if (req.body.addons && Array.isArray(req.body.addons)) {
                const bookingId = this.lastID;
                const stmt = db.prepare(`INSERT INTO booking_addons (booking_id, addon_id, quantity) VALUES (?, ?, 1)`);
                
                req.body.addons.forEach(addonId => {
                    stmt.run(bookingId, addonId);
                });
                
                stmt.finalize();
            }
            
            res.json({ id: this.lastID });
        }
    );
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
});

// Other existing routes and server start code remain unchanged

// Change password endpoint using old password verification
app.post('/api/change-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Username, old password, and new password are required' });
    }

    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        bcrypt.compare(oldPassword, user.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Error comparing passwords' });
            }
            if (!result) {
                return res.status(401).json({ error: 'Old password is incorrect' });
            }

            // Hash new password
            const saltRounds = 10;
            bcrypt.hash(newPassword, saltRounds, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing new password:', err);
                    return res.status(500).json({ error: 'Error hashing new password' });
                }

                // Update password in database
                const updateQuery = `UPDATE users SET password = ? WHERE username = ?`;
                db.run(updateQuery, [hashedPassword, username], function(err) {
                    if (err) {
                        console.error('Error updating password:', err);
                        return res.status(500).json({ error: 'Error updating password' });
                    }
                    res.json({ message: 'Password changed successfully' });
                });
            });
        });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Flight Booking System running at http://localhost:${port}`);
});
