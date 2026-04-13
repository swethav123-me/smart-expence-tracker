import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Moon, Sun, Bell, Settings, LogOut } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [isDark, setIsDark] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (isDark) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Welcome section with padding for mobile menu button */}
        <div className="flex-1 min-w-0 pt-6 md:pt-0 md:flex-none">
          <h2 className="text-lg font-semibold text-dark dark:text-light truncate">Welcome, {user?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your expenses</p>
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Dark Mode Toggle - hide on very small screens */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200 hidden sm:block"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Settings - hide on very small screens */}
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition duration-200 hidden sm:block">
            <Settings size={20} />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold hover:opacity-90 transition shadow-md text-lg"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-dark dark:text-light">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
