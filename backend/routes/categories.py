from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Category, User

categories_bp = Blueprint('categories', __name__, url_prefix='/api/categories')

DEFAULT_CATEGORIES = [
    ('Food', 'expense'),
    ('Transport', 'expense'),
    ('Shopping', 'expense'),
    ('Bills', 'expense'),
    ('Health', 'expense'),
    ('Education', 'expense'),
    ('Entertainment', 'expense'),
    ('Office Supplies', 'expense'),
    ('Salary', 'income'),
]

@categories_bp.route('', methods=['GET'])
@jwt_required()
def get_categories():
    """Get all categories for current user"""
    user_id = int(get_jwt_identity())
    categories = Category.query.filter_by(user_id=user_id).all()
    return jsonify([category.to_dict() for category in categories]), 200

@categories_bp.route('/<int:category_id>', methods=['GET'])
@jwt_required()
def get_category(category_id):
    """Get a specific category"""
    user_id = int(get_jwt_identity())
    category = Category.query.filter_by(id=category_id, user_id=user_id).first()
    
    if not category:
        return jsonify({'message': 'Category not found'}), 404
    
    return jsonify(category.to_dict()), 200

@categories_bp.route('', methods=['POST'])
@jwt_required()
def create_category():
    """Create a new category"""
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or 'category_name' not in data:
        return jsonify({'message': 'Category name is required'}), 400
    
    try:
        category = Category(
            user_id=user_id,
            category_name=data['category_name'],
            category_type=data.get('type', 'expense')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify(category.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error creating category: {str(e)}'}), 500

@categories_bp.route('/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    """Update a category"""
    user_id = int(get_jwt_identity())
    category = Category.query.filter_by(id=category_id, user_id=user_id).first()
    
    if not category:
        return jsonify({'message': 'Category not found'}), 404
    
    data = request.get_json()
    
    try:
        if 'category_name' in data:
            category.category_name = data['category_name']
        if 'type' in data:
            category.category_type = data['type']
        
        db.session.commit()
        
        return jsonify(category.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error updating category: {str(e)}'}), 500

@categories_bp.route('/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    """Delete a category"""
    user_id = int(get_jwt_identity())
    category = Category.query.filter_by(id=category_id, user_id=user_id).first()
    
    if not category:
        return jsonify({'message': 'Category not found'}), 404
    
    try:
        db.session.delete(category)
        db.session.commit()
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error deleting category: {str(e)}'}), 500

@categories_bp.route('/init-defaults', methods=['POST'])
@jwt_required()
def init_default_categories():
    """Initialize default categories for a new user or add missing ones"""
    user_id = int(get_jwt_identity())
    
    try:
        # Get existing categories for this user
        existing_categories = Category.query.filter_by(user_id=user_id).all()
        existing_names = {cat.category_name for cat in existing_categories}
        
        # Add any missing default categories
        added = False
        for name, cat_type in DEFAULT_CATEGORIES:
            if name not in existing_names:
                category = Category(
                    user_id=user_id,
                    category_name=name,
                    category_type=cat_type
                )
                db.session.add(category)
                added = True
        
        if added:
            db.session.commit()
        
        categories = Category.query.filter_by(user_id=user_id).all()
        return jsonify([cat.to_dict() for cat in categories]), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error initializing categories: {str(e)}'}), 500
