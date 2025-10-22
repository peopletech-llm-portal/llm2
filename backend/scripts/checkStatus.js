import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const checkStatus = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if main admin exists
    const mainAdmin = await User.findOne({ role: 'MAIN_ADMIN' });
    if (mainAdmin) {
      console.log('✅ Main admin exists:', mainAdmin.email);
      console.log('🔑 You can login with these credentials:');
      console.log('   Email: admin@company.com');
      console.log('   Password: StrongAdmin#123');
    } else {
      console.log('❌ Main admin not found. Run setupMainAdmin.js first.');
    }

    // Check user roles
    const roles = await User.distinct('role');
    console.log('📊 Available roles:', roles);

    // Count users by role
    const userCounts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    console.log('👥 User counts by role:', userCounts);

    console.log('\n🚀 Your application is ready!');
    console.log('Next steps:');
    console.log('1. Start backend: npm run dev');
    console.log('2. Start frontend: cd ../frontend && npm run dev');
    console.log('3. Open: http://localhost:5173');
    
  } catch (error) {
    console.error('❌ Error checking status:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkStatus();
