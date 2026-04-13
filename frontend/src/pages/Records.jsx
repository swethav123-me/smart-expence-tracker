import React, { useState, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import FloatingAddButton from '../components/FloatingAddButton'
import AddRecordModal from '../modals/AddRecordModal'
import VoiceEntryModal from '../modals/VoiceEntryModal'
import { useData } from '../context/DataContext'
import { Trash2, ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

const Records = () => {
  const { records, accounts, categories, deleteRecord, loading } = useData()
  
  // Filter & Modal States
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const recordMonth = record.date.slice(0, 7)
      const monthMatch = !selectedMonth || recordMonth === selectedMonth
      const categoryMatch = !selectedCategory || record.category_id === parseInt(selectedCategory)
      const accountMatch = !selectedAccount || record.account_id === parseInt(selectedAccount)
      const searchMatch = !searchTerm || 
        record.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      return monthMatch && categoryMatch && accountMatch && searchMatch
    })
  }, [records, selectedMonth, selectedCategory, selectedAccount, searchTerm])

  // Calculate totals
  const totals = useMemo(() => {
    return {
      income: filteredRecords
        .filter(r => r.type === 'income')
        .reduce((sum, r) => sum + r.amount, 0),
      expense: filteredRecords
        .filter(r => r.type === 'expense')
        .reduce((sum, r) => sum + r.amount, 0),
    }
  }, [filteredRecords])

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Food': '🍔',
      'Transport': '🚗',
      'Shopping': '🛍️',
      'Bills': '📄',
      'Health': '⚕️',
      'Education': '📚',
      'Entertainment': '🎬',
      'Salary': '💼',
    }
    return icons[categoryName] || '📌'
  }

  return (
    <div className="flex h-screen bg-light dark:bg-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-dark dark:text-light mb-2">Transactions</h1>
              <p className="text-gray-500 dark:text-gray-400">Track all your income and expenses</p>
            </div>

            {/* Totals Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <ArrowUpRight className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">₹{totals.income.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <ArrowDownLeft className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Expense</p>
                  <p className="text-2xl font-bold text-red-600">₹{totals.expense.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">Filters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
                />

                {/* Month */}
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
                />

                {/* Category */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                  ))}
                </select>

                {/* Account */}
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
                >
                  <option value="">All Accounts</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.account_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Records List */}
            {loading ? (
              <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow">Loading transactions...</div>
            ) : filteredRecords.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-lg shadow">
                <DollarSign className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View (hidden on mobile) */}
                <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-light">Category</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-light">Amount</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-light">Account</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-light">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-light">Note</th>
                          <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-light">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.map(record => (
                          <tr key={record.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{getCategoryIcon(record.category)}</span>
                                <span className="font-medium text-dark dark:text-light">{record.category}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-semibold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {record.type === 'income' ? '+' : '-'}₹{record.amount.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{record.account}</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                              {format(new Date(record.date), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400 truncate">{record.note}</td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => deleteRecord(record.id)}
                                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View (shown only on mobile) */}
                <div className="md:hidden space-y-4">
                  {filteredRecords.map(record => (
                    <div key={record.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getCategoryIcon(record.category)}</span>
                          <div>
                            <p className="font-semibold text-dark dark:text-light">{record.category}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{record.account}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {format(new Date(record.date), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{record.note}</p>
                        </div>
                        <p className={`text-lg font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {record.type === 'income' ? '+' : '-'}₹{record.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
          </div>
        </main>
      </div>

      {/* Floating Add Button */}
      <FloatingAddButton onAddClick={() => setShowAddModal(true)} onVoiceClick={() => setShowVoiceModal(true)} />

      {/* Modals */}
      {showAddModal && <AddRecordModal onClose={() => setShowAddModal(false)} />}
      {showVoiceModal && <VoiceEntryModal onClose={() => setShowVoiceModal(false)} />}
    </div>
  )
}

export default Records
