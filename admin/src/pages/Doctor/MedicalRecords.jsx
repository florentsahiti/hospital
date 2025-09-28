import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const MedicalRecords = () => {
  const { backendUrl, dToken, doctorId, getProfile } = useContext(DoctorContext)
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [medicalRecords, setMedicalRecords] = useState([])
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form states for new medical record
  const [newRecord, setNewRecord] = useState({
    visitDate: '',
    visitType: 'consultation',
    chiefComplaint: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    followUpRequired: false,
    followUpDate: ''
  })

  useEffect(() => {
    fetchPatients()
    getProfile() // Get doctor profile to set doctorId
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(backendUrl + '/api/doctor/patients', { 
        headers: { dToken } 
      })
      if (data.success) {
        setPatients(data.patients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
      toast.error('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const fetchMedicalRecords = async (patientId) => {
    try {
      setLoading(true)
      console.log('Fetching medical records for patient:', patientId)
      const { data } = await axios.get(backendUrl + `/api/medical-records/patient/${patientId}/records`, { 
        headers: { dToken } 
      })
      console.log('Medical records response:', data)
      if (data.success) {
        setMedicalRecords(data.records)
      } else {
        toast.error(data.message || 'Failed to load medical records')
      }
    } catch (error) {
      console.error('Error fetching medical records:', error)
      console.error('Error details:', error.response?.data)
      toast.error('Failed to load medical records: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    // Use userId from the patient data (this is the MongoDB user ID)
    fetchMedicalRecords(patient._id)
  }

  const handleAddRecord = async (e) => {
    e.preventDefault()
    
    if (!doctorId) {
      toast.error('Doctor ID not found. Please refresh the page.')
      return
    }
    
    if (!selectedPatient) {
      toast.error('Please select a patient first.')
      return
    }
    
    try {
      console.log('Adding medical record:', {
        patientId: selectedPatient._id,
        doctorId: doctorId,
        ...newRecord
      })
      
      const { data } = await axios.post(backendUrl + '/api/medical-records/records', {
        patientId: selectedPatient._id,
        doctorId: doctorId,
        ...newRecord
      }, { headers: { dToken } })

      console.log('API Response:', data)
      
      if (data.success) {
        toast.success('Medical record added successfully')
        setShowAddRecord(false)
        setNewRecord({
          visitDate: '',
          visitType: 'consultation',
          chiefComplaint: '',
          diagnosis: '',
          treatment: '',
          notes: '',
          followUpRequired: false,
          followUpDate: ''
        })
        fetchMedicalRecords(selectedPatient._id)
      } else {
        toast.error(data.message || 'Failed to add medical record')
      }
    } catch (error) {
      console.error('Error adding medical record:', error)
      console.error('Error details:', error.response?.data)
      toast.error('Failed to add medical record: ' + (error.response?.data?.message || error.message))
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className='m-5'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold'>Medical Records</h1>
        {selectedPatient && (
          <button
            onClick={() => setShowAddRecord(true)}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Add New Record
          </button>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Patients List */}
        <div className='bg-white rounded-lg border border-gray-200 p-4'>
          <h2 className='text-lg font-semibold mb-4'>Patients</h2>
          {loading ? (
            <div className='text-center py-4'>Loading patients...</div>
          ) : (
            <div className='space-y-2'>
              {patients.map((patient) => (
                <div
                  key={patient._id}
                  onClick={() => handlePatientSelect(patient)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPatient?._id === patient._id
                      ? 'bg-blue-100 border-blue-300 border'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <h3 className='font-medium'>{patient.name}</h3>
                  <p className='text-sm text-gray-600'>{patient.email}</p>
                  <p className='text-xs text-gray-500'>
                    {patient.totalAppointments} appointment{patient.totalAppointments !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medical Records */}
        <div className='lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4'>
          {selectedPatient ? (
            <>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-lg font-semibold'>
                  Medical Records - {selectedPatient.name}
                </h2>
              </div>
              
              {loading ? (
                <div className='text-center py-4'>Loading records...</div>
              ) : (
                <div className='space-y-4'>
                  {medicalRecords.length > 0 ? (
                    medicalRecords.map((record) => (
                      <div key={record.id} className='border border-gray-200 rounded-lg p-4'>
                        <div className='flex justify-between items-start mb-2'>
                          <h3 className='font-medium text-lg'>{record.visitType.replace('_', ' ').toUpperCase()}</h3>
                          <span className='text-sm text-gray-500'>{formatDate(record.visitDate)}</span>
                        </div>
                        
                        {record.chiefComplaint && (
                          <div className='mb-2'>
                            <span className='font-medium text-sm text-gray-600'>Chief Complaint:</span>
                            <p className='text-sm'>{record.chiefComplaint}</p>
                          </div>
                        )}
                        
                        {record.diagnosis && (
                          <div className='mb-2'>
                            <span className='font-medium text-sm text-gray-600'>Diagnosis:</span>
                            <p className='text-sm'>{record.diagnosis}</p>
                          </div>
                        )}
                        
                        {record.treatment && (
                          <div className='mb-2'>
                            <span className='font-medium text-sm text-gray-600'>Treatment:</span>
                            <p className='text-sm'>{record.treatment}</p>
                          </div>
                        )}
                        
                        {record.notes && (
                          <div className='mb-2'>
                            <span className='font-medium text-sm text-gray-600'>Notes:</span>
                            <p className='text-sm'>{record.notes}</p>
                          </div>
                        )}
                        
                        {record.followUpRequired && (
                          <div className='text-sm text-blue-600'>
                            Follow-up required: {formatDate(record.followUpDate)}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      No medical records found for this patient
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className='text-center py-8 text-gray-500'>
              Select a patient to view their medical records
            </div>
          )}
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddRecord && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <h2 className='text-xl font-semibold mb-4'>Add Medical Record</h2>
            <form onSubmit={handleAddRecord} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Visit Date</label>
                  <input
                    type='date'
                    value={newRecord.visitDate}
                    onChange={(e) => setNewRecord({...newRecord, visitDate: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    required
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Visit Type</label>
                  <select
                    value={newRecord.visitType}
                    onChange={(e) => setNewRecord({...newRecord, visitType: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  >
                    <option value='consultation'>Consultation</option>
                    <option value='follow_up'>Follow-up</option>
                    <option value='emergency'>Emergency</option>
                    <option value='routine_checkup'>Routine Checkup</option>
                    <option value='surgery'>Surgery</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Chief Complaint</label>
                <textarea
                  value={newRecord.chiefComplaint}
                  onChange={(e) => setNewRecord({...newRecord, chiefComplaint: e.target.value})}
                  className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  rows={3}
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Diagnosis</label>
                <textarea
                  value={newRecord.diagnosis}
                  onChange={(e) => setNewRecord({...newRecord, diagnosis: e.target.value})}
                  className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  rows={3}
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Treatment</label>
                <textarea
                  value={newRecord.treatment}
                  onChange={(e) => setNewRecord({...newRecord, treatment: e.target.value})}
                  className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  rows={3}
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Notes</label>
                <textarea
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                  className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  rows={3}
                />
              </div>
              
              <div className='flex items-center space-x-4'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={newRecord.followUpRequired}
                    onChange={(e) => setNewRecord({...newRecord, followUpRequired: e.target.checked})}
                    className='mr-2'
                  />
                  Follow-up required
                </label>
                
                {newRecord.followUpRequired && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Follow-up Date</label>
                    <input
                      type='date'
                      value={newRecord.followUpDate}
                      onChange={(e) => setNewRecord({...newRecord, followUpDate: e.target.value})}
                      className='p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                )}
              </div>
              
              <div className='flex justify-end space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowAddRecord(false)}
                  className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicalRecords
