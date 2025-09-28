import { sequelize, testConnection } from '../../config/mysql.js';
import Patient from './Patient.js';
import MedicalRecord from './MedicalRecord.js';
import Prescription from './Prescription.js';
import VitalSigns from './VitalSigns.js';
import LabResult from './LabResult.js';

// Define relationships
Patient.hasMany(MedicalRecord, { foreignKey: 'patientId', as: 'medicalRecords' });
MedicalRecord.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

MedicalRecord.hasMany(Prescription, { foreignKey: 'medicalRecordId', as: 'prescriptions' });
Prescription.belongsTo(MedicalRecord, { foreignKey: 'medicalRecordId', as: 'medicalRecord' });

MedicalRecord.hasMany(VitalSigns, { foreignKey: 'medicalRecordId', as: 'vitalSigns' });
VitalSigns.belongsTo(MedicalRecord, { foreignKey: 'medicalRecordId', as: 'medicalRecord' });

MedicalRecord.hasMany(LabResult, { foreignKey: 'medicalRecordId', as: 'labResults' });
LabResult.belongsTo(MedicalRecord, { foreignKey: 'medicalRecordId', as: 'medicalRecord' });

// Sync database (create tables)
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables
    console.log('✅ MySQL database tables synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing MySQL database:', error);
  }
};

export {
  sequelize,
  Patient,
  MedicalRecord,
  Prescription,
  VitalSigns,
  LabResult,
  syncDatabase,
  testConnection
};
