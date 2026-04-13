# QUICK START GUIDE - Smart Expense Tracker

## When You Return - Follow These Steps

### Step 1: Open TWO Terminal Windows

**Terminal 1 - Backend:**
```bash
cd C:\Users\sweth\SmartExpenseTrackerApp\backend
python app.py
```
Keep this running - don't close it!

**Terminal 2 - Frontend:**
```bash
cd C:\Users\sweth\SmartExpenseTrackerApp\frontend
npm run dev
```
Keep this running - don't close it!

---

### Step 2: Access the App

**On Your Computer:**
- Open browser: `http://localhost:5173`
- Press Ctrl+F5 (hard refresh)

**On Friend's Phone/Computer (Same WiFi):**
- Open browser: `http://172.18.220.229:5173`

---

### Step 3: Login

- **Email:** demo@example.com
- **Password:** demo123

Or create a new account

---

### Step 4: Test Features

✅ **Manual Entry:** Click orange + button → Manual → Add expense
✅ **Voice Entry:** Click orange + button → Voice → Say "spent 100 rupees for food"
✅ **Profile:** Click Profile → Edit name/email
✅ **Dashboard:** View charts and recent transactions
✅ **Records:** See all transactions in table

---

## Troubleshooting

### App Not Loading
- Check: Are both terminals running?
- Fix: Close and restart both terminals

### Can't Access from Phone
- Check: Is phone on same WiFi as computer?
- Check: Is IP 172.18.220.229 correct? (Run `ipconfig` in terminal)
- Fix: Update IP address if different

### Voice Not Working
- Check: F12 Console for errors
- Fix: Hard refresh (Ctrl+F5)
- Note: Only works in Chrome/Firefox

### Changes Not Showing
- Fix: Hard refresh (Ctrl+F5)
- Fix: Restart backend (Ctrl+C, then run again)

---

## Ports

- Backend: http://127.0.0.1:5000
- Frontend: http://localhost:5173

---

## Important Notes

⚠️ **KEEP BOTH TERMINALS OPEN** - App won't work if you close them
⚠️ **HARD REFRESH** (Ctrl+F5) after backend restarts
⚠️ **SAME NETWORK** required for phone/friend access

---

**You're all set! See you in a few hours! 🚀**
