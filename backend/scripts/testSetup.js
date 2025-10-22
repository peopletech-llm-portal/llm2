import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const testSetup = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if main admin exists
    const mainAdmin = await User.findOne({ role: 'MAIN_ADMIN' });
    if (mainAdmin) {
      console.log('✅ Main admin exists:', mainAdmin.email);
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

    console.log('✅ Setup test completed');
    
  } catch (error) {
    console.error('❌ Error testing setup:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testSetup();
