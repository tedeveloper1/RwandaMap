// Load environment variables FIRST
const dotenv = require('dotenv')
dotenv.config(); 

// Then require dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
console.log(process.env.MONGO_URI);
// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

if (!process.env.ADMIN_INITIAL_PASSWORD) {
  console.error('❌ Error: ADMIN_INITIAL_PASSWORD is not defined in .env file');
  process.exit(1);
}

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@yourdomain.com' });
    if (existingAdmin) {
      console.log('ℹ️ Admin already exists:', existingAdmin.email);
      return process.exit(0);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_INITIAL_PASSWORD, 
      saltRounds
    );

    // Create admin user
    const admin = new User({
      firstname: 'System',
      lastname: 'Admin',
      email: 'admin@yourdomain.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+250700000000',
      verified: true
    });

    // Save to database
    await admin.save();
    
    console.log('\n✅ Admin user created successfully!');
    console.log('===============================');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: ${process.env.ADMIN_INITIAL_PASSWORD}`);
    console.log('\n🚨 IMPORTANT: Change this password immediately after first login!');

  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Execute the script
seedAdmin();