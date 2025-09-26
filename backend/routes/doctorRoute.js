import express from 'express'
import { doctorList } from '../controllers/doctorController.js'

const doctorRouter = express.Router()

// Pass the controller function as a handler, do not invoke it here
doctorRouter.get('/list', doctorList)

export default doctorRouter