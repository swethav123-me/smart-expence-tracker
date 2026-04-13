# Quick Reference & FAQs - Smart Expense Tracker

## 🚀 Quick Start (Copy-Paste)

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows: use this
source venv/bin/activate  # macOS/Linux: use this
pip install -r requirements.txt
python app.py
```
✅ Backend runs at: `http://localhost:5000`

### Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend runs at: `http://localhost:5173`

### Login
- Email: `demo@example.com`
- Password: `demo123`

---

## ❓ FAQs

### Q: How do I add a new expense?
**A**: Click the **orange "+" button** → Select "Manual Entry" or "Voice" → Fill form → Click "Add Record"

### Q: Can I speak to add expenses?
**A**: Yes! Click **"+" → "Voice"** → Speak naturally (e.g., "I spent 250 rupees for food") → Confirm

### Q: How do I set a budget?
**A**: Go to **Budgets page** → Click "New Budget" → Select category → Enter limit → Select month → Save

### Q: What if my account balance is wrong?
**A**: Go to **Accounts** → Click Edit → Adjust balance → Save

### Q: Can I use this on mobile?
**A**: Yes! It's fully responsive. Works on any modern browser.

### Q: How do I backup my data?
**A**: For local dev: Copy `backend/database.db`
For production: Use cloud provider's backup features

### Q: Can I add multiple users?
**A**: Yes! Each user has isolated data. Click **Register** to create new account.

### Q: Is my data secure?
**A**: Yes! Passwords are hashed, API uses JWT tokens, data is user-isolated

### Q: Can I deploy this?
**A**: Yes! See DEPLOYMENT.md for step-by-step guide

### Q: Can I change the colors?
**A**: Yes! Edit `frontend/tailwind.config.js` → Change colors in theme section

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Issue: Port 5000 already in use
# Solution 1: Kill process using port
netstat -ano | findstr :5000  # Find process
taskkill /PID <number> /F     # Kill it

# Solution 2: Use different port (change in app.py)
app.run(port=5001)
```

### Frontend won't load
```bash
# Issue: Cannot connect to API
# Check: frontend/.env.local has correct API_URL
VITE_API_URL=http://localhost:5000/api

# Issue: Dependencies missing
rm -rf node_modules package-lock.json
npm install
```

### Voice not working
```bash
# Issue: Browser doesn't support Web Speech API
# Solution: Use Chrome or Edge
# Grant microphone permission when prompted
```

### Database corrupted
```bash
cd backend
rm database.db  # Delete corrupt database
python app.py   # Recreate and reseed
```

### Authentication fails
```bash
# Clear browser localStorage
# F12 → Application → Local Storage → Clear All
# Login again
```

### CORS error
```bash
# Verify API_URL in frontend/.env.local matches running backend
VITE_API_URL=http://localhost:5000/api
```

---

## 📚 File Quick Reference

### Important Frontend Files
| File | Purpose |
|------|---------|
| `frontend/src/App.jsx` | Main router, page setup |
| `frontend/src/context/AuthContext.jsx` | Login/logout logic |
| `frontend/src/context/DataContext.jsx` | Global data management |
| `frontend/src/services/voiceParser.js` | AI parsing logic |
| `frontend/src/pages/Records.jsx` | Main expense list view |
| `frontend/tailwind.config.js` | Color & style config |

### Important Backend Files
| File | Purpose |
|------|---------|
| `backend/app.py` | Flask server, routes setup |
| `backend/models.py` | Database models/schema |
| `backend/routes/auth.py` | Login/register endpoints |
| `backend/routes/records.py` | Transaction CRUD |
| `backend/config.py` | Configuration, JWT settings |

---

## 💡 Pro Tips

### 1. Enable Dark Mode
Click the moon icon in top navbar

### 2. Filter by Month
Go to Records → Use month picker to filter by date range

### 3. Search Transactions
Go to Records → Type in search box to find by note or category

### 4. Voice Entry Tips
- Speak clearly: "I spent two-hundred-fifty rupees for food"
- System auto-detects: amount, category, type
- Review before confirming

### 5. Budget Alerts
- Green = Under budget (✅)
- Yellow = Approaching limit (⚠️)
- Red = Over budget (❌)

### 6. Multiple Accounts
- Create accounts for: Cash, Savings, Credit Card
- Each transaction updates that account's balance

### 7. Custom Categories
- Go to Categories → Add custom category
- Use in manual/voice entry

---

## 🔗 API Testing with cURL

```bash
# Test backend is running
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'

# Use token in requests (replace YOUR_TOKEN)
curl http://localhost:5000/api/records \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Common Use Cases

### Use Case 1: Track Daily Expenses
1. Click **"+" → "Voice"**
2. Speak each expense (breakfast, commute, lunch, etc.)
3. Confirm each
4. View all in **Records page**

### Use Case 2: Monthly Budget
1. Go to **Budgets**
2. Set limit for each category (Food: 5000, Transport: 2000, etc.)
3. Check progress bar as month goes on
4. Adjust if needed

### Use Case 3: Manage Multiple Accounts
1. Go to **Accounts**
2. Create: Cash, Savings, Credit Card
3. When adding record, select which account
4. Balances auto-update

### Use Case 4: Share Access
1. Register second user account
2. Each user sees only their data
3. Both can use simultaneously

---

## 📊 Data Insights

### Available in Dashboard
- ✅ Total Balance (all accounts)
- ✅ Total Income (this month)
- ✅ Total Expense (this month)
- ✅ Recent transactions (last 5)

### Available in Records
- ✅ Filter by month
- ✅ Filter by category
- ✅ Filter by account
- ✅ Search by note

### Available in Budgets
- ✅ Spent vs limit per category
- ✅ Remaining amount
- ✅ % of budget used
- ✅ Visual progress bars

---

## 🚀 Performance Tips

1. **Faster Voice Entry**
   - Speak clearly and naturally
   - Use simple phrases ("spent 250 for food")

2. **Efficient Filtering**
   - Use month picker (faster than scrolling)
   - Combine filters (month + category)

3. **Organization**
   - Keep default categories organized
   - Don't create too many custom categories

4. **Budget Management**
   - Set budgets for your 5-6 main categories
   - Review monthly

---

## 🔄 Update Local Code

```bash
# After making changes
# Frontend
ctrl+c  # Stop dev server
npm run dev  # Restart (hot reload)

# Backend
ctrl+c  # Stop server
python app.py  # Restart
```

---

## 📝 Notes

- **Demo Account**: Fresh data resets daily (for demo purposes)
- **Real Data**: Create account with your email to keep data
- **Mobile**: Best experience on Chrome/Edge (Voice API)
- **Offline**: Requires internet (API calls needed)

---

## 🎓 Learning Resources

### React Concepts Used
- ✅ Hooks (useState, useContext, useEffect)
- ✅ Context API (global state)
- ✅ Protected routes
- ✅ Form handling
- ✅ Conditional rendering

### Backend Concepts Used
- ✅ REST API design
- ✅ JWT authentication
- ✅ SQLAlchemy ORM
- ✅ Database relationships (1-to-many)
- ✅ Error handling

### Deployment Concepts Used
- ✅ Environment variables
- ✅ Database migration (SQLite → PostgreSQL)
- ✅ Static build optimization
- ✅ CORS configuration

---

## 📞 Support

1. **Check SETUP.md** for detailed setup
2. **Check DEPLOYMENT.md** for production
3. **Review code comments** in source files
4. **Use browser DevTools** (F12) for frontend debugging
5. **Check terminal output** for backend errors

---

**Last Updated**: March 2026
**Version**: 1.0.0 - Production Ready ✅
