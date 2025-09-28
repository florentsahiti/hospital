import React, { useContext } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { toast } from 'react-toastify'

const DoctorNavbar = () => {
  const { setDToken } = useContext(DoctorContext)

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('dToken')
    // Clear token from context
    setDToken('')
    // Show success message
    toast.success('Logged out successfully')
    // Redirect to login (this will happen automatically due to context change)
  }

  return (
    <div className='bg-white shadow-md border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        {/* Left side - Logo/Title */}
        <div className='flex items-center'>
          <h1 className='text-xl font-bold text-gray-800'>Doctor Dashboard</h1>
        </div>

        {/* Right side - Doctor indicator and Logout */}
        <div className='flex items-center gap-4'>
          {/* Doctor Badge */}
          <div className='flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium'>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
            </svg>
            Doctor
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

export default DoctorNavbar
