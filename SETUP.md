# Smart Expense Tracker - Complete Setup Guide

This guide will walk you through setting up and running the Smart Expense Tracker application on your local machine.

## System Requirements

- **Node.js**: v16 or higher
- **Python**: 3.8 or higher
- **Git**: For version control
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (for Voice API support)

## Quick Start (5 minutes)

### 1. Clone/Navigate to Project

```bash
cd SmartExpenseTrackerApp
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

**Backend will run at**: `http://localhost:5000`

### 3. Frontend Setup (New terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run at**: `http://localhost:5173`

### 4. Login

Use demo credentials:
- **Email**: demo@example.com
- **Password**: demo123

---

## Detailed Setup

### Backend Configuration

1. **Environment Variables** (`backend/.env`)

```
FLASK_ENV=development
FLASK_APP=app.py
JWT_SECRET_KEY=your-secret-key-change-this-in-production
DATABASE_URL=sqlite:///database.db
```

2. **Database**

- SQLite database is created automatically on first run
- Located at `backend/database.db`
- Demo user and default categories are seeded automatically

3. **Verify Backend**

```bash
# Check if Flask is running
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-03-10T..."
}
```

### Frontend Configuration

1. **Environment Variables** (`frontend/.env.local`)

```
VITE_API_URL=http://localhost:5000/api
```

2. **Install Dependencies**

```bash
cd frontend
npm install
```

Expected output: Shows successful installation of ~350 packages

3. **Start Development Server**

```bash
npm run dev
```

Expected output: Shows Vite starting and local URL

---

## Feature Testing Checklist

### Authentication
- [ ] Login with demo credentials (demo@example.com / demo123)
- [ ] Register new account with validation
- [ ] Logout functionality works
- [ ] Protected routes redirect to login

### Dashboard
- [ ] Total balance displays correctly
- [ ] Income/expense totals calculate
- [ ] Recent transactions show
- [ ] Responsive on mobile/tablet

### Records Management
- [ ] Manual entry form opens and submits
- [ ] Voice entry captures speech
- [ ] Filters work (month, category, account)
- [ ] Records display in table format
- [ ] Delete record removes from table

### Voice Entry
- [ ] Microphone permission request appears
- [ ] Speech recognition captures text
- [ ] AI parser extracts amount correctly
- [ ] Category auto-detection works
- [ ] Confidence score displays
- [ ] Confirm saves to database

### Accounts
- [ ] Create new account
- [ ] Display all accounts with balance
- [ ] Edit account details
- [ ] Delete account (if no transactions)

### Categories
- [ ] Display default categories
- [ ] Create custom category
- [ ] Delete unused category
- [ ] Filter by category in records

### Budgets
- [ ] Set monthly budget for category
- [ ] Progress bar shows spent vs limit
- [ ] Color changes (green/yellow/red) based on spending
- [ ] Alert displays when over budget

### UI/UX
- [ ] Dark mode toggle works
- [ ] Sidebar navigation responsive
- [ ] Mobile menu works
- [ ] Floating action button accessible
- [ ] All icons and emojis display correctly

---

## Common Issues & Solutions

### Issue: "Cannot find module 'flask'"

**Solution**: Ensure virtual environment is activated
```bash
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### Issue: Port 5000 already in use

**Solution 1**: Kill existing process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

**Solution 2**: Change port in `backend/app.py`
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Changed from 5000
```

### Issue: Port 5173 already in use

**Solution**: Vite auto-selects next available port, or change in `frontend/vite.config.js`
```javascript
server: {
  port: 5174,  // Change this
  open: true
}
```

### Issue: CORS errors

**Solution**: Verify `VITE_API_URL` in `frontend/.env.local`
```
VITE_API_URL=http://localhost:5000/api
```

### Issue: Database corrupted

**Solution**: Delete and recreate
```bash
cd backend
rm database.db
python app.py
```

### Issue: Voice API not working

**Causes**:
- Browser doesn't support Web Speech API (Safari on iOS)
- Microphone permission denied
- HTTPS required in production

**Solution**: Try Chrome/Edge, grant microphone permission

---

## Project Structure

```
SmartExpenseTrackerApp/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Records.jsx
│   │   │   ├── Accounts.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Budgets.jsx
│   │   │   └── Profile.jsx
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── FloatingAddButton.jsx
│   │   ├── modals/
│   │   │   ├── AddRecordModal.jsx
│   │   │   └── VoiceEntryModal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── DataContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── voiceParser.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── .env.local
│
└── backend/
    ├── routes/
    │   ├── auth.py
    │   ├── records.py
    │   ├── accounts.py
    │   ├── categories.py
    │   └── budgets.py
    ├── app.py
    ├── models.py
    ├── config.py
    ├── requirements.txt
    ├── .env
    └── database.db (auto-created)
```

---

## API Endpoints Reference

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Records
- `GET /api/records` - List all records
- `POST /api/records` - Create record
- `PUT /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record

### Accounts
- `GET /api/accounts` - List accounts
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `DELETE /api/categories/:id` - Delete category

### Budgets
- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

---

## Testing with cURL

```bash
# Test health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'

# Get records (requires token)
curl http://localhost:5000/api/records \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Development Tips

### Hot Reload
- **Frontend**: Changes automatically reload in browser
- **Backend**: Restart `python app.py` for changes

### Database Inspection
```bash
# Install sqlite3 if not present
# Then inspect database
sqlite3 backend/database.db

# View tables
.tables

# View users
SELECT * FROM users;
```

### Debug Mode
- Frontend: Open browser DevTools (F12)
- Backend: Already in debug mode, shows errors in terminal

### Add Test Data

```python
# In backend Python terminal
from app import app, db
from models import User, Account, Category
with app.app_context():
    user = User.query.first()
    print(user.to_dict())
```

---

## Deployment Preparation

### Frontend Build
```bash
cd frontend
npm run build
# Creates optimized build in dist/ folder
```

### Backend Production
```bash
# Change in backend/.env
FLASK_ENV=production
# Use production WSGI server (gunicorn, etc.)
```

### Environment Variables for Production
- Use strong `JWT_SECRET_KEY`
- Change API URLs to production domain
- Use PostgreSQL instead of SQLite

---

## Next Steps

1. **Customize**: Modify colors in `frontend/tailwind.config.js`
2. **Extend**: Add more categories, expense types, or features
3. **Deploy**: Follow cloud provider's guidelines (Vercel, Railway, etc.)
4. **Backup**: Set up database backups for production

---

## Support

For issues:
1. Check this guide first
2. Look at browser console errors (F12)
3. Check backend terminal for Flask errors
4. Verify all dependencies are installed

---

**Happy Expense Tracking! 💰**
