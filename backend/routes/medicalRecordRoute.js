import express from 'express';
import {
    getPatientRecords,
    createMedicalRecord,
    updateMedicalRecord,
    getMedicalRecord,
    addPrescription,
    addVitalSigns,
    addLabResult,
    getPatientProfile,
    createOrUpdatePatient
} from '../controllers/medicalRecordController.js';
import { authDoctor } from '../middlewares/authDoctor.js';
import authAdmin from '../middlewares/authAdmin.js';

const medicalRecordRouter = express.Router();

// Patient profile routes
medicalRecordRouter.post('/patient-profile', authDoctor, createOrUpdatePatient);
medicalRecordRouter.get('/patient-profile/:patientId', authDoctor, getPatientProfile);

// Medical records routes
medicalRecordRouter.get('/patient/:patientId/records', authDoctor, getPatientRecords);
medicalRecordRouter.post('/records', authDoctor, createMedicalRecord);
medicalRecordRouter.get('/records/:recordId', authDoctor, getMedicalRecord);
medicalRecordRouter.put('/records/:recordId', authDoctor, updateMedicalRecord);

// Prescription routes
medicalRecordRouter.post('/records/:recordId/prescriptions', authDoctor, addPrescription);

// Vital signs routes
medicalRecordRouter.post('/records/:recordId/vital-signs', authDoctor, addVitalSigns);

// Lab results routes
medicalRecordRouter.post('/records/:recordId/lab-results', authDoctor, addLabResult);

export default medicalRecordRouter;
