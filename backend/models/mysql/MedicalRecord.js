import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';

const MedicalRecord = sequelize.define('MedicalRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'patients',
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'MongoDB doctor ID reference'
  },
  appointmentId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'MongoDB appointment ID reference'
  },
  visitDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  visitType: {
    type: DataTypes.ENUM('consultation', 'follow_up', 'emergency', 'routine_checkup', 'surgery'),
    allowNull: false,
    defaultValue: 'consultation'
  },
  chiefComplaint: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Primary reason for visit'
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Doctor diagnosis'
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Treatment provided'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Additional notes'
  },
  followUpRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  followUpDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'medical_records',
  timestamps: true
});

export default MedicalRecord;
