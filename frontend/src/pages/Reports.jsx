import React, { useState, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useData } from '../context/DataContext'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { format } from 'date-fns'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Reports = () => {
  const { records } = useData()

  // Report state
  const [reportType, setReportType] = useState('monthly')
  const [selectedReportMonth, setSelectedReportMonth] = useState(new Date().toISOString().slice(0, 7))
  const [selectedReportYear, setSelectedReportYear] = useState(new Date().getFullYear().toString())

  // Get unique months and years from records
  const availableMonths = useMemo(() => {
    const months = [...new Set(records.map(r => r.date.slice(0, 7)))].sort().reverse()
    return months.length > 0 ? months : [new Date().toISOString().slice(0, 7)]
  }, [records])

  const availableYears = useMemo(() => {
    const years = [...new Set(records.map(r => r.date.slice(0, 4)))].sort().reverse()
    return years.length > 0 ? years : [new Date().getFullYear().toString()]
  }, [records])

  // Helper functions
  const getPreviousMonth = (monthStr) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(year, parseInt(month) - 1)
    date.setMonth(date.getMonth() - 1)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }

  const getPreviousYear = (yearStr) => {
    return (parseInt(yearStr) - 1).toString()
  }

  // Get records for report period
  const getReportRecords = () => {
    if (reportType === 'monthly') {
      return records.filter(r => r.date.slice(0, 7) === selectedReportMonth)
    } else {
      return records.filter(r => r.date.slice(0, 4) === selectedReportYear)
    }
  }

  // Calculate report data
  const reportData = useMemo(() => {
    const reportRecords = getReportRecords()
    const totalExpense = reportRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0)
    const totalIncome = reportRecords
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0)

    // Previous period data
    let prevRecords = []
    if (reportType === 'monthly') {
      const prevMonth = getPreviousMonth(selectedReportMonth)
      prevRecords = records.filter(r => r.date.slice(0, 7) === prevMonth)
    } else {
      const prevYear = getPreviousYear(selectedReportYear)
      prevRecords = records.filter(r => r.date.slice(0, 4) === prevYear)
    }

    const prevExpense = prevRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0)

    // Comparison
    const expenseDifference = totalExpense - prevExpense
    const expensePercentChange = prevExpense === 0 ? 0 : ((expenseDifference / prevExpense) * 100).toFixed(1)
    const isExpenseIncrease = expenseDifference > 0

    // Category breakdown
    const categoryExpenses = {}
    const categoryPrevExpenses = {}

    reportRecords.filter(r => r.type === 'expense').forEach(r => {
      const cat = r.category || 'Uncategorized'
      categoryExpenses[cat] = (categoryExpenses[cat] || 0) + r.amount
    })

    prevRecords.filter(r => r.type === 'expense').forEach(r => {
      const cat = r.category || 'Uncategorized'
      categoryPrevExpenses[cat] = (categoryPrevExpenses[cat] || 0) + r.amount
    })

    return {
      totalExpense,
      totalIncome,
      prevExpense,
      expenseDifference: Math.abs(expenseDifference),
      expensePercentChange: Math.abs(expensePercentChange),
      isExpenseIncrease,
      categoryExpenses,
      categoryPrevExpenses,
    }
  }, [records, reportType, selectedReportMonth, selectedReportYear])

  // Generate chart data
  const generateChartData = () => {
    if (reportType === 'monthly') {
      // Daily breakdown
      const daysInMonth = new Date(selectedReportMonth.split('-')[0], selectedReportMonth.split('-')[1], 0).getDate()
      const dailyExpenses = Array(daysInMonth).fill(0)
      const days = []

      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i.toString())
      }

      const reportRecords = getReportRecords()
      reportRecords.filter(r => r.type === 'expense').forEach(r => {
        const day = new Date(r.date).getDate()
        dailyExpenses[day - 1] += r.amount
      })

      return {
        labels: days,
        datasets: [{
          label: 'Daily Expenses',
          data: dailyExpenses,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        }]
      }
    } else {
      // Monthly breakdown for the year
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthlyExpenses = Array(12).fill(0)

      const reportRecords = getReportRecords()
      reportRecords.filter(r => r.type === 'expense').forEach(r => {
        const month = new Date(r.date).getMonth()
        monthlyExpenses[month] += r.amount
      })

      return {
        labels: months,
        datasets: [{
          label: 'Monthly Expenses',
          data: monthlyExpenses,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        }]
      }
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: '#6B7280' } },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context) => `₹${context.parsed.y.toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${(value/1000).toFixed(1)}k`
        }
      }
    }
  }

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
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 size={32} className="text-primary" />
                <h1 className="text-3xl font-bold text-dark dark:text-light">Reports</h1>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Analyze your monthly and yearly spending patterns</p>
            </div>

            {/* Report Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Report Type Toggle */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="monthly"
                      checked={reportType === 'monthly'}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-dark dark:text-light font-medium">Monthly Report</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="yearly"
                      checked={reportType === 'yearly'}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-dark dark:text-light font-medium">Yearly Report</span>
                  </label>
                </div>

                {/* Period Selector */}
                {reportType === 'monthly' ? (
                  <select
                    value={selectedReportMonth}
                    onChange={(e) => setSelectedReportMonth(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
                  >
                    {availableMonths.map(month => (
                      <option key={month} value={month}>
                        {format(new Date(month + '-01'), 'MMMM yyyy')}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={selectedReportYear}
                    onChange={(e) => setSelectedReportYear(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Expense */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/40 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Expense</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{reportData.totalExpense.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
              </div>

              {/* Total Income */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{reportData.totalIncome.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
              </div>

              {/* vs Previous Period */}
              <div className={`rounded-lg p-4 border ${reportData.isExpenseIncrease ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}`}>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">vs Previous {reportType === 'monthly' ? 'Month' : 'Year'}</p>
                <div className="flex items-center gap-2">
                  {reportData.isExpenseIncrease ? (
                    <TrendingUp size={20} className="text-orange-600 dark:text-orange-400" />
                  ) : (
                    <TrendingDown size={20} className="text-green-600 dark:text-green-400" />
                  )}
                  <span className={`text-2xl font-bold ${reportData.isExpenseIncrease ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                    {reportData.isExpenseIncrease ? '+' : '-'}₹{reportData.expenseDifference.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                  </span>
                </div>
              </div>

              {/* Trend Percentage */}
              <div className={`rounded-lg p-4 border ${reportData.isExpenseIncrease ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}`}>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Trend</p>
                <p className={`text-2xl font-bold ${reportData.isExpenseIncrease ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {reportData.isExpenseIncrease ? '↑' : '↓'} {reportData.expensePercentChange}%
                </p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
                {reportType === 'monthly' ? 'Daily Breakdown' : 'Monthly Breakdown'}
              </h3>
              <div className="w-full h-[300px] md:h-[350px] lg:h-[400px]">
                <Bar 
                  data={generateChartData()} 
                  options={chartOptions}
                  key={`${reportType}-${reportType === 'monthly' ? selectedReportMonth : selectedReportYear}`}
                />
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">Category Breakdown</h3>
              
              {/* Desktop Table View (hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-dark dark:text-light">Category</th>
                      <th className="text-right px-4 py-3 font-semibold text-dark dark:text-light">Amount</th>
                      <th className="text-right px-4 py-3 font-semibold text-dark dark:text-light">% of Total</th>
                      <th className="text-right px-4 py-3 font-semibold text-dark dark:text-light">vs Previous</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.categoryExpenses).length > 0 ? (
                      Object.entries(reportData.categoryExpenses)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount]) => {
                          const percentage = ((amount / reportData.totalExpense) * 100).toFixed(1)
                          const prevAmount = reportData.categoryPrevExpenses[category] || 0
                          const diff = amount - prevAmount
                          const isIncrease = diff > 0

                          return (
                            <tr key={category} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                              <td className="px-4 py-3 text-dark dark:text-light font-medium">
                                <span className="mr-2">{getCategoryIcon(category)}</span>
                                {category}
                              </td>
                              <td className="px-4 py-3 text-right text-dark dark:text-light font-semibold">
                                ₹{amount.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                                {percentage}%
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className={isIncrease ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}>
                                  {isIncrease ? '↑' : '↓'} {Math.abs(diff).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                                </span>
                              </td>
                            </tr>
                          )
                        })
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                          No expenses in this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (shown only on mobile) */}
              <div className="md:hidden space-y-3">
                {Object.entries(reportData.categoryExpenses).length > 0 ? (
                  Object.entries(reportData.categoryExpenses)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, amount]) => {
                      const percentage = ((amount / reportData.totalExpense) * 100).toFixed(1)
                      const prevAmount = reportData.categoryPrevExpenses[category] || 0
                      const diff = amount - prevAmount
                      const isIncrease = diff > 0

                      return (
                        <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{getCategoryIcon(category)}</span>
                              <span className="font-medium text-dark dark:text-light">{category}</span>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1 font-semibold">
                              {percentage}%
                            </span>
                          </div>
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                              <p className="text-lg font-bold text-dark dark:text-light">
                                ₹{amount.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">vs Previous</p>
                              <p className={`font-bold text-sm ${isIncrease ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                                {isIncrease ? '↑' : '↓'} ₹{Math.abs(diff).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                ) : (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    No expenses in this period
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Reports
