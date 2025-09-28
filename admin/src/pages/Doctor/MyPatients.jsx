import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

const MyPatients = () => {
  const { patients, getPatients } = useContext(DoctorContext)

  useEffect(() => {
    console.log('MyPatients: Component mounted, calling getPatients...')
    getPatients()
  }, [])

  // Debug: Log patients when they change
  useEffect(() => {
    console.log('MyPatients: Patients updated:', patients)
  }, [patients])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    // Handle different date formats
    let date
    if (typeof dateString === 'number') {
      // Handle timestamp format
      date = new Date(dateString)
    } else if (typeof dateString === 'string' && dateString.includes('_')) {
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

  return (
    <div className='m-5'>
      <h1 className='text-2xl font-semibold mb-6'>My Patients</h1>
      
      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-4'>
          {patients.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {patients.map((patient, index) => (
                <div key={patient._id || index} className='border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-300 hover:scale-105'>
                  <div className='flex items-center gap-4 mb-4'>
                    <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg'>
                      {patient.name?.charAt(0) || 'P'}
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-xl font-bold text-gray-900 mb-1'>{patient.name}</h3>
                      <p className='text-sm text-gray-600 flex items-center gap-2'>
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                          <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                          <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                        </svg>
                        {patient.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className='space-y-3 bg-gray-50 p-4 rounded-lg'>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600 font-medium'>Phone:</span>
                      <span className='font-semibold text-gray-900'>{patient.phone}</span>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600 font-medium'>Total Visits:</span>
                      <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold'>
                        {patient.totalAppointments}
                      </span>
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600 font-medium'>Last Visit:</span>
                      <span className='font-semibold text-gray-900'>{formatDate(patient.lastAppointment)}</span>
                    </div>
                    
                    {patient.dateOfBirth && (
                      <div className='flex justify-between items-center'>
                        <span className='text-gray-600 font-medium'>Age:</span>
                        <span className='font-semibold text-gray-900'>{calculateAge(patient.dateOfBirth)} years</span>
                      </div>
                    )}
                  </div>
                  
                  <div className='mt-4 flex justify-between items-center'>
                    <div className='text-xs text-gray-500'>
                      Patient ID: {patient._id?.slice(-8)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              <p>No patients found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyPatients
