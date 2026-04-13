# Smart Expense Tracker

A modern, full-stack expense tracking application with voice entry, AI auto-categorization, and multi-user support.

## Features

- **User Authentication**: Secure JWT-based authentication
- **Multi-User Support**: Each user has isolated data
- **Expense Tracking**: Manual and voice entry
- **AI Auto-Categorization**: Intelligent expense categorization using NLP
- **Voice Entry**: Web Speech API integration for hands-free expense logging
- **Dashboard**: Real-time financial overview with charts
- **Budget Management**: Set and track monthly budgets
- **Account Management**: Multiple account support (Cash, Savings, Credit Card, etc.)
- **Category Management**: Default and custom categories
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Built-in dark mode support

## Tech Stack

### Frontend
- React.js 18+
- Vite (Build tool)
- React Router (Navigation)
- Tailwind CSS (Styling)
- Chart.js (Analytics)
- Web Speech API (Voice)
- Axios (HTTP Client)

### Backend
- Python Flask
- SQLAlchemy (ORM)
- SQLite (Database)
- Flask-JWT-Extended (Authentication)
- Flask-CORS (Cross-Origin)

## Project Structure

```
smart-expense-tracker/
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (Auth, Data)
│   │   ├── services/        # API & utility services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── routes/
    │   ├── auth.py          # Authentication
    │   ├── records.py       # Transaction management
    │   ├── accounts.py      # Account management
    │   ├── categories.py    # Category management
    │   └── budgets.py       # Budget management
    ├── app.py               # Main application
    ├── models.py            # Database models
    ├── config.py            # Configuration
    ├── requirements.txt
    └── database.db          # SQLite database
```

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Backend runs at: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Demo Credentials

**Email**: demo@example.com  
**Password**: demo123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Records (Transactions)
- `GET /api/records` - Get all records
- `POST /api/records` - Create record
- `PUT /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `POST /api/categories/init-defaults` - Initialize defaults

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

## Key Features Guide

### Voice Entry
1. Click "+" button → "Voice Entry"
2. Speak: "I spent 250 rupees for food"
3. AI auto-categorizes
4. Review and confirm

### Manual Entry
1. Click "+" button → "Manual Entry"
2. Fill in form details
3. Click "Add Record"

### Dashboard
- View total balance, income, expenses
- See recent transactions
- Monitor spending by category

## Development Notes

- **Environment**: Requires Python 3.8+ and Node.js 16+
- **Database**: SQLite (auto-created)
- **Authentication**: JWT with token refresh
- **CORS**: Enabled for development

## Version

1.0.0 - Complete feature set with authentication, multi-user support, voice entry, and analytics
