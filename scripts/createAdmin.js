require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin schema (copied from model)
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rita-aloe-shop';
    
    // Ensure database name is included
    const dbUri = MONGODB_URI.includes('mongodb+srv') 
      ? `${MONGODB_URI}${MONGODB_URI.endsWith('/') ? '' : '/'}forever_shop`
      : MONGODB_URI;
    
    await mongoose.connect(dbUri);
    
    console.log('✅ Connecté à MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@rita-aloe.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Un admin avec cet email existe déjà');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nom:', existingAdmin.name);
      console.log('🔑 Rôle:', existingAdmin.role);
      return;
    }

    // Create new admin
    const admin = new Admin({
      email: 'admin@rita-aloe.com',
      password: 'admin123456', // This will be hashed automatically
      name: 'Administrateur Rita Aloe',
      role: 'super_admin',
      isActive: true,
    });

    await admin.save();

    console.log('🎉 Admin créé avec succès !');
    console.log('📧 Email: admin@rita-aloe.com');
    console.log('🔒 Mot de passe: admin123456');
    console.log('🔑 Rôle: super_admin');
    console.log('');
    console.log('🌐 Vous pouvez maintenant vous connecter à:');
    console.log('   http://localhost:3002/admin/login');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Run the script
createAdmin();
