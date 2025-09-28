import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'

const MyAppointments = () => {
  const { appointments, getAppointments, updateAppointmentStatus } = useContext(DoctorContext)
  const [updatingAppointments, setUpdatingAppointments] = useState(new Set())

  useEffect(() => {
    getAppointments()
  }, [])

  // Debug: Log appointments when they change
  useEffect(() => {
    console.log('MyAppointments: Appointments updated:', appointments)
  }, [appointments])

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      console.log('Updating appointment:', appointmentId, 'to status:', status)
      // Add appointment to updating set
      setUpdatingAppointments(prev => new Set(prev).add(appointmentId))
      
      await updateAppointmentStatus(appointmentId, status)
      
      // Force refresh the appointments data
      console.log('Force refreshing appointments...')
      await getAppointments()
      
      console.log('Appointment updated successfully')
    } catch (error) {
      console.error('Error updating appointment status:', error)
    } finally {
      // Remove appointment from updating set
      setUpdatingAppointments(prev => {
        const newSet = new Set(prev)
        newSet.delete(appointmentId)
        return newSet
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-amber-100 text-amber-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A'
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

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

  return (
    <div className='m-5'>
      <h1 className='text-2xl font-semibold mb-6'>My Appointments</h1>
      
      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-4'>
          {appointments.length > 0 ? (
            <div className='space-y-4'>
              {appointments.map((appointment, index) => (
                <div key={appointment._id || index} className='border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-4'>
                      <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg'>
                        {appointment.patientName?.charAt(0) || 'P'}
                      </div>
                      <div className='space-y-1'>
                        <h3 className='text-xl font-bold text-gray-900'>{appointment.patientName}</h3>
                        <p className='text-sm text-gray-600 flex items-center gap-2'>
                          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                            <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                          </svg>
                          {appointment.patientEmail}
                        </p>
                        <p className='text-sm text-gray-600 flex items-center gap-2'>
                          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                          </svg>
                          {appointment.patientPhone}
                        </p>
                        {appointment.userData?.dateOfBirth && (
                          <p className='text-sm text-gray-600 flex items-center gap-2'>
                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                              <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd' />
                            </svg>
                            Age: {calculateAge(appointment.userData.dateOfBirth)} years
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className='text-right space-y-2'>
                      <div className='bg-blue-50 px-3 py-2 rounded-lg'>
                        <p className='font-bold text-blue-900'>{formatDate(appointment.date)}</p>
                        <p className='text-sm text-blue-700'>{formatTime(appointment.time)}</p>
                      </div>
                      <div className='text-sm text-gray-600'>
                        <p className='font-medium'>{appointment.speciality}</p>
                        <p className='text-lg font-bold text-green-600'>${appointment.fees}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className='mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg'>
                    <div className='flex gap-3'>
                      {/* Appointment Status */}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
                        {appointment.status === 'pending' 
                          ? 'AWAITING APPROVAL' 
                          : appointment.status === 'confirmed' 
                            ? 'ACCEPTED' 
                            : appointment.status.toUpperCase()}
                      </span>
                      
                      {/* Payment Status - Only show if not paid */}
                      {appointment.paymentStatus !== 'paid' && (
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                          {appointment.paymentStatus === 'pending' ? 'PAYMENT PENDING' : appointment.paymentStatus.toUpperCase()}
                        </span>
                      )}
                      
                      {/* Show paid status */}
                      {appointment.paymentStatus === 'paid' && (
                        <span className='px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800'>
                          ✓ PAID
                        </span>
                      )}
                      
                      {appointment.paidAt && (
                        <span className='px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                          {new Date(appointment.paidAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    
                    <div className='flex gap-2'>
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                            disabled={updatingAppointments.has(appointment._id)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                              updatingAppointments.has(appointment._id)
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {updatingAppointments.has(appointment._id) ? (
                              <>
                                <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                </svg>
                                Accepting...
                              </>
                            ) : (
                              <>
                                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                  <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                </svg>
                                Accept
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                            disabled={updatingAppointments.has(appointment._id)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                              updatingAppointments.has(appointment._id)
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                              <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
                            </svg>
                            Decline
                          </button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && !appointment.isCompleted && (
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                          disabled={updatingAppointments.has(appointment._id)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                            updatingAppointments.has(appointment._id)
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                          </svg>
                          Mark Complete
                        </button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <div className='flex items-center gap-2 text-green-600'>
                          <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                          </svg>
                          <span className='text-sm font-medium'>Accepted</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              <p>No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyAppointments
