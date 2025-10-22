import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const fixUserRoles = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Update main_admin to MAIN_ADMIN
    const result1 = await User.updateOne(
      { role: 'main_admin' },
      { role: 'MAIN_ADMIN' }
    );
    console.log(`✅ Updated ${result1.modifiedCount} main_admin to MAIN_ADMIN`);

    // Update sub_admin to SUB_ADMIN
    const result2 = await User.updateOne(
      { role: 'sub_admin' },
      { role: 'SUB_ADMIN' }
    );
    console.log(`✅ Updated ${result2.modifiedCount} sub_admin to SUB_ADMIN`);

    // Update intern to INTERN
    const result3 = await User.updateOne(
      { role: 'intern' },
      { role: 'INTERN' }
    );
    console.log(`✅ Updated ${result3.modifiedCount} intern to INTERN`);

    // Verify the changes
    const mainAdmin = await User.findOne({ email: 'admin@company.com' });
    if (mainAdmin) {
      console.log('\n🔍 Updated Main Admin:');
      console.log(`- Email: ${mainAdmin.email}`);
      console.log(`- Name: ${mainAdmin.name}`);
      console.log(`- Role: ${mainAdmin.role}`);
    }

    // Show all roles now
    const roles = await User.distinct('role');
    console.log('\n📊 Available roles after update:', roles);

    console.log('\n✅ Role update completed!');
    console.log('You can now login with:');
    console.log('- Email: admin@company.com');
    console.log('- Password: StrongAdmin#123');
    
  } catch (error) {
    console.error('❌ Error updating roles:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

fixUserRoles();
