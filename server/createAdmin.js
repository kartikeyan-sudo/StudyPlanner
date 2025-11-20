import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DEFAULT_ADMIN_EMAIL = 'admin@studyplanner.com';
const DEFAULT_ADMIN_PASSWORD = 'Admin@123';
const DEFAULT_ADMIN_NAME = 'System Administrator';

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('⚠️  Default admin already exists!');
      console.log('📧 Email:', DEFAULT_ADMIN_EMAIL);
      console.log('🔑 Password: (Use the existing password or reset it)');
      
      // Update to ensure isAdmin is true
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin status');
      }
      
      mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

    // Create admin user
    const admin = new User({
      name: DEFAULT_ADMIN_NAME,
      email: DEFAULT_ADMIN_EMAIL,
      password: hashedPassword,
      isAdmin: true
    });

    await admin.save();

    console.log('✅ Default admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', DEFAULT_ADMIN_EMAIL);
    console.log('🔑 Password:', DEFAULT_ADMIN_PASSWORD);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

createDefaultAdmin();
