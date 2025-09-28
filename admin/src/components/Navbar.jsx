import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Navbar = () => {
  const { setAToken } = useContext(AdminContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('aToken')
    // Clear token from context
    setAToken('')
    // Show success message
    toast.success('Logged out successfully')
    // Redirect to login (this will happen automatically due to context change)
  }

  return (
    <div className='bg-white shadow-md border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        {/* Left side - Logo/Title */}
        <div className='flex items-center'>
          <h1 className='text-xl font-bold text-gray-800'>Hospital Admin Dashboard</h1>
        </div>

        {/* Right side - Admin indicator and Logout */}
        <div className='flex items-center gap-4'>
          {/* Admin Badge */}
          <div className='flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z' clipRule='evenodd' />
            </svg>
            Admin
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar