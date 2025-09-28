import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/mysql.js';

const Prescription = sequelize.define('Prescription', {
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
  medicationName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., 500mg, 1 tablet'
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., twice daily, every 8 hours'
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., 7 days, 2 weeks'
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Special instructions for taking medication'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Number of pills/units prescribed'
  },
  refills: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of refills allowed'
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active'
  },
  prescribedDate: {
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
  tableName: 'prescriptions',
  timestamps: true
});

export default Prescription;
