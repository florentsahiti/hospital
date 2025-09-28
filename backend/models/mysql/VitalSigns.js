import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';

const VitalSigns = sequelize.define('VitalSigns', {
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
  bloodPressureSystolic: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Systolic blood pressure'
  },
  bloodPressureDiastolic: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Diastolic blood pressure'
  },
  heartRate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Heart rate in BPM'
  },
  temperature: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
    comment: 'Body temperature in Celsius'
  },
  respiratoryRate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Breaths per minute'
  },
  oxygenSaturation: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Oxygen saturation percentage'
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Weight in kg'
  },
  height: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Height in cm'
  },
  bmi: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true,
    comment: 'Body Mass Index'
  },
  recordedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Doctor or nurse who recorded the vitals'
  },
  recordedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
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
  tableName: 'vital_signs',
  timestamps: true
});

export default VitalSigns;
