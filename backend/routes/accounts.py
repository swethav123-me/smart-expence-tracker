from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Account, User

accounts_bp = Blueprint('accounts', __name__, url_prefix='/api/accounts')

@accounts_bp.route('', methods=['GET'])
@jwt_required()
def get_accounts():
    """Get all accounts for current user"""
    user_id = int(get_jwt_identity())
    accounts = Account.query.filter_by(user_id=user_id).all()
    return jsonify([account.to_dict() for account in accounts]), 200

@accounts_bp.route('/<int:account_id>', methods=['GET'])
@jwt_required()
def get_account(account_id):
    """Get a specific account"""
    user_id = int(get_jwt_identity())
    account = Account.query.filter_by(id=account_id, user_id=user_id).first()
    
    if not account:
        return jsonify({'message': 'Account not found'}), 404
    
    return jsonify(account.to_dict()), 200

@accounts_bp.route('', methods=['POST'])
@jwt_required()
def create_account():
    """Create a new account"""
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or 'account_name' not in data:
        return jsonify({'message': 'Account name is required'}), 400
    
    try:
        account = Account(
            user_id=user_id,
            account_name=data['account_name'],
            balance=float(data.get('balance', 0))
        )
        
        db.session.add(account)
        db.session.commit()
        
        return jsonify(account.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error creating account: {str(e)}'}), 500

@accounts_bp.route('/<int:account_id>', methods=['PUT'])
@jwt_required()
def update_account(account_id):
    """Update an account"""
    user_id = int(get_jwt_identity())
    account = Account.query.filter_by(id=account_id, user_id=user_id).first()
    
    if not account:
        return jsonify({'message': 'Account not found'}), 404
    
    data = request.get_json()
    
    try:
        if 'account_name' in data:
            account.account_name = data['account_name']
        if 'balance' in data:
            account.balance = float(data['balance'])
        
        db.session.commit()
        
        return jsonify(account.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error updating account: {str(e)}'}), 500

@accounts_bp.route('/<int:account_id>', methods=['DELETE'])
@jwt_required()
def delete_account(account_id):
    """Delete an account"""
    user_id = int(get_jwt_identity())
    account = Account.query.filter_by(id=account_id, user_id=user_id).first()
    
    if not account:
        return jsonify({'message': 'Account not found'}), 404
    
    try:
        db.session.delete(account)
        db.session.commit()
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error deleting account: {str(e)}'}), 500
