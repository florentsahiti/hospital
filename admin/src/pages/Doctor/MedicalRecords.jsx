import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const MedicalRecords = () => {
  const { backendUrl, dToken, doctorId, getProfile } = useContext(DoctorContext)
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [medicalRecords, setMedicalRecords] = useState([])
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [showAddPrescription, setShowAddPrescription] = useState(false)
  const [showAddVitalSigns, setShowAddVitalSigns] = useState(false)
  const [showAddLabResult, setShowAddLabResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)

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

  // Form states for prescription
  const [newPrescription, setNewPrescription] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    quantity: '',
    refills: 0
  })

  // Form states for vital signs
  const [newVitalSigns, setNewVitalSigns] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: ''
  })

  // Form states for lab result
  const [newLabResult, setNewLabResult] = useState({
    testName: '',
    testCategory: 'blood',
    testResults: '',
    normalRange: '',
    status: 'pending',
    labTechnician: '',
    orderedBy: '',
    notes: '',
    filePath: ''
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

  // Add prescription handler
  const handleAddPrescription = async (e) => {
    e.preventDefault()
    
    if (!selectedRecord) {
      toast.error('Please select a medical record first.')
      return
    }
    
    try {
      const { data } = await axios.post(backendUrl + `/api/medical-records/records/${selectedRecord.id}/prescriptions`, {
        ...newPrescription,
        quantity: parseInt(newPrescription.quantity) || null
      }, { headers: { dToken } })

      if (data.success) {
        toast.success('Prescription added successfully')
        setShowAddPrescription(false)
        setNewPrescription({
          medicationName: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
          quantity: '',
          refills: 0
        })
        fetchMedicalRecords(selectedPatient._id)
      } else {
        toast.error(data.message || 'Failed to add prescription')
      }
    } catch (error) {
      console.error('Error adding prescription:', error)
      toast.error('Failed to add prescription: ' + (error.response?.data?.message || error.message))
    }
  }

  // Add vital signs handler
  const handleAddVitalSigns = async (e) => {
    e.preventDefault()
    
    if (!selectedRecord) {
      toast.error('Please select a medical record first.')
      return
    }
    
    try {
      const { data } = await axios.post(backendUrl + `/api/medical-records/records/${selectedRecord.id}/vital-signs`, {
        ...newVitalSigns,
        recordedBy: doctorId
      }, { headers: { dToken } })

      if (data.success) {
        toast.success('Vital signs recorded successfully')
        setShowAddVitalSigns(false)
        setNewVitalSigns({
          bloodPressureSystolic: '',
          bloodPressureDiastolic: '',
          heartRate: '',
          temperature: '',
          respiratoryRate: '',
          oxygenSaturation: '',
          weight: '',
          height: ''
        })
        fetchMedicalRecords(selectedPatient._id)
      } else {
        toast.error(data.message || 'Failed to record vital signs')
      }
    } catch (error) {
      console.error('Error adding vital signs:', error)
      toast.error('Failed to record vital signs: ' + (error.response?.data?.message || error.message))
    }
  }

  // Add lab result handler
  const handleAddLabResult = async (e) => {
    e.preventDefault()
    
    if (!selectedRecord) {
      toast.error('Please select a medical record first.')
      return
    }
    
    try {
      const { data } = await axios.post(backendUrl + `/api/medical-records/records/${selectedRecord.id}/lab-results`, {
        ...newLabResult,
        orderedBy: doctorId
      }, { headers: { dToken } })

      if (data.success) {
        toast.success('Lab result added successfully')
        setShowAddLabResult(false)
        setNewLabResult({
          testName: '',
          testCategory: 'blood',
          testResults: '',
          normalRange: '',
          status: 'pending',
          labTechnician: '',
          orderedBy: '',
          notes: '',
          filePath: ''
        })
        fetchMedicalRecords(selectedPatient._id)
      } else {
        toast.error(data.message || 'Failed to add lab result')
      }
    } catch (error) {
      console.error('Error adding lab result:', error)
      toast.error('Failed to add lab result: ' + (error.response?.data?.message || error.message))
    }
  }

  // Sync patients from MongoDB to MySQL
  const syncPatients = async () => {
    try {
      setSyncing(true)
      const { data } = await axios.post(backendUrl + '/api/medical-records/sync-patients', {}, { 
        headers: { dToken } 
      })
      
      if (data.success) {
        toast.success(data.message)
        // Refresh patients list
        fetchPatients()
      } else {
        toast.error(data.message || 'Failed to sync patients')
      }
    } catch (error) {
      console.error('Error syncing patients:', error)
      toast.error('Failed to sync patients: ' + (error.response?.data?.message || error.message))
    } finally {
      setSyncing(false)
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
        <div className='flex gap-3'>
          <button
            onClick={syncPatients}
            disabled={syncing}
            className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50'
          >
            {syncing ? 'Syncing...' : 'Sync Patients'}
          </button>
          {selectedPatient && (
            <button
              onClick={() => setShowAddRecord(true)}
              className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
            >
              Add New Record
            </button>
          )}
        </div>
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
                          <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-500'>{formatDate(record.visitDate)}</span>
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200'
                            >
                              Select
                            </button>
                          </div>
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
                          <div className='text-sm text-blue-600 mb-2'>
                            Follow-up required: {formatDate(record.followUpDate)}
                          </div>
                        )}

                        {/* Display related data */}
                        <div className='mt-4 space-y-3'>
                          {/* Prescriptions */}
                          {record.prescriptions && record.prescriptions.length > 0 && (
                            <div className='bg-green-50 p-3 rounded-lg'>
                              <h4 className='font-medium text-green-800 mb-2'>Prescriptions ({record.prescriptions.length})</h4>
                              {record.prescriptions.map((prescription, idx) => (
                                <div key={idx} className='text-sm text-green-700 mb-1'>
                                  • {prescription.medicationName} - {prescription.dosage} - {prescription.frequency}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Vital Signs */}
                          {record.vitalSigns && record.vitalSigns.length > 0 && (
                            <div className='bg-blue-50 p-3 rounded-lg'>
                              <h4 className='font-medium text-blue-800 mb-2'>Vital Signs ({record.vitalSigns.length})</h4>
                              {record.vitalSigns.map((vital, idx) => (
                                <div key={idx} className='text-sm text-blue-700 mb-1'>
                                  • BP: {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic} | 
                                  HR: {vital.heartRate} | Temp: {vital.temperature}°C
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Lab Results */}
                          {record.labResults && record.labResults.length > 0 && (
                            <div className='bg-yellow-50 p-3 rounded-lg'>
                              <h4 className='font-medium text-yellow-800 mb-2'>Lab Results ({record.labResults.length})</h4>
                              {record.labResults.map((lab, idx) => (
                                <div key={idx} className='text-sm text-yellow-700 mb-1'>
                                  • {lab.testName} - Status: {lab.status}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
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

      {/* Action Buttons for Selected Record */}
      {selectedRecord && (
        <div className='fixed bottom-4 right-4 flex flex-col gap-2 z-40'>
          <button
            onClick={() => setShowAddPrescription(true)}
            className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-lg'
          >
            Add Prescription
          </button>
          <button
            onClick={() => setShowAddVitalSigns(true)}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg'
          >
            Add Vital Signs
          </button>
          <button
            onClick={() => setShowAddLabResult(true)}
            className='bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors shadow-lg'
          >
            Add Lab Result
          </button>
        </div>
      )}

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

      {/* Add Prescription Modal */}
      {showAddPrescription && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <h2 className='text-xl font-semibold mb-4'>Add Prescription</h2>
            <form onSubmit={handleAddPrescription} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Medication Name</label>
                  <input
                    type='text'
                    value={newPrescription.medicationName}
                    onChange={(e) => setNewPrescription({...newPrescription, medicationName: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                    required
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Dosage</label>
                  <input
                    type='text'
                    value={newPrescription.dosage}
                    onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                    placeholder='e.g., 500mg, 1 tablet'
                    required
                  />
                </div>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Frequency</label>
                  <input
                    type='text'
                    value={newPrescription.frequency}
                    onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                    placeholder='e.g., twice daily, every 8 hours'
                    required
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Duration</label>
                  <input
                    type='text'
                    value={newPrescription.duration}
                    onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                    placeholder='e.g., 7 days, 2 weeks'
                    required
                  />
                </div>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Quantity</label>
                  <input
                    type='number'
                    value={newPrescription.quantity}
                    onChange={(e) => setNewPrescription({...newPrescription, quantity: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                    placeholder='Number of pills/units'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Refills</label>
                  <input
                    type='number'
                    value={newPrescription.refills}
                    onChange={(e) => setNewPrescription({...newPrescription, refills: parseInt(e.target.value)})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                    min='0'
                  />
                </div>
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Instructions</label>
                <textarea
                  value={newPrescription.instructions}
                  onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                  className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                  rows={3}
                  placeholder='Special instructions for taking medication'
                />
              </div>
              
              <div className='flex justify-end space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowAddPrescription(false)}
                  className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                >
                  Add Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vital Signs Modal */}
      {showAddVitalSigns && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <h2 className='text-xl font-semibold mb-4'>Add Vital Signs</h2>
            <form onSubmit={handleAddVitalSigns} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Blood Pressure (Systolic)</label>
                  <input
                    type='number'
                    value={newVitalSigns.bloodPressureSystolic}
                    onChange={(e) => setNewVitalSigns({...newVitalSigns, bloodPressureSystolic: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='120'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Blood Pressure (Diastolic)</label>
                  <input
                    type='number'
                    value={newVitalSigns.bloodPressureDiastolic}
                    onChange={(e) => setNewVitalSigns({...newVitalSigns, bloodPressureDiastolic: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='80'
                  />
                </div>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Heart Rate (BPM)</label>
                  <input
                    type='number'
                    value={newVitalSigns.heartRate}
                    onChange={(e) => setNewVitalSigns({...newVitalSigns, heartRate: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='72'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Temperature (°C)</label>
                  <input
                    type='number'
                    step='0.1'
                    value={newVitalSigns.temperature}
                    onChange={(e) => setNewVitalSigns({...newVitalSigns, temperature: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='36.5'
                  />
                </div>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Respiratory Rate</label>
                  <input
                    type='number'
                    value={newVitalSigns.respiratoryRate}
                    onChange={(e) => setNewVitalSigns({...newVitalSigns, respiratoryRate: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='16'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Oxygen Saturation (%)</label>
                  <input
                    type='number'
                    value={newVitalSigns.oxygenSaturation}
                    onChange={(e) => setNewVitalSigns({...newVitalSigns, oxygenSaturation: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='98'
                  />
                </div>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Weight (kg)</label>
                  <input
                    type='number'
                    step='0.1'
                    value={newVitalSigns.weight}
                    onChange={(e) => setNewVitalSigns({...newVitalSigns, weight: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='70.5'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Height (cm)</label>
                  <input
                    type='number'
                    step='0.1'
                    value={newVitalSigns.height}
                    onChange={(e) => setNewVitalSigns({...newVitalSigns, height: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='175.0'
                  />
                </div>
              </div>
              
              <div className='flex justify-end space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowAddVitalSigns(false)}
                  className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  Add Vital Signs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lab Result Modal */}
      {showAddLabResult && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <h2 className='text-xl font-semibold mb-4'>Add Lab Result</h2>
            <form onSubmit={handleAddLabResult} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Test Name</label>
                  <input
                    type='text'
                    value={newLabResult.testName}
                    onChange={(e) => setNewLabResult({...newLabResult, testName: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
                    required
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Test Category</label>
                  <select
                    value={newLabResult.testCategory}
                    onChange={(e) => setNewLabResult({...newLabResult, testCategory: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
                  >
                    <option value='blood'>Blood</option>
                    <option value='urine'>Urine</option>
                    <option value='imaging'>Imaging</option>
                    <option value='cardiac'>Cardiac</option>
                    <option value='pulmonary'>Pulmonary</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Test Results</label>
                  <input
                    type='text'
                    value={newLabResult.testResults}
                    onChange={(e) => setNewLabResult({...newLabResult, testResults: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
                    placeholder='e.g., 4.5 mg/dL'
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Normal Range</label>
                  <input
                    type='text'
                    value={newLabResult.normalRange}
                    onChange={(e) => setNewLabResult({...newLabResult, normalRange: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
                    placeholder='e.g., 3.5-5.0 mg/dL'
                  />
                </div>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
                  <select
                    value={newLabResult.status}
                    onChange={(e) => setNewLabResult({...newLabResult, status: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
                  >
                    <option value='pending'>Pending</option>
                    <option value='normal'>Normal</option>
                    <option value='abnormal'>Abnormal</option>
                    <option value='critical'>Critical</option>
                  </select>
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Lab Technician</label>
                  <input
                    type='text'
                    value={newLabResult.labTechnician}
                    onChange={(e) => setNewLabResult({...newLabResult, labTechnician: e.target.value})}
                    className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
                    placeholder='Technician name'
                  />
                </div>
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Notes</label>
                <textarea
                  value={newLabResult.notes}
                  onChange={(e) => setNewLabResult({...newLabResult, notes: e.target.value})}
                  className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
                  rows={3}
                  placeholder='Additional notes about the test'
                />
              </div>
              
              <div className='flex justify-end space-x-3 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowAddLabResult(false)}
                  className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors'
                >
                  Add Lab Result
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
