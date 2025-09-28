import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'

const DoctorProfile = () => {
  const { profile, getProfile, updateProfile } = useContext(DoctorContext)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    experience: '',
    fees: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    getProfile()
  }, [])

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        speciality: profile.speciality || '',
        experience: profile.experience || '',
        fees: profile.fees || '',
        phone: profile.phone || '',
        address: profile.address || ''
      })
    }
  }, [profile])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        speciality: profile.speciality || '',
        experience: profile.experience || '',
        fees: profile.fees || '',
        phone: profile.phone || '',
        address: profile.address || ''
      })
    }
    setIsEditing(false)
  }

  if (!profile) {
    return (
      <div className='m-5 flex items-center justify-center min-h-[80vh]'>
        <div className='text-lg'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='m-5'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-semibold'>My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className='px-4 py-2 bg-primary text-white rounded hover:bg-primary/90'
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        {isEditing ? (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary'
                  required
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Speciality</label>
                <input
                  type='text'
                  name='speciality'
                  value={formData.speciality}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary'
                  required
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Experience (years)</label>
                <input
                  type='number'
                  name='experience'
                  value={formData.experience}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary'
                  required
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Fees ($)</label>
                <input
                  type='number'
                  name='fees'
                  value={formData.fees}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary'
                  required
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Phone</label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary'
                  required
                />
              </div>
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
              <textarea
                name='address'
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary'
                required
              />
            </div>
            
            <div className='flex gap-3'>
              <button
                type='submit'
                className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
              >
                Save Changes
              </button>
              <button
                type='button'
                onClick={handleCancel}
                className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700'
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className='space-y-6'>
            <div className='flex items-center gap-4'>
              <div className='w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-semibold'>
                {profile.name?.charAt(0) || 'D'}
              </div>
              <div>
                <h2 className='text-2xl font-semibold text-gray-900'>{profile.name}</h2>
                <p className='text-gray-600'>{profile.speciality}</p>
                <p className='text-sm text-gray-500'>{profile.experience} years experience</p>
              </div>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-3'>Contact Information</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Email:</span>
                    <span className='font-medium'>{profile.email}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Phone:</span>
                    <span className='font-medium'>{profile.phone}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Fees:</span>
                    <span className='font-medium'>${profile.fees}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-3'>Address</h3>
                <p className='text-gray-700'>{profile.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorProfile
