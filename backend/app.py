"""
Smart Expense Tracker - Flask Backend
Main application file
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import datetime

from config import config
from models import db, User, Account, Category, Record, Budget

# Import blueprints
from routes.auth import auth_bp
from routes.records import records_bp
from routes.accounts import accounts_bp
from routes.categories import categories_bp
from routes.budgets import budgets_bp

def create_app(config_name=None):
    """Application factory"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(records_bp)
    app.register_blueprint(accounts_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(budgets_bp)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'message': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'message': 'Internal server error'}), 500
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    
    # Create database tables
    with app.app_context():
        db.create_all()
        
        # Create demo user if in development and doesn't exist
        if config_name == 'development':
            demo_user = User.query.filter_by(email='demo@example.com').first()
            if not demo_user:
                from werkzeug.security import generate_password_hash
                
                demo_user = User(
                    name='Demo User',
                    email='demo@example.com',
                    password_hash=generate_password_hash('demo123')
                )
                
                db.session.add(demo_user)
                db.session.commit()
                
                # Create default account
                account = Account(
                    user_id=demo_user.id,
                    account_name='Cash',
                    balance=5000
                )
                db.session.add(account)
                
                # Create default categories
                categories = [
                    ('Food', 'expense'),
                    ('Transport', 'expense'),
                    ('Shopping', 'expense'),
                    ('Bills', 'expense'),
                    ('Health', 'expense'),
                    ('Education', 'expense'),
                    ('Entertainment', 'expense'),
                    ('Salary', 'income'),
                ]
                
                for name, cat_type in categories:
                    cat = Category(
                        user_id=demo_user.id,
                        category_name=name,
                        category_type=cat_type
                    )
                    db.session.add(cat)
                
                db.session.commit()
    
    return app

    # Create app instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
