import { Patient, MedicalRecord, Prescription, VitalSigns, LabResult } from '../models/mysql/index.js';

// Get patient medical records
const getPatientRecords = async (req, res) => {
    try {
        const { patientId } = req.params; // This is the MongoDB user ID
        const { page = 1, limit = 10 } = req.query;

        console.log('Fetching records for patient:', patientId);

        const offset = (page - 1) * limit;

        // First find the patient in MySQL using the MongoDB user ID
        const patient = await Patient.findOne({ where: { userId: patientId } });
        
        if (!patient) {
            return res.json({
                success: true,
                records: [],
                totalCount: 0,
                totalPages: 0,
                currentPage: parseInt(page)
            });
        }

        const records = await MedicalRecord.findAndCountAll({
            where: { patientId: patient.id }, // Use MySQL patient ID
            include: [
                {
                    model: Prescription,
                    as: 'prescriptions'
                },
                {
                    model: VitalSigns,
                    as: 'vitalSigns'
                },
                {
                    model: LabResult,
                    as: 'labResults'
                }
            ],
            order: [['visitDate', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        console.log('Found records:', records.count);

        res.json({
            success: true,
            records: records.rows,
            totalCount: records.count,
            totalPages: Math.ceil(records.count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching patient records:', error);
        res.json({ success: false, message: error.message });
    }
};

// Create new medical record
const createMedicalRecord = async (req, res) => {
    try {
        const {
            patientId, // This is the MongoDB user ID
            doctorId,
            appointmentId,
            visitDate,
            visitType,
            chiefComplaint,
            diagnosis,
            treatment,
            notes,
            followUpRequired,
            followUpDate
        } = req.body;

        console.log('Creating medical record with:', {
            patientId,
            doctorId,
            visitDate,
            visitType
        });

        // First, find or create the patient in MySQL
        let patient = await Patient.findOne({ where: { userId: patientId } });
        
        if (!patient) {
            // Create a new patient record in MySQL
            patient = await Patient.create({
                userId: patientId,
                medicalRecordNumber: `MR${Date.now()}`, // Generate unique MR number
                bloodType: null,
                allergies: null,
                emergencyContact: null,
                medicalHistory: null,
                insuranceProvider: null,
                insuranceNumber: null
            });
            console.log('Created new patient record:', patient.id);
        }

        const medicalRecord = await MedicalRecord.create({
            patientId: patient.id, // Use MySQL patient ID
            doctorId,
            appointmentId,
            visitDate,
            visitType,
            chiefComplaint,
            diagnosis,
            treatment,
            notes,
            followUpRequired,
            followUpDate
        });

        console.log('Created medical record:', medicalRecord.id);

        res.json({
            success: true,
            message: 'Medical record created successfully',
            record: medicalRecord
        });
    } catch (error) {
        console.error('Error creating medical record:', error);
        res.json({ success: false, message: error.message });
    }
};

// Update medical record
const updateMedicalRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        const updateData = req.body;

        const [updatedRows] = await MedicalRecord.update(updateData, {
            where: { id: recordId }
        });

        if (updatedRows === 0) {
            return res.json({ success: false, message: 'Medical record not found' });
        }

        const updatedRecord = await MedicalRecord.findByPk(recordId, {
            include: [
                { model: Prescription, as: 'prescriptions' },
                { model: VitalSigns, as: 'vitalSigns' },
                { model: LabResult, as: 'labResults' }
            ]
        });

        res.json({
            success: true,
            message: 'Medical record updated successfully',
            record: updatedRecord
        });
    } catch (error) {
        console.error('Error updating medical record:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get single medical record
const getMedicalRecord = async (req, res) => {
    try {
        const { recordId } = req.params;

        const record = await MedicalRecord.findByPk(recordId, {
            include: [
                { model: Prescription, as: 'prescriptions' },
                { model: VitalSigns, as: 'vitalSigns' },
                { model: LabResult, as: 'labResults' }
            ]
        });

        if (!record) {
            return res.json({ success: false, message: 'Medical record not found' });
        }

        res.json({
            success: true,
            record
        });
    } catch (error) {
        console.error('Error fetching medical record:', error);
        res.json({ success: false, message: error.message });
    }
};

// Add prescription to medical record
const addPrescription = async (req, res) => {
    try {
        const { recordId } = req.params;
        const {
            medicationName,
            dosage,
            frequency,
            duration,
            instructions,
            quantity,
            refills
        } = req.body;

        const prescription = await Prescription.create({
            medicalRecordId: recordId,
            medicationName,
            dosage,
            frequency,
            duration,
            instructions,
            quantity,
            refills
        });

        res.json({
            success: true,
            message: 'Prescription added successfully',
            prescription
        });
    } catch (error) {
        console.error('Error adding prescription:', error);
        res.json({ success: false, message: error.message });
    }
};

// Add vital signs to medical record
const addVitalSigns = async (req, res) => {
    try {
        const { recordId } = req.params;
        const {
            bloodPressureSystolic,
            bloodPressureDiastolic,
            heartRate,
            temperature,
            respiratoryRate,
            oxygenSaturation,
            weight,
            height,
            recordedBy
        } = req.body;

        // Calculate BMI if weight and height are provided
        let bmi = null;
        if (weight && height) {
            const heightInMeters = height / 100;
            bmi = weight / (heightInMeters * heightInMeters);
        }

        const vitalSigns = await VitalSigns.create({
            medicalRecordId: recordId,
            bloodPressureSystolic,
            bloodPressureDiastolic,
            heartRate,
            temperature,
            respiratoryRate,
            oxygenSaturation,
            weight,
            height,
            bmi,
            recordedBy
        });

        res.json({
            success: true,
            message: 'Vital signs recorded successfully',
            vitalSigns
        });
    } catch (error) {
        console.error('Error adding vital signs:', error);
        res.json({ success: false, message: error.message });
    }
};

// Add lab result to medical record
const addLabResult = async (req, res) => {
    try {
        const { recordId } = req.params;
        const {
            testName,
            testCategory,
            testResults,
            normalRange,
            status,
            labTechnician,
            orderedBy,
            notes,
            filePath
        } = req.body;

        const labResult = await LabResult.create({
            medicalRecordId: recordId,
            testName,
            testCategory,
            testResults,
            normalRange,
            status,
            labTechnician,
            orderedBy,
            notes,
            filePath
        });

        res.json({
            success: true,
            message: 'Lab result added successfully',
            labResult
        });
    } catch (error) {
        console.error('Error adding lab result:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get patient profile with medical history
const getPatientProfile = async (req, res) => {
    try {
        const { patientId } = req.params;

        const patient = await Patient.findOne({
            where: { userId: patientId },
            include: [
                {
                    model: MedicalRecord,
                    as: 'medicalRecords',
                    include: [
                        { model: Prescription, as: 'prescriptions' },
                        { model: VitalSigns, as: 'vitalSigns' },
                        { model: LabResult, as: 'labResults' }
                    ],
                    order: [['visitDate', 'DESC']],
                    limit: 5 // Get last 5 records
                }
            ]
        });

        if (!patient) {
            return res.json({ success: false, message: 'Patient not found' });
        }

        res.json({
            success: true,
            patient
        });
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.json({ success: false, message: error.message });
    }
};

// Create or update patient profile
const createOrUpdatePatient = async (req, res) => {
    try {
        const {
            userId,
            medicalRecordNumber,
            bloodType,
            allergies,
            emergencyContact,
            medicalHistory,
            insuranceProvider,
            insuranceNumber
        } = req.body;

        const [patient, created] = await Patient.findOrCreate({
            where: { userId },
            defaults: {
                medicalRecordNumber,
                bloodType,
                allergies,
                emergencyContact,
                medicalHistory,
                insuranceProvider,
                insuranceNumber
            }
        });

        if (!created) {
            // Update existing patient
            await patient.update({
                medicalRecordNumber,
                bloodType,
                allergies,
                emergencyContact,
                medicalHistory,
                insuranceProvider,
                insuranceNumber
            });
        }

        res.json({
            success: true,
            message: created ? 'Patient profile created successfully' : 'Patient profile updated successfully',
            patient
        });
    } catch (error) {
        console.error('Error creating/updating patient:', error);
        res.json({ success: false, message: error.message });
    }
};

export {
    getPatientRecords,
    createMedicalRecord,
    updateMedicalRecord,
    getMedicalRecord,
    addPrescription,
    addVitalSigns,
    addLabResult,
    getPatientProfile,
    createOrUpdatePatient
};
