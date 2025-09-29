import { sequelize } from '../config/mysql.js';
import { Patient } from '../models/mysql/index.js';
import userModel from '../models/userModel.js';

// Script to check patient sync status
const checkPatientSync = async () => {
    try {
        console.log('🔍 Checking patient sync status...\n');
        
        // Get MongoDB users
        const mongoUsers = await userModel.find({}, '_id name email');
        console.log(`📊 MongoDB Users: ${mongoUsers.length}`);
        mongoUsers.forEach(user => {
            console.log(`   - ${user.name} (${user.email}) - ID: ${user._id}`);
        });
        
        console.log('\n');
        
        // Get MySQL patients
        const mysqlPatients = await Patient.findAll();
        console.log(`📊 MySQL Patients: ${mysqlPatients.length}`);
        mysqlPatients.forEach(patient => {
            console.log(`   - Patient ID: ${patient.id}, User ID: ${patient.userId}, MR Number: ${patient.medicalRecordNumber}`);
        });
        
        console.log('\n');
        
        // Check sync status
        const syncedCount = mysqlPatients.length;
        const totalUsers = mongoUsers.length;
        const missingCount = totalUsers - syncedCount;
        
        console.log(`📈 Sync Status:`);
        console.log(`   - Total MongoDB Users: ${totalUsers}`);
        console.log(`   - Synced to MySQL: ${syncedCount}`);
        console.log(`   - Missing in MySQL: ${missingCount}`);
        
        if (missingCount > 0) {
            console.log(`\n⚠️  ${missingCount} users need to be synced to MySQL`);
            console.log('💡 Use the "Sync Patients" button in the admin panel to sync them');
        } else {
            console.log('\n✅ All users are synced to MySQL');
        }
        
    } catch (error) {
        console.error('❌ Error checking sync status:', error);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
};

checkPatientSync();
