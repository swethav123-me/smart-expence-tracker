import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useData } from '../context/DataContext'
import { Plus, Trash2, Tag } from 'lucide-react'

const Categories = () => {
  const { categories, addCategory, deleteCategory } = useData()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ category_name: '', type: 'expense' })

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!formData.category_name) return

    await addCategory(formData)
    setFormData({ category_name: '', type: 'expense' })
    setShowModal(false)
  }

  const expenseCategories = categories.filter(c => c.category_type === 'expense')
  const incomeCategories = categories.filter(c => c.category_type === 'income')

  return (
    <div className="flex h-screen bg-light dark:bg-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header Section - Mobile Optimized */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-dark dark:text-light">Categories</h1>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Manage your expense and income categories</p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium text-sm sm:text-base"
                >
                  <Plus size={20} /> New Category
                </button>
              </div>
            </div>

            {/* Expense Categories Section */}
            <div className="mb-8 sm:mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📤</span>
                <h2 className="text-xl sm:text-2xl font-bold text-dark dark:text-light">Expense Categories</h2>
                <span className="ml-auto text-sm font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full">
                  {expenseCategories.length}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Track your spending across different expense categories</p>
              
              {expenseCategories.length === 0 ? (
                <div className="py-8 sm:py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <Tag size={40} className="text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No expense categories yet</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-3 text-sm text-primary hover:underline font-medium"
                  >
                    Create your first category
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {expenseCategories.map(cat => (
                    <div 
                      key={cat.id} 
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg flex-shrink-0">
                          <Tag className="text-red-600 dark:text-red-400" size={18} />
                        </div>
                        <span className="font-medium text-dark dark:text-light truncate text-sm sm:text-base">{cat.category_name}</span>
                      </div>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex-shrink-0"
                        title="Delete category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Income Categories Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📥</span>
                <h2 className="text-xl sm:text-2xl font-bold text-dark dark:text-light">Income Categories</h2>
                <span className="ml-auto text-sm font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                  {incomeCategories.length}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Organize your different income sources</p>
              
              {incomeCategories.length === 0 ? (
                <div className="py-8 sm:py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <Tag size={40} className="text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No income categories yet</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-3 text-sm text-primary hover:underline font-medium"
                  >
                    Create your first income category
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {incomeCategories.map(cat => (
                    <div 
                      key={cat.id} 
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                          <Tag className="text-green-600 dark:text-green-400" size={18} />
                        </div>
                        <span className="font-medium text-dark dark:text-light truncate text-sm sm:text-base">{cat.category_name}</span>
                      </div>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex-shrink-0"
                        title="Delete category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Category Modal - Mobile Optimized */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-5 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-dark dark:text-light mb-4">New Category</h2>
                  <form onSubmit={handleAdd} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Groceries, Bonus, etc."
                        value={formData.category_name}
                        onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                        required
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                      >
                        <option value="expense">📤 Expense</option>
                        <option value="income">📥 Income</option>
                      </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-dark dark:text-light hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium text-sm sm:text-base"
                      >
                        Add Category
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Categories
