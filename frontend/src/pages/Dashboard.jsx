import React, { useState, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import FloatingAddButton from '../components/FloatingAddButton'
import AddRecordModal from '../modals/AddRecordModal'
import VoiceEntryModal from '../modals/VoiceEntryModal'
import { TrendingUp, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useData } from '../context/DataContext'
import { Doughnut } from 'react-chartjs-2'
import Chart from 'chart.js/auto'

const Dashboard = () => {
  const { records, accounts, categories, loading } = useData()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showVoiceModal, setShowVoiceModal] = useState(false)

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
  const totalIncome = records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + (r.amount || 0), 0)
  const totalExpense = records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + (r.amount || 0), 0)

  // Calculate category-wise expenses
  const categoryExpenses = useMemo(() => {
    const expenseRecords = records.filter(r => r.type === 'expense')
    const byCategory = {}
    
    expenseRecords.forEach(record => {
      const cat = record.category || 'Uncategorized'
      byCategory[cat] = (byCategory[cat] || 0) + record.amount
    })
    
    return byCategory
  }, [records])

  // Chart data
  const chartData = useMemo(() => {
    const labels = Object.keys(categoryExpenses)
    const data = Object.values(categoryExpenses)
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ]
    
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: '#fff',
        borderWidth: 2
      }]
    }
  }, [categoryExpenses])

  return (
    <div className="flex h-screen bg-light dark:bg-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-8">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Balance */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Balance</p>
                    <p className="text-3xl font-bold text-dark dark:text-light">₹{totalBalance.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Wallet className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>

              {/* Total Income */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Income</p>
                    <p className="text-3xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ArrowUpRight className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Total Expense */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Expense</p>
                    <p className="text-3xl font-bold text-red-600">₹{totalExpense.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <ArrowDownLeft className="w-8 h-8 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-dark dark:text-light mb-4">Expense Overview by Category</h2>
              {Object.keys(categoryExpenses).length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">No expenses yet. Add your first expense!</p>
                </div>
               ) : (
                 <div className="flex justify-center items-center h-64">
                   <Doughnut 
                     key={JSON.stringify(chartData.labels)} 
                     data={chartData} 
                     options={{
                       responsive: true,
                       maintainAspectRatio: false,
                       plugins: {
                         legend: {
                           position: 'bottom'
                         }
                       }
                     }} 
                   />
                 </div>
               )}
            </div>

            {/* Recent Transactions */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-dark dark:text-light mb-4">Recent Transactions</h2>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : records.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No transactions yet</p>
              ) : (
                <div className="space-y-3">
                  {records.slice(0, 5).map(record => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-dark dark:text-light">{record.category}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{record.note}</p>
                      </div>
                      <p className={`font-semibold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {record.type === 'income' ? '+' : '-'}₹{record.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
 
 export default Dashboard
