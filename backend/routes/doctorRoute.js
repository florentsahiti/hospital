import express from 'express'
import { 
    doctorList, 
    loginDoctor, 
    getDashboardData, 
    getAppointments, 
    getPatients, 
    getProfile, 
    updateProfile, 
    toggleAvailability, 
    updateAppointmentStatus 
} from '../controllers/doctorController.js'
import { authDoctor } from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

// Public routes
doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)

// Test route
doctorRouter.get('/test', (req, res) => {
    res.json({ success: true, message: 'Doctor routes working' })
})

// Protected routes (require doctor authentication)
doctorRouter.get('/dashboard', authDoctor, getDashboardData)
doctorRouter.get('/appointments', authDoctor, getAppointments)
doctorRouter.get('/patients', authDoctor, getPatients)
doctorRouter.get('/profile', authDoctor, getProfile)
doctorRouter.put('/profile', authDoctor, updateProfile)
doctorRouter.post('/toggle-availability', authDoctor, toggleAvailability)
doctorRouter.post('/update-appointment', authDoctor, updateAppointmentStatus)

export default doctorRouter