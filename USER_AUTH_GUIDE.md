# 👤 User Registration & Login System Guide

## ✅ Complete User Authentication System Implemented!

Users can now register, login, and access their profile page!

---

## 🎯 Complete User Flow

### Step 1: User Registration
1. Visit: **http://localhost:4000/register**
2. Fill in the registration form:
   - First Name & Last Name
   - Email Address
   - Password (must include uppercase, lowercase, number, and special character)
   - Account Type (Personal/Business)
   - Event Type (Birthday, Marriage, Corporate, College Fest, etc.)
   - Optional: Decorations, Age, Referrer, Suggestions
3. Click **"Submit"**
4. User data saved to MySQL database
5. Redirected to Thank You page

### Step 2: User Login
1. Visit: **http://localhost:4000/login**
2. Enter credentials:
   - Email address (used during registration)
   - Password (used during registration)
3. Click **"Login"**
4. Session created
5. Redirected to user profile

### Step 3: User Profile
- View personal information
- See event preferences
- Access quick actions
- Browse events
- Logout option

---

## 🔐 Authentication Features

### Session Management:
- 24-hour session duration
- Secure server-side sessions
- Separate from admin sessions
- Auto-login if session exists

### Password Requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@$!%*?&)

### Navigation Updates:
- **Not Logged In**: Shows "Login" link
- **Logged In**: Shows user's first name with profile link

---

## 📱 Routes & Pages

### Public Routes (No Login Required):
- **/** - Homepage
- **/register** - User registration page
- **/login** - User login page
- **/api/events** - Browse events
- **/api/events/register** - Register for events
- **/api/feedback** - Submit feedback

### Protected Routes (Login Required):
- **/profile** - User profile page
- **/api/user/profile** - Get user data

### Admin Routes (Admin Login Required):
- **/admin-login** - Admin login (username: admin, password: admin@123)
- **/dashboard** - Admin dashboard
- **/api/dashboard/*** - Dashboard APIs

---

## 🧪 Test the System

### Test 1: Complete Registration Flow
```
1. Open: http://localhost:4000/register
2. Fill form with:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: Test@1234
   - Select account type and event type
3. Submit form
4. See "Thank You" page ✅
```

### Test 2: Login with Registered Credentials
```
1. Open: http://localhost:4000/login
2. Enter:
   - Email: john@example.com
   - Password: Test@1234
3. Click Login
4. Redirected to profile page ✅
```

### Test 3: Profile Access
```
1. After logging in, visit: http://localhost:4000/profile
2. See your profile information:
   - Name: John Doe
   - Email: john@example.com
   - Account Type, Event Type, etc.
3. See "Logout" button ✅
```

### Test 4: Navigation Changes
```
1. Before login: Navigation shows "Login"
2. After login: Navigation shows "John" (your first name)
3. Click name to go to profile ✅
```

### Test 5: Session Persistence
```
1. Login to your account
2. Navigate to homepage
3. Close browser tab
4. Reopen: http://localhost:4000
5. Navigation still shows your name (logged in) ✅
```

### Test 6: Logout
```
1. Go to profile page
2. Click "Logout" button
3. Redirected to homepage
4. Navigation shows "Login" again ✅
```

---

## 📊 Database Tables

### users Table:
Stores registered user information:
```sql
- id (auto-increment)
- firstName
- lastName
- email (unique)
- password (plain text - should use bcrypt in production)
- accountType
- eventType
- decorations
- profilePicture
- age
- referrer
- suggestion
- createdAt (timestamp)
```

**View Users:**
```bash
mysql -u root -pAkshat@5346 eventsphere_db -e "SELECT id, firstName, lastName, email, accountType, eventType FROM users;"
```

---

## 🔑 API Endpoints

### Authentication APIs:

**POST /user-login**
- Body: `{ email, password }`
- Returns: `{ success: true/false, message }`
- Creates user session

**GET /user-logout**
- Destroys user session
- Redirects to homepage

**GET /api/auth/status**
- Returns: `{ isAuthenticated, userName, userEmail }`
- Used to check login status

**GET /api/user/profile**
- Returns: User profile data
- Requires authentication

---

## 🎨 UI Features

### Login Page:
- Beautiful gradient design
- Email & password fields
- Error handling
- Loading states
- Links to registration and home

### Profile Page:
- Welcome banner
- Personal information grid
- Event preferences
- Quick actions (Browse events, Leave feedback)
- Logout button

### Navigation:
- Dynamic link changes based on login status
- Shows user's first name when logged in
- Click name to access profile

---

## 🔄 Session Flow

```
User registers
  ↓
Data saved to database
  ↓
User visits login page
  ↓
Enters email & password
  ↓
Server validates credentials
  ↓
Session created (24 hours)
  ↓
User redirected to profile
  ↓
Navigation shows user's name
  ↓
User can browse & register for events
  ↓
Logout → Session destroyed
```

---

## 🚀 Quick Start

### Register a New User:
```bash
open http://localhost:4000/register
```

### Login:
```bash
open http://localhost:4000/login
```

### View Profile:
```bash
open http://localhost:4000/profile
```

---

## 📝 Files Created/Modified

1. **html/login.html** - User login page
2. **html/profile.html** - User profile page
3. **server.js** - Added user auth routes
4. **html/index.html** - Updated navigation with dynamic link

---

## 🔐 Security Notes

### Current Implementation:
- ✅ Session-based authentication
- ✅ Server-side password validation
- ✅ Protected routes
- ⚠️ Plain text passwords (should use bcrypt)
- ⚠️ No HTTPS (should use SSL in production)

### Production Recommendations:
1. Use bcrypt to hash passwords
2. Implement HTTPS
3. Add CSRF protection
4. Add rate limiting on login
5. Implement password reset
6. Add email verification
7. Use environment variables for secrets

---

## 💡 Key Points

1. **Two Separate Auth Systems**:
   - User authentication (for customers)
   - Admin authentication (for dashboard access)

2. **Session Storage**:
   - Uses express-session
   - Stored server-side
   - 24-hour expiry

3. **Password Validation**:
   - Client-side regex validation
   - Server-side credential check
   - Currently plain text (improve for production)

4. **Navigation Intelligence**:
   - Checks auth status on page load
   - Updates link dynamically
   - Shows user's name when logged in

---

## 🎯 Complete System Overview

### User Journey:
1. **Homepage** → Browse without login
2. **Register** → Create account with email/password
3. **Login** → Enter credentials
4. **Profile** → View personal info
5. **Browse Events** → Register for events (from anywhere)
6. **Logout** → End session

### Admin Journey:
1. **Admin Login** (/admin-login)
2. **Dashboard** → View all data
3. **See Registrations** → Customer event registrations
4. **See Feedbacks** → User reviews
5. **Logout** → End admin session

---

## ✨ Test It Now!

### Create Your Account:
1. **Register**: http://localhost:4000/register
2. Fill form with your details
3. Use a strong password
4. Submit

### Login:
1. **Login**: http://localhost:4000/login
2. Enter your email & password
3. Access your profile!

### Browse & Book Events:
1. Go to homepage
2. Click "Explore Events"
3. Register for any event
4. Your registration saves to database!

---

**Your complete user registration and login system is ready! 🎉**

Users can now:
- ✅ Register with email & password
- ✅ Login with their credentials
- ✅ View their profile
- ✅ Stay logged in for 24 hours
- ✅ Logout when done

Everything is working perfectly! Test it out! 🚀
