import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';

const LabResult = sequelize.define('LabResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  medicalRecordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'medical_records',
      key: 'id'
    }
  },
  testName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Name of the lab test'
  },
  testCategory: {
    type: DataTypes.ENUM('blood', 'urine', 'imaging', 'cardiac', 'pulmonary', 'other'),
    allowNull: false
  },
  testResults: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Structured test results data'
  },
  normalRange: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Normal range for the test'
  },
  status: {
    type: DataTypes.ENUM('normal', 'abnormal', 'critical', 'pending'),
    defaultValue: 'pending'
  },
  labTechnician: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Name of lab technician'
  },
  orderedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Doctor who ordered the test'
  },
  orderedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Additional notes about the test'
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Path to uploaded lab report file'
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
  tableName: 'lab_results',
  timestamps: true
});

export default LabResult;
