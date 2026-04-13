import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useData } from '../context/DataContext'
import { Plus, Trash2, Edit2, Wallet } from 'lucide-react'

const Accounts = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useData()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ account_name: '', balance: '0' })

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!formData.account_name) return

    if (editingId) {
      await updateAccount(editingId, { account_name: formData.account_name, balance: parseFloat(formData.balance) })
      setEditingId(null)
    } else {
      await addAccount({ account_name: formData.account_name, balance: parseFloat(formData.balance) })
    }
    setFormData({ account_name: '', balance: '0' })
    setShowModal(false)
  }

  const handleEdit = (account) => {
    setEditingId(account.id)
    setFormData({ account_name: account.account_name, balance: account.balance.toString() })
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({ account_name: '', balance: '0' })
  }

  return (
    <div className="flex h-screen bg-light dark:bg-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-dark dark:text-light">Accounts</h1>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">Manage your financial accounts and balances</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium text-sm sm:text-base"
              >
                <Plus size={20} /> New Account
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map(account => (
                <div key={account.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Wallet className="text-primary" size={24} />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(account)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteAccount(account.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-dark dark:text-light">{account.account_name}</h3>
                  <p className="text-2xl font-bold text-primary mt-2">₹{account.balance.toFixed(2)}</p>
                </div>
              ))}
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
                  <h2 className="text-xl font-bold text-dark dark:text-light mb-4">
                    {editingId ? 'Edit Account' : 'New Account'}
                  </h2>
                  <form onSubmit={handleAdd} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Account name"
                      value={formData.account_name}
                      onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Balance"
                      value={formData.balance}
                      onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light"
                      step="0.01"
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-dark dark:text-light"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        Save
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

export default Accounts
