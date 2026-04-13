import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useData } from '../context/DataContext'

const AddRecordModal = ({ onClose }) => {
  const { addRecord, accounts, categories } = useData()
  
  // Wait for accounts to load
  if (!accounts || accounts.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
          <p className="text-center text-gray-500">Loading accounts...</p>
        </div>
      </div>
    )
  }
  
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    account_id: accounts[0]?.id?.toString() || '',
    category_id: categories[0]?.id?.toString() || '',
    note: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.amount || !formData.account_id) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        account_id: parseInt(formData.account_id),
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        date: new Date(formData.date).toISOString(),
      }
      
      console.log('Sending payload:', payload)
      const result = await addRecord(payload)
      console.log('Result:', result)

      if (result.success) {
        console.log('Record added successfully')
        onClose()
      } else {
        setError(result.error || 'Failed to add record')
        console.error('Error:', result.error)
      }
    } catch (err) {
      console.error('Exception:', err)
      setError('An error occurred: ' + err.message)
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-dark dark:text-light">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
            />
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">Account *</label>
            <select
              name="account_id"
              value={formData.account_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
            >
              <option value="">Select Account</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.account_name}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-dark dark:text-light mb-2">Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Add a note..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-light rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRecordModal
