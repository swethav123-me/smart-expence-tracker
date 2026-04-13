"""
Routes package initialization
"""

from .auth import auth_bp
from .records import records_bp
from .accounts import accounts_bp
from .categories import categories_bp
from .budgets import budgets_bp

__all__ = ['auth_bp', 'records_bp', 'accounts_bp', 'categories_bp', 'budgets_bp']
