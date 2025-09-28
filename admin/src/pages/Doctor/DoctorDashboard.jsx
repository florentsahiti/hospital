import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {
  const { 
    dToken, 
    dashboardData, 
    appointments, 
    getDashboardData, 
    getAppointments, 
    toggleAvailability 
  } = useContext(DoctorContext)
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (dToken) {
      getDashboardData()
      getAppointments()
      setLoading(false)
    }
  }, [dToken])

  // Get upcoming appointments (next 5 appointments)
  const upcomingAppointments = appointments
    .filter(apt => {
      if (!apt.date) return false
      
      let appointmentDate
      if (typeof apt.date === 'string' && apt.date.includes('_')) {
        // Handle format like "28_1_2024"
        const [day, month, year] = apt.date.split('_')
        appointmentDate = new Date(year, month - 1, day)
      } else {
        appointmentDate = new Date(apt.date)
      }
      
      return appointmentDate >= new Date()
    })
    .slice(0, 5)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    // Handle different date formats
    let date
    if (typeof dateString === 'string' && dateString.includes('_')) {
      // Handle format like "28_1_2024"
      const [day, month, year] = dateString.split('_')
      date = new Date(year, month - 1, day)
    } else {
      date = new Date(dateString)
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A'
    return timeString
  }

  // Calculate earnings from paid appointments
  const totalEarnings = appointments
    .filter(apt => apt.paymentStatus === 'paid')
    .reduce((sum, apt) => sum + (apt.fees || 0), 0)

  const todayEarnings = appointments
    .filter(apt => {
      const aptDate = new Date(apt.date)
      const today = new Date()
      return aptDate.toDateString() === today.toDateString() && apt.paymentStatus === 'paid'
    })
    .reduce((sum, apt) => sum + (apt.fees || 0), 0)

  if (loading) {
    return (
      <div className='m-5 flex items-center justify-center min-h-[80vh]'>
        <div className='text-lg'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='m-5'>
      {/* Dashboard Stats */}
      <div className='flex flex-wrap gap-3 mb-8'>
        <div className='flex items-center gap-2 bg-white p-3 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>
              {dashboardData?.todayAppointments || 0}
            </p>
            <p className='text-gray-400'>Today's Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-3 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>
              {dashboardData?.totalPatients || 0}
            </p>
            <p className='text-gray-400'>Total Patients</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-3 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>
              {dashboardData?.pendingAppointments || 0}
            </p>
            <p className='text-gray-400'>Pending Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-3 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>${totalEarnings}</p>
            <p className='text-gray-400'>Total Earnings</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-3 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>${todayEarnings}</p>
            <p className='text-gray-400'>Today's Earnings</p>
          </div>
        </div>

        <div 
          className={`flex items-center gap-2 p-3 min-w-52 rounded border-2 cursor-pointer hover:scale-105 transition-all ${
            dashboardData?.available 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}
          onClick={toggleAvailability}
        >
          <img className='w-14' src={assets.tick_icon} alt="" />
          <div>
            <p className={`text-xl font-semibold ${
              dashboardData?.available ? 'text-green-600' : 'text-red-600'
            }`}>
              {dashboardData?.available ? 'Available' : 'Unavailable'}
            </p>
            <p className='text-gray-400'>Click to toggle</p>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-2.5 px-4 py-4 border-b'>
          <img className='w-6' src={assets.appointments_icon} alt="" />
          <p className='text-lg font-semibold'>Upcoming Appointments</p>
        </div>
        
        <div className='p-6'>
          {upcomingAppointments.length > 0 ? (
            <div className='space-y-4'>
              {upcomingAppointments.map((appointment, index) => (
                <div key={appointment._id || index} className='flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg'>
                      {appointment.patientName?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <p className='font-bold text-gray-900 text-lg'>{appointment.patientName}</p>
                      <p className='text-sm text-gray-600'>{appointment.speciality}</p>
                      <p className='text-sm text-gray-500'>{appointment.patientEmail}</p>
                    </div>
                  </div>
                  <div className='text-right space-y-1'>
                    <div className='bg-blue-100 px-3 py-1 rounded-lg'>
                      <p className='font-bold text-blue-900'>{formatTime(appointment.time)}</p>
                    </div>
                    <p className='text-sm text-gray-600'>{formatDate(appointment.date)}</p>
                    <p className='text-sm font-semibold text-green-600'>${appointment.fees}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      appointment.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-12 text-gray-500'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className='w-8 h-8 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd' />
                </svg>
              </div>
              <p className='text-lg font-medium'>No upcoming appointments</p>
              <p className='text-sm'>You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard

