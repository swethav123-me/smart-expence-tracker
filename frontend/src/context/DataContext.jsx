import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  // State management
  const [records, setRecords] = useState([])
  const [accounts, setAccounts] = useState([])
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all data
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      setLoading(true)
      setError(null)

      const [recordsRes, accountsRes, categoriesRes, budgetsRes] = await Promise.all([
        api.get('/records'),
        api.get('/accounts'),
        api.get('/categories'),
        api.get('/budgets'),
      ])

      setRecords(recordsRes.data)
      setAccounts(accountsRes.data)
      setCategories(categoriesRes.data)
      setBudgets(budgetsRes.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Fetch data on auth
  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    } else {
      // Clear all data when user logs out
      setRecords([])
      setAccounts([])
      setCategories([])
      setBudgets([])
      setError(null)
    }
  }, [isAuthenticated, fetchData])

  // Record operations
  const addRecord = async (recordData) => {
    try {
      const response = await api.post('/records', recordData)
      // Create a new array to ensure React detects the state change
      setRecords(prevRecords => [response.data, ...prevRecords])
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }

  const updateRecord = async (id, recordData) => {
    try {
      const response = await api.put(`/records/${id}`, recordData)
      setRecords(records.map(r => r.id === id ? response.data : r))
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }

  const deleteRecord = async (id) => {
    try {
      await api.delete(`/records/${id}`)
      setRecords(records.filter(r => r.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }

  // Account operations
  const addAccount = async (accountData) => {
    try {
      const response = await api.post('/accounts', accountData)
      setAccounts([...accounts, response.data])
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }

  const updateAccount = async (id, accountData) => {
    try {
      const response = await api.put(`/accounts/${id}`, accountData)
      setAccounts(accounts.map(a => a.id === id ? response.data : a))
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }

  const deleteAccount = async (id) => {
    try {
      await api.delete(`/accounts/${id}`)
      setAccounts(accounts.filter(a => a.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }

  // Category operations
  const addCategory = async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData)
      setCategories([...categories, response.data])
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`)
      setCategories(categories.filter(c => c.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }

  // Budget operations
  const addBudget = async (budgetData) => {
    try {
      const response = await api.post('/budgets', budgetData)
      setBudgets([...budgets, response.data])
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }

  const updateBudget = async (id, budgetData) => {
    try {
      const response = await api.put(`/budgets/${id}`, budgetData)
      setBudgets(budgets.map(b => b.id === id ? response.data : b))
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }

  return (
    <DataContext.Provider value={{
      // State
      records,
      accounts,
      categories,
      budgets,
      loading,
      error,
      
      // Actions
      fetchData,
      addRecord,
      updateRecord,
      deleteRecord,
      addAccount,
      updateAccount,
      deleteAccount,
      addCategory,
      deleteCategory,
      addBudget,
      updateBudget,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}
