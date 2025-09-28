import express from 'express'
import { doctorList, loginDoctor } from '../controllers/doctorController.js'

const doctorRouter = express.Router()

// Pass the controller function as a handler, do not invoke it here
doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor )

export default doctorRouter