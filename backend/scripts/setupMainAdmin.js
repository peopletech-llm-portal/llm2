import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const setupMainAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if main admin already exists
    const existingMainAdmin = await User.findOne({ role: 'MAIN_ADMIN' });
    if (existingMainAdmin) {
      console.log('⚠️  Main admin already exists');
      process.exit(0);
    }

    // Create main admin
    const hashedPassword = await bcrypt.hash(process.env.MAIN_ADMIN_PASSWORD || 'StrongAdmin#123', 10);
    
    const mainAdmin = new User({
      name: 'Main Administrator',
      email: process.env.MAIN_ADMIN_EMAIL || 'admin@company.com',
      password: hashedPassword,
      role: 'MAIN_ADMIN'
    });

    await mainAdmin.save();
    console.log('✅ Main admin created successfully');
    console.log(`📧 Email: ${mainAdmin.email}`);
    console.log(`🔑 Password: ${process.env.MAIN_ADMIN_PASSWORD || 'StrongAdmin#123'}`);
    
  } catch (error) {
    console.error('❌ Error setting up main admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

setupMainAdmin();
