import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const checkUserData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users with MAIN_ADMIN role
    const mainAdmins = await User.find({ role: 'MAIN_ADMIN' });
    console.log('🔍 Users with MAIN_ADMIN role:', mainAdmins.length);
    
    if (mainAdmins.length > 0) {
      console.log('📧 Main Admin Details:');
      mainAdmins.forEach(admin => {
        console.log(`- Email: ${admin.email}`);
        console.log(`- Name: ${admin.name}`);
        console.log(`- Role: ${admin.role}`);
        console.log(`- Created: ${admin.createdAt}`);
      });
    }

    // Find all users with main_admin role (old format)
    const oldMainAdmins = await User.find({ role: 'main_admin' });
    console.log('\n🔍 Users with main_admin role (old format):', oldMainAdmins.length);
    
    if (oldMainAdmins.length > 0) {
      console.log('📧 Old Main Admin Details:');
      oldMainAdmins.forEach(admin => {
        console.log(`- Email: ${admin.email}`);
        console.log(`- Name: ${admin.name}`);
        console.log(`- Role: ${admin.role}`);
        console.log(`- Created: ${admin.createdAt}`);
      });
    }

    // Find user by email
    const userByEmail = await User.findOne({ email: 'admin@company.com' });
    if (userByEmail) {
      console.log('\n🔍 User found by email admin@company.com:');
      console.log(`- Email: ${userByEmail.email}`);
      console.log(`- Name: ${userByEmail.name}`);
      console.log(`- Role: ${userByEmail.role}`);
      console.log(`- Password Hash: ${userByEmail.password.substring(0, 20)}...`);
    } else {
      console.log('\n❌ No user found with email admin@company.com');
    }

    // List all users
    const allUsers = await User.find({}).select('email name role createdAt');
    console.log('\n📊 All Users in Database:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - Role: ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking user data:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkUserData();
