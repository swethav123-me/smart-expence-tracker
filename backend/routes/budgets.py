from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Budget, Category, User

budgets_bp = Blueprint('budgets', __name__, url_prefix='/api/budgets')

@budgets_bp.route('', methods=['GET'])
@jwt_required()
def get_budgets():
    """Get all budgets for current user"""
    user_id = int(get_jwt_identity())
    month = request.args.get('month')
    
    query = Budget.query.filter_by(user_id=user_id)
    if month:
        query = query.filter_by(month=month)
    
    budgets = query.all()
    return jsonify([budget.to_dict() for budget in budgets]), 200

@budgets_bp.route('/<int:budget_id>', methods=['GET'])
@jwt_required()
def get_budget(budget_id):
    """Get a specific budget"""
    user_id = int(get_jwt_identity())
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
    
    if not budget:
        return jsonify({'message': 'Budget not found'}), 404
    
    return jsonify(budget.to_dict()), 200

@budgets_bp.route('', methods=['POST'])
@jwt_required()
def create_budget():
    """Create a new budget"""
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or not all(k in data for k in ['category_id', 'limit_amount', 'month']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        # Verify category exists
        category = Category.query.filter_by(id=data['category_id'], user_id=user_id).first()
        if not category:
            return jsonify({'message': 'Category not found'}), 404
        
        budget = Budget(
            user_id=user_id,
            category_id=data['category_id'],
            limit_amount=float(data['limit_amount']),
            month=data['month']
        )
        
        db.session.add(budget)
        db.session.commit()
        
        return jsonify(budget.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error creating budget: {str(e)}'}), 500

@budgets_bp.route('/<int:budget_id>', methods=['PUT'])
@jwt_required()
def update_budget(budget_id):
    """Update a budget"""
    user_id = int(get_jwt_identity())
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
    
    if not budget:
        return jsonify({'message': 'Budget not found'}), 404
    
    data = request.get_json()
    
    try:
        if 'limit_amount' in data:
            budget.limit_amount = float(data['limit_amount'])
        if 'month' in data:
            budget.month = data['month']
        
        db.session.commit()
        
        return jsonify(budget.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error updating budget: {str(e)}'}), 500

@budgets_bp.route('/<int:budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    """Delete a budget"""
    user_id = int(get_jwt_identity())
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
    
    if not budget:
        return jsonify({'message': 'Budget not found'}), 404
    
    try:
        db.session.delete(budget)
        db.session.commit()
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error deleting budget: {str(e)}'}), 500
