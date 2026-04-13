import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useData } from '../context/DataContext'
import { Plus, Trash2, Target } from 'lucide-react'

const Budgets = () => {
  const { budgets, categories, addBudget, updateBudget, deleteBudget, records } = useData()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ category_id: '', limit_amount: '', month: new Date().toISOString().slice(0, 7) })

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!formData.category_id || !formData.limit_amount) return

    await addBudget({
      category_id: parseInt(formData.category_id),
      limit_amount: parseFloat(formData.limit_amount),
      month: formData.month
    })
    setFormData({ category_id: '', limit_amount: '', month: new Date().toISOString().slice(0, 7) })
    setShowModal(false)
  }

  const getSpent = (categoryId, month) => {
    return records
      .filter(r => r.category_id === categoryId && r.type === 'expense' && r.date.slice(0, 7) === month)
      .reduce((sum, r) => sum + r.amount, 0)
  }

  return (
    <div className="flex h-screen bg-light dark:bg-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-dark dark:text-light">Budgets</h1>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Set and track monthly budgets for your categories</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium text-sm sm:text-base"
              >
                <Plus size={20} /> New Budget
              </button>
            </div>

            <div className="space-y-4">
              {budgets.map(budget => {
                const spent = getSpent(budget.category_id, budget.month)
                const remaining = budget.limit_amount - spent
                const percentage = (spent / budget.limit_amount) * 100
                const status = percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'

                return (
                  <div key={budget.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-dark dark:text-light">{budget.category}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{budget.month}</p>
                      </div>
                      <button
                        onClick={() => deleteBudget(budget.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">₹{spent.toFixed(2)} of ₹{budget.limit_amount.toFixed(2)}</span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${status}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className={`text-sm font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {remaining >= 0 ? `₹${remaining.toFixed(2)} remaining` : `₹${Math.abs(remaining).toFixed(2)} over budget`}
                    </p>
                  </div>
                )
              })}
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                  <h2 className="text-xl font-bold text-dark dark:text-light mb-4">New Budget</h2>
                  <form onSubmit={handleAdd} className="space-y-4">
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.filter(c => c.category_type === 'expense').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Budget limit"
                      value={formData.limit_amount}
                      onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light"
                      step="0.01"
                      required
                    />
                    <input
                      type="month"
                      value={formData.month}
                      onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light"
                      required
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-dark dark:text-light"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        Add
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

export default Budgets
