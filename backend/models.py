from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

db = SQLAlchemy()

class User(db.Model):
    """User model"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    accounts = db.relationship('Account', backref='user', lazy=True, cascade='all, delete-orphan')
    categories = db.relationship('Category', backref='user', lazy=True, cascade='all, delete-orphan')
    records = db.relationship('Record', backref='user', lazy=True, cascade='all, delete-orphan')
    budgets = db.relationship('Budget', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

class Account(db.Model):
    """User accounts (Cash, Savings, Credit Card, etc.)"""
    __tablename__ = 'accounts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    account_name = db.Column(db.String(120), nullable=False)
    balance = db.Column(db.Float, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    records = db.relationship('Record', backref='account', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'account_name': self.account_name,
            'balance': self.balance,
            'created_at': self.created_at.isoformat()
        }

class Category(db.Model):
    """Expense categories"""
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    category_name = db.Column(db.String(120), nullable=False)
    category_type = db.Column(db.String(20), default='expense')  # income or expense
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    records = db.relationship('Record', backref='category', lazy=True)
    budgets = db.relationship('Budget', backref='category', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_name': self.category_name,
            'category_type': self.category_type,
            'created_at': self.created_at.isoformat()
        }

class Record(db.Model):
    """Transaction records"""
    __tablename__ = 'records'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    amount = db.Column(db.Float, nullable=False)
    record_type = db.Column(db.String(20), nullable=False)  # income, expense, transfer
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    note = db.Column(db.Text, default='')
    transaction_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': self.amount,
            'type': self.record_type,
            'category': self.category.category_name if self.category else 'Uncategorized',
            'category_id': self.category_id,
            'account': self.account.account_name if self.account else '',
            'account_id': self.account_id,
            'note': self.note,
            'date': self.transaction_date.isoformat(),
            'created_at': self.created_at.isoformat()
        }

class Budget(db.Model):
    """Monthly budgets"""
    __tablename__ = 'budgets'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    limit_amount = db.Column(db.Float, nullable=False)
    month = db.Column(db.String(20), nullable=False)  # YYYY-MM format
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_id': self.category_id,
            'category': self.category.category_name,
            'limit_amount': self.limit_amount,
            'month': self.month,
            'created_at': self.created_at.isoformat()
        }
