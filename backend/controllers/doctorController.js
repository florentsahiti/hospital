import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const changeAvailability = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        if (!docData) {
            return res.json({ success: false, message: 'Doctor not found' })
        }
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availability changed' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])

        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

    //API doctor Login 
    const loginDoctor = async (req,res) => {

        try {
            
            const {email, password} = req.body
            const doctor = await doctorModel.findOne({email})

            if (!doctor) {
                return res.json({success:false, message:'Invalid credentials'})
            } 

            const isMatch = await bcrypt.compare(password, doctor.password)

            if (isMatch) {
                
                const token = jwt.sign({id:doctor._id}, process.env.JWT_SECRET)

                res.json({success:true, token})
                
            } else {
                res.json({success:false, message:'Invalid credentials'})
            }

        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message });
        }

    }

// Get doctor dashboard data
const getDashboardData = async (req, res) => {
    try {
        const doctorId = req.doctor.id
        
        // Get today's appointments
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        const todayAppointments = await appointmentModel.countDocuments({
            docId: doctorId,
            date: { $gte: today, $lt: tomorrow }
        })
        
        // Get total patients
        const totalPatients = await appointmentModel.distinct('userId', { docId: doctorId })
        
        // Get pending appointments (not cancelled and not completed)
        const pendingAppointments = await appointmentModel.countDocuments({
            docId: doctorId,
            cancelled: false,
            isCompleted: false
        })
        
        // Get doctor availability
        const doctor = await doctorModel.findById(doctorId)
        
        res.json({
            success: true,
            dashboardData: {
                todayAppointments,
                totalPatients: totalPatients.length,
                pendingAppointments,
                available: doctor.available
            }
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get doctor's appointments
const getAppointments = async (req, res) => {
    try {
        const doctorId = req.doctor.id
        
        const appointments = await appointmentModel.find({ docId: doctorId })
            .sort({ date: 1, slotTime: 1 })
        
        const formattedAppointments = appointments.map(appointment => {
            let status = 'pending'
            
            console.log('Processing appointment:', appointment._id, {
                cancelled: appointment.cancelled,
                isCompleted: appointment.isCompleted,
                isConfirmed: appointment.isConfirmed
            })
            
            if (appointment.cancelled) {
                status = 'cancelled'
            } else if (appointment.isCompleted) {
                status = 'completed'
            } else if (appointment.isConfirmed === true) {
                status = 'confirmed'
            } else {
                // Default to pending if no status is set
                status = 'pending'
            }
            
            console.log('Final status for appointment', appointment._id, ':', status)
            
            return {
                _id: appointment._id,
                patientName: appointment.userData.name,
                patientEmail: appointment.userData.email,
                patientPhone: appointment.userData.phone,
                date: appointment.slotDate,
                time: appointment.slotTime,
                speciality: appointment.docData.speciality,
                status: status,
                fees: appointment.amount,
                paymentStatus: appointment.paymentStatus,
                paidAt: appointment.paidAt,
                isCompleted: appointment.isCompleted,
                cancelled: appointment.cancelled,
                isConfirmed: appointment.isConfirmed
            }
        })
        
        res.json({
            success: true,
            appointments: formattedAppointments
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get doctor's patients
const getPatients = async (req, res) => {
    try {
        const doctorId = req.doctor.id
        console.log('Getting patients for doctor:', doctorId)
        console.log('Doctor ID type:', typeof doctorId)
        
        // Let's see all appointments in the database first
        const allAppointmentsInDB = await appointmentModel.find({})
        console.log('Total appointments in database:', allAppointmentsInDB.length)
        if (allAppointmentsInDB.length > 0) {
            console.log('Sample appointment from DB:', {
                _id: allAppointmentsInDB[0]._id,
                docId: allAppointmentsInDB[0].docId,
                docIdType: typeof allAppointmentsInDB[0].docId,
                userId: allAppointmentsInDB[0].userId
            })
        }
        
        // First, let's see what appointments exist for this doctor
        const allAppointments = await appointmentModel.find({ docId: doctorId })
        console.log('Total appointments for doctor:', allAppointments.length)
        console.log('Sample appointment:', allAppointments[0])
        
        // Let's also try without toString to see if that's the issue
        const allAppointments2 = await appointmentModel.find({ docId: doctorId.toString() })
        console.log('Total appointments for doctor (with toString):', allAppointments2.length)
        
        // Let's try a simpler approach first - just get all appointments for this doctor
        const doctorAppointments = await appointmentModel.find({ docId: doctorId.toString() })
        console.log('Doctor appointments found:', doctorAppointments.length)
        
        // Now let's try the aggregation with more debugging
        const patients = await appointmentModel.aggregate([
            { $match: { docId: doctorId.toString() } },
            {
                $group: {
                    _id: '$userId',
                    totalAppointments: { $sum: 1 },
                    lastAppointment: { $max: '$date' },
                    userData: { $first: '$userData' }
                }
            },
            {
                $project: {
                    _id: '$_id',
                    name: '$userData.name',
                    email: '$userData.email',
                    phone: '$userData.phone',
                    dateOfBirth: '$userData.dateOfBirth',
                    totalAppointments: 1,
                    lastAppointment: 1
                }
            }
        ])
        
        console.log('Aggregated patients:', patients.length)
        console.log('Sample patient:', patients[0])
        console.log('Doctor appointments length:', doctorAppointments.length)
        
        // Always try manual grouping since aggregation is failing
        console.log('Trying manual grouping...')
        const patientMap = new Map()
        
        doctorAppointments.forEach(appointment => {
            const userId = appointment.userId
            console.log('Processing appointment for userId:', userId)
            console.log('User data:', appointment.userData)
            
            if (!patientMap.has(userId)) {
                patientMap.set(userId, {
                    _id: userId,
                    name: appointment.userData.name,
                    email: appointment.userData.email,
                    phone: appointment.userData.phone,
                    dateOfBirth: appointment.userData.dateOfBirth,
                    totalAppointments: 0,
                    lastAppointment: appointment.date
                })
            }
            const patient = patientMap.get(userId)
            patient.totalAppointments++
            if (appointment.date > patient.lastAppointment) {
                patient.lastAppointment = appointment.date
            }
        })
        
        const manualPatients = Array.from(patientMap.values())
        console.log('Manual patients created:', manualPatients.length)
        console.log('Sample manual patient:', manualPatients[0])
        
        res.json({
            success: true,
            patients: manualPatients
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get doctor profile
const getProfile = async (req, res) => {
    try {
        const doctorId = req.doctor.id
        
        const doctor = await doctorModel.findById(doctorId).select('-password')
        
        res.json({
            success: true,
            profile: doctor
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update doctor profile
const updateProfile = async (req, res) => {
    try {
        const doctorId = req.doctor.id
        const { name, speciality, experience, fees, phone, address } = req.body
        
        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            { name, speciality, experience, fees, phone, address },
            { new: true }
        ).select('-password')
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            profile: updatedDoctor
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Toggle doctor availability
const toggleAvailability = async (req, res) => {
    try {
        const doctorId = req.doctor.id
        
        const doctor = await doctorModel.findById(doctorId)
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found' })
        }
        
        await doctorModel.findByIdAndUpdate(doctorId, { available: !doctor.available })
        
        res.json({
            success: true,
            message: `Availability ${!doctor.available ? 'enabled' : 'disabled'} successfully`
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId, status } = req.body
        const doctorId = req.doctor.id
        
        const appointment = await appointmentModel.findOne({ _id: appointmentId, docId: doctorId })
        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' })
        }
        
        let updateData = {}
        if (status === 'cancelled') {
            updateData = { cancelled: true, isConfirmed: false }
        } else if (status === 'completed') {
            updateData = { isCompleted: true }
        } else if (status === 'confirmed') {
            updateData = { cancelled: false, isCompleted: false, isConfirmed: true }
        }
        
        console.log('Updating appointment:', appointmentId, 'with data:', updateData)
        
        // First, let's check the current state
        const currentAppointment = await appointmentModel.findById(appointmentId)
        console.log('Current appointment before update:', {
            _id: currentAppointment._id,
            cancelled: currentAppointment.cancelled,
            isCompleted: currentAppointment.isCompleted,
            isConfirmed: currentAppointment.isConfirmed
        })
        
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(appointmentId, updateData, { new: true })
        console.log('Updated appointment:', updatedAppointment)
        
        // Verify the update worked
        const verifyAppointment = await appointmentModel.findById(appointmentId)
        console.log('Verification - appointment after update:', {
            _id: verifyAppointment._id,
            cancelled: verifyAppointment.cancelled,
            isCompleted: verifyAppointment.isCompleted,
            isConfirmed: verifyAppointment.isConfirmed
        })
        
        // Double-check with a fresh query
        const finalCheck = await appointmentModel.findOne({ _id: appointmentId, docId: doctorId })
        console.log('Final check - appointment from database:', {
            _id: finalCheck._id,
            cancelled: finalCheck.cancelled,
            isCompleted: finalCheck.isCompleted,
            isConfirmed: finalCheck.isConfirmed
        })
        
        res.json({
            success: true,
            message: 'Appointment status updated successfully'
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { 
    changeAvailability, 
    doctorList, 
    loginDoctor, 
    getDashboardData, 
    getAppointments, 
    getPatients, 
    getProfile, 
    updateProfile, 
    toggleAvailability, 
    updateAppointmentStatus 
};