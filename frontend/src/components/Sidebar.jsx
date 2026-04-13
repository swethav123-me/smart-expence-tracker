import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  FileText,
  Wallet,
  Tag,
  Target,
  User,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
} from 'lucide-react'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { logout } = useAuth()

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/records', icon: FileText, label: 'Records' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
    { path: '/accounts', icon: Wallet, label: 'Accounts' },
    { path: '/categories', icon: Tag, label: 'Categories' },
    { path: '/budgets', icon: Target, label: 'Budgets' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden text-dark dark:text-light"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static w-64 h-screen bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 mt-12 md:mt-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
              $
            </div>
            <h1 className="text-xl font-bold text-dark dark:text-light">Smart Tracker</h1>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                isActive(path)
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
