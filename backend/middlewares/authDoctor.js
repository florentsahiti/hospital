import jwt from 'jsonwebtoken'
import doctorModel from '../models/doctorModel.js'

const authDoctor = async (req, res, next) => {
    try {
        const token = req.header('dToken')
        
        if (!token) {
            return res.json({ success: false, message: 'Access denied. No token provided.' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const doctor = await doctorModel.findById(decoded.id)
        
        if (!doctor) {
            return res.json({ success: false, message: 'Invalid token. Doctor not found.' })
        }

        req.doctor = { id: doctor._id }
        next()
    } catch (error) {
        res.json({ success: false, message: 'Invalid token.' })
    }
}

export { authDoctor }
