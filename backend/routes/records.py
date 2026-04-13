from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Record, Account, Category, User
from datetime import datetime

records_bp = Blueprint('records', __name__, url_prefix='/api/records')

@records_bp.route('', methods=['GET'])
@jwt_required()
def get_records():
    """Get all records for current user"""
    user_id = int(get_jwt_identity())
    
    # Get filter parameters
    category_id = request.args.get('category_id', type=int)
    account_id = request.args.get('account_id', type=int)
    month = request.args.get('month')  # YYYY-MM format
    
    query = Record.query.filter_by(user_id=user_id)
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    if account_id:
        query = query.filter_by(account_id=account_id)
    if month:
        # Filter by month
        query = query.filter(db.func.strftime('%Y-%m', Record.transaction_date) == month)
    
    records = query.order_by(Record.transaction_date.desc()).all()
    
    return jsonify([record.to_dict() for record in records]), 200

@records_bp.route('/<int:record_id>', methods=['GET'])
@jwt_required()
def get_record(record_id):
    """Get a specific record"""
    user_id = int(get_jwt_identity())
    record = Record.query.filter_by(id=record_id, user_id=user_id).first()
    
    if not record:
        return jsonify({'message': 'Record not found'}), 404
    
    return jsonify(record.to_dict()), 200

@records_bp.route('', methods=['POST'])
@jwt_required()
def create_record():
    """Create a new record"""
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    # Validate required fields
    required_fields = ['amount', 'type', 'account_id']
    if not all(k in data for k in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400
    
    try:
        # Verify user owns the account
        account = Account.query.filter_by(id=data['account_id'], user_id=user_id).first()
        if not account:
            return jsonify({'message': 'Account not found'}), 404
        
        # Verify category if provided
        category = None
        if data.get('category_id'):
            category = Category.query.filter_by(id=data['category_id'], user_id=user_id).first()
            if not category:
                return jsonify({'message': 'Category not found'}), 404
        
        # Create record
        date_str = data.get('date', datetime.utcnow().isoformat())
        # Handle ISO format with 'Z' suffix
        if date_str.endswith('Z'):
            date_str = date_str[:-1] + '+00:00'
        transaction_date = datetime.fromisoformat(date_str) if isinstance(date_str, str) else date_str
        
        record = Record(
            user_id=user_id,
            amount=float(data['amount']),
            record_type=data['type'],
            category_id=data.get('category_id'),
            account_id=data['account_id'],
            note=data.get('note', ''),
            transaction_date=transaction_date
        )
        
        # Update account balance
        if record.record_type == 'income':
            account.balance += record.amount
        elif record.record_type == 'expense':
            account.balance -= record.amount
        
        db.session.add(record)
        db.session.commit()
        
        return jsonify(record.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error creating record: {str(e)}'}), 500

@records_bp.route('/<int:record_id>', methods=['PUT'])
@jwt_required()
def update_record(record_id):
    """Update a record"""
    user_id = int(get_jwt_identity())
    record = Record.query.filter_by(id=record_id, user_id=user_id).first()
    
    if not record:
        return jsonify({'message': 'Record not found'}), 404
    
    data = request.get_json()
    
    try:
        if 'amount' in data:
            # Revert old balance change
            account = record.account
            if record.record_type == 'income':
                account.balance -= record.amount
            elif record.record_type == 'expense':
                account.balance += record.amount
            
            # Apply new amount
            record.amount = float(data['amount'])
            if record.record_type == 'income':
                account.balance += record.amount
            elif record.record_type == 'expense':
                account.balance -= record.amount
        
        if 'type' in data:
            record.record_type = data['type']
        if 'category_id' in data:
            record.category_id = data['category_id']
        if 'note' in data:
            record.note = data['note']
        if 'date' in data:
            date_str = data['date']
            if date_str.endswith('Z'):
                date_str = date_str[:-1] + '+00:00'
            record.transaction_date = datetime.fromisoformat(date_str)
        
        db.session.commit()
        
        return jsonify(record.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error updating record: {str(e)}'}), 500

@records_bp.route('/<int:record_id>', methods=['DELETE'])
@jwt_required()
def delete_record(record_id):
    """Delete a record"""
    user_id = int(get_jwt_identity())
    record = Record.query.filter_by(id=record_id, user_id=user_id).first()
    
    if not record:
        return jsonify({'message': 'Record not found'}), 404
    
    try:
        # Revert balance change
        account = record.account
        if record.record_type == 'income':
            account.balance -= record.amount
        elif record.record_type == 'expense':
            account.balance += record.amount
        
        db.session.delete(record)
        db.session.commit()
        
        return jsonify({'success': True}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error deleting record: {str(e)}'}), 500
