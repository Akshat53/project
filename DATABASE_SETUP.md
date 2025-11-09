# 🗄️ EventSphere Database Setup Guide

## Quick Start (Recommended)

Your application has **automatic database setup**! Just follow these steps:

### 1. Install MySQL

**macOS (Homebrew):**
```bash
brew install mysql
```

**macOS (Manual Download):**
Download from: https://dev.mysql.com/downloads/mysql/

### 2. Start MySQL Service

```bash
# Using Homebrew
brew services start mysql

# Or manually
sudo mysql.server start
```

### 3. Set MySQL Password

```bash
# Login to MySQL
mysql -u root

# Inside MySQL console, run:
ALTER USER 'root'@'localhost' IDENTIFIED BY '8969';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Start Your Application

```bash
npm install
npm start
```

**That's it!** The application will automatically:
- ✅ Create the database `eventsphere_db`
- ✅ Create all required tables
- ✅ Insert sample events

---

## Manual Setup (Alternative)

If you prefer manual setup, use the provided SQL script:

### Step 1: Login to MySQL
```bash
mysql -u root -p
# Enter password: 8969
```

### Step 2: Run the Setup Script
```bash
# From your project directory
mysql -u root -p8969 < setup_database.sql
```

---

## Database Configuration

The database is configured in `server.js` with these settings:

```javascript
{
  host: 'localhost',
  user: 'root',
  password: '8969',
  database: 'eventsphere_db'
}
```

**To change the password:**
1. Edit `server.js` line 35
2. Update your MySQL root password to match

---

## Database Tables

### 1. **users**
Stores registered users from the registration form
- id, firstName, lastName, email, password
- accountType, eventType, age
- profilePicture, decorations, referrer, suggestion

### 2. **events**
Stores all available events
- id, title, description, date, time
- location, category, price, maxAttendees, imageUrl

### 3. **event_registrations** (Main Dashboard Data)
Stores customer registrations from event modals
- id, eventId, firstName, lastName, email
- phone, message, registrationDate

### 4. **feedbacks**
Stores customer reviews/feedback
- id, name, email, rating, message

---

## Verify Setup

### Check if MySQL is running:
```bash
brew services list | grep mysql
# Should show "started"
```

### Login to MySQL:
```bash
mysql -u root -p8969
```

### Check database and tables:
```sql
SHOW DATABASES;
USE eventsphere_db;
SHOW TABLES;
SELECT * FROM events;
```

### Check application connection:
```bash
npm start
# Look for: "MySQL database initialized successfully"
```

---

## Troubleshooting

### Problem: "Access denied for user 'root'"
**Solution:** Reset MySQL password
```bash
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY '8969';
```

### Problem: "Can't connect to MySQL server"
**Solution:** Start MySQL service
```bash
brew services start mysql
```

### Problem: "Database already exists"
**Solution:** This is OK! The app will use the existing database.

---

## View Your Data

### In MySQL Console:
```sql
USE eventsphere_db;

-- View all registrations
SELECT * FROM event_registrations;

-- View all feedbacks
SELECT * FROM feedbacks;

-- View all users
SELECT * FROM users;
```

### In Dashboard:
Visit: http://localhost:4000/dashboard

---

## Reset Database (Optional)

```sql
DROP DATABASE eventsphere_db;
-- Then restart your application to recreate
```

---

## Database Flow

1. **User registers for event** → Saved to `event_registrations`
2. **User submits feedback** → Saved to `feedbacks`
3. **User registers account** → Saved to `users`
4. **Admin views dashboard** → Queries all tables

All data is stored in **MySQL** and displayed in real-time!
