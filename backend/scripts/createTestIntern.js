import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestIntern = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if test intern already exists
    const existingIntern = await User.findOne({ email: 'testintern@company.com' });
    if (existingIntern) {
      console.log('⚠️  Test intern already exists');
      process.exit(0);
    }

    // Create test intern
    const hashedPassword = await bcrypt.hash('TestIntern#123', 10);

    const testIntern = new User({
      name: 'Test Intern',
      email: 'testintern@company.com',
      password: hashedPassword,
      role: 'INTERN',
      employeeId: 'INT001',
      companyEmail: 'testintern@company.com',
      contactNumber: '9876543210',
      username: 'testintern'
    });

    await testIntern.save();
    console.log('✅ Test intern created successfully');
    console.log(`📧 Email: testintern@company.com`);
    console.log(`🔑 Password: TestIntern#123`);
    console.log(`👤 Name: Test Intern`);
    console.log(`🆔 Employee ID: INT001`);

  } catch (error) {
    console.error('❌ Error creating test intern:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createTestIntern();
