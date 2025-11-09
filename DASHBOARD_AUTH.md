# 🔐 Dashboard Authentication Guide

## Security Features Added

Your dashboard is now protected with session-based authentication!

---

## 🔑 Login Credentials

**Default Admin Login:**
- **Username**: `admin`
- **Password**: `admin@123`

**To Change Credentials:**
Edit `server.js` at lines 424-425:
```javascript
const ADMIN_USERNAME = 'admin';      // Change this
const ADMIN_PASSWORD = 'admin@123';  // Change this
```

---

## 🚀 How to Access Dashboard

### Step 1: Start the Server
```bash
npm start
```

### Step 2: Open Admin Login
Visit: **http://localhost:4000/admin-login**

### Step 3: Enter Credentials
- Username: `admin`
- Password: `admin@123`

### Step 4: Access Dashboard
After successful login, you'll be redirected to the dashboard automatically!

---

## 🛡️ What's Protected

### Protected Routes:
- ✅ `/dashboard` - Dashboard page
- ✅ `/api/dashboard/stats` - Statistics API
- ✅ `/api/dashboard/recent-registrations` - Recent registrations API
- ✅ `/api/dashboard/all-registrations` - All registrations API
- ✅ `/api/dashboard/users` - Users API
- ✅ `/api/dashboard/feedbacks` - Feedbacks API

### Public Routes (Not Protected):
- `/` - Homepage
- `/register` - User registration
- `/api/events` - Events list
- `/api/events/register` - Event registration
- `/api/feedback` - Submit feedback

---

## 🔄 Session Details

- **Session Duration**: 24 hours
- **Session Type**: Server-side session with cookies
- **Logout**: Click "Logout" button in dashboard header

---

## 🎯 Usage Flow

1. **First Time Access**:
   - Visit `/dashboard` → Redirects to `/admin-login`
   - Login with credentials
   - Redirected back to dashboard

2. **Already Logged In**:
   - Session persists for 24 hours
   - Direct access to `/dashboard` works
   - No need to login again

3. **Logout**:
   - Click "Logout" button in dashboard
   - Session destroyed
   - Redirected to login page

---

## 🔒 Security Features

1. **Session-Based Authentication**
   - Secure server-side sessions
   - No passwords stored in cookies
   - Auto-expires after 24 hours

2. **Protected API Endpoints**
   - All dashboard APIs require authentication
   - Unauthorized requests redirect to login

3. **Login Validation**
   - Server-side credential checking
   - Failed login attempts show error messages
   - No access without valid credentials

---

## 🧪 Testing

### Test Login:
```bash
# Open browser
http://localhost:4000/admin-login

# Enter credentials:
Username: admin
Password: admin@123

# You should be redirected to dashboard
```

### Test Protection:
```bash
# Try accessing dashboard without login
http://localhost:4000/dashboard
# Should redirect to login page

# After login, try again
# Should show dashboard
```

### Test Logout:
```bash
# Click "Logout" button in dashboard
# Should redirect to login page
# Try accessing dashboard again
# Should redirect to login (session destroyed)
```

---

## 🛠️ Customization

### Change Session Duration:
Edit `server.js` at line 18:
```javascript
cookie: {
  maxAge: 24 * 60 * 60 * 1000  // Change to desired milliseconds
}
```

### Add More Admin Users:
Modify the login logic in `server.js` at line 420:
```javascript
// Example: Multiple admins
const admins = {
  'admin': 'admin@123',
  'manager': 'manager@456',
  'owner': 'owner@789'
};

if (admins[username] && admins[username] === password) {
  // Login successful
}
```

### Use Database for Admin Credentials:
Create an `admins` table and check credentials from database instead of hardcoded values.

---

## ⚠️ Important Notes

1. **Change Default Password**: The default password `admin@123` is for testing only. Change it before production!

2. **HTTPS**: For production, use HTTPS to encrypt login data in transit.

3. **Password Hashing**: Consider using bcrypt to hash passwords instead of plain text.

4. **Session Secret**: Change the session secret in `server.js` line 14 to something unique and secure.

5. **Rate Limiting**: Consider adding rate limiting to prevent brute force attacks on the login page.

---

## 📱 Quick Commands

**Start Server:**
```bash
npm start
```

**Access Login:**
```bash
open http://localhost:4000/admin-login
```

**Check Session:**
Login and check browser cookies → Look for `connect.sid` cookie

**Force Logout:**
Clear browser cookies or click "Logout" button

---

## 🎉 You're All Set!

Your dashboard is now secure and protected with authentication. Only users with valid credentials can access the dashboard and view customer data.

**Login URL**: http://localhost:4000/admin-login
**Username**: admin
**Password**: admin@123

Happy managing! 🚀
