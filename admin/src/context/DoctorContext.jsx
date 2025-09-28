import { useState } from "react";
import { createContext } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const[dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [dashboardData, setDashboardData] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [patients, setPatients] = useState([])
    const [profile, setProfile] = useState(null)

    const getDashboardData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })
            if (data.success) {
                setDashboardData(data.dashboardData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to load dashboard data')
        }
    }

    const getAppointments = async () => {
        try {
            console.log('DoctorContext: Fetching appointments...')
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })
            console.log('DoctorContext: Appointments API response:', data)
            if (data.success) {
                console.log('DoctorContext: Setting appointments:', data.appointments)
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('DoctorContext: Error fetching appointments:', error)
            toast.error('Failed to load appointments')
        }
    }

    const getPatients = async () => {
        try {
            console.log('DoctorContext: Fetching patients...')
            console.log('DoctorContext: Backend URL:', backendUrl)
            console.log('DoctorContext: Token:', dToken ? 'Present' : 'Missing')
            
            const { data } = await axios.get(backendUrl + '/api/doctor/patients', { headers: { dToken } })
            console.log('DoctorContext: Patients API response:', data)
            
            if (data.success) {
                console.log('DoctorContext: Setting patients:', data.patients)
                setPatients(data.patients)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('DoctorContext: Error fetching patients:', error)
            console.error('DoctorContext: Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            })
            toast.error('Failed to load patients')
        }
    }

    const getProfile = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } })
            if (data.success) {
                setProfile(data.profile)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to load profile')
        }
    }

    const updateProfile = async (profileData) => {
        try {
            const { data } = await axios.put(backendUrl + '/api/doctor/profile', profileData, { headers: { dToken } })
            if (data.success) {
                toast.success('Profile updated successfully')
                getProfile()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to update profile')
        }
    }

    const toggleAvailability = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/toggle-availability', {}, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getDashboardData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to update availability')
        }
    }

    const updateAppointmentStatus = async (appointmentId, status) => {
        try {
            console.log('DoctorContext: Updating appointment', appointmentId, 'to', status)
            console.log('DoctorContext: Backend URL:', backendUrl)
            console.log('DoctorContext: Full URL:', backendUrl + '/api/doctor/update-appointment')
            console.log('DoctorContext: Token:', dToken ? 'Present' : 'Missing')
            
            const { data } = await axios.post(backendUrl + '/api/doctor/update-appointment', 
                { appointmentId, status }, 
                { headers: { dToken } }
            )
            console.log('DoctorContext: API response:', data)
            if (data.success) {
                toast.success(data.message)
                // Immediately refresh the appointments data
                await getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('DoctorContext: Error updating appointment:', error)
            console.error('DoctorContext: Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            })
            toast.error('Failed to update appointment: ' + error.message)
        }
    }

    const value = {
        dToken, setDToken,
        backendUrl,
        dashboardData, setDashboardData,
        appointments, setAppointments,
        patients, setPatients,
        profile, setProfile,
        getDashboardData,
        getAppointments,
        getPatients,
        getProfile,
        updateProfile,
        toggleAvailability,
        updateAppointmentStatus
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>

    )
}

export default DoctorContextProvider
