import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { LogOut, Settings, HelpCircle, User, Edit2, Save, X, Camera } from 'lucide-react'
import api from '../services/api'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    if (!formData.name.trim()) {
      setError('Name is required')
      setLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required')
      setLoading(false)
      return
    }

    try {
      const response = await api.put('/auth/me', {
        name: formData.name,
        email: formData.email,
      })

      // Update localStorage with new user info
      localStorage.setItem('user', JSON.stringify(response.data))
      
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
      
      // Refresh page to update user data
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    })
    setError('')
    setSuccess('')
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-light dark:bg-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-dark dark:text-light mb-8">Profile Settings</h1>

            {/* User Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                  {/* Editable Profile Picture */}
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 text-white flex items-center justify-center text-3xl font-bold">
                      {formData.name?.charAt(0).toUpperCase()}
                    </div>
                    {isEditing && (
                      <button className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Camera size={24} className="text-white" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-light">{formData.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{formData.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
                >
                  <Edit2 size={20} className="text-primary" />
                </button>
              </div>

              {/* Messages */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {isEditing ? (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-light focus:outline-none focus:border-primary"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      <Save size={18} />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-light rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition">
                    <div className="flex items-center gap-3">
                      <User className="text-primary" size={20} />
                      <span className="font-medium text-dark dark:text-light">Account Information</span>
                    </div>
                    <span className="text-gray-500">›</span>
                  </div>

                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition">
                    <div className="flex items-center gap-3">
                      <Settings className="text-primary" size={20} />
                      <span className="font-medium text-dark dark:text-light">Settings</span>
                    </div>
                    <span className="text-gray-500">›</span>
                  </div>

                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="text-primary" size={20} />
                      <span className="font-medium text-dark dark:text-light">Help & Support</span>
                    </div>
                    <span className="text-gray-500">›</span>
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              <LogOut size={20} />
              Logout
            </button>

            {/* App Info */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Smart Expense Tracker</strong> v1.0.0
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-200 mt-2">
                Your smart expense management solution
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile
