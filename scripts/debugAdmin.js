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

// Compare password method
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('🔍 Comparing passwords:');
  console.log('  - Candidate password:', candidatePassword);
  console.log('  - Stored hash:', this.password);
  
  const result = await bcrypt.compare(candidatePassword, this.password);
  console.log('  - Comparison result:', result);
  
  return result;
};

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function debugAdmin() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rita-aloe-shop';
    
    // Ensure database name is included
    const dbUri = MONGODB_URI.includes('mongodb+srv') 
      ? `${MONGODB_URI}${MONGODB_URI.endsWith('/') ? '' : '/'}forever_shop`
      : MONGODB_URI;
    
    await mongoose.connect(dbUri);
    console.log('✅ Connecté à MongoDB');

    // Find admin
    const admin = await Admin.findOne({ email: 'admin@rita-aloe.com' });
    
    if (!admin) {
      console.log('❌ Admin non trouvé');
      return;
    }

    console.log('👤 Admin trouvé:');
    console.log('  - Email:', admin.email);
    console.log('  - Nom:', admin.name);
    console.log('  - Rôle:', admin.role);
    console.log('  - Actif:', admin.isActive);
    console.log('  - Hash du mot de passe:', admin.password);
    console.log('');

    // Test password comparison
    console.log('🔐 Test de comparaison du mot de passe:');
    const testPassword = 'admin123456';
    
    try {
      const isValid = await admin.comparePassword(testPassword);
      console.log('✅ Résultat de la comparaison:', isValid);
      
      if (!isValid) {
        console.log('');
        console.log('🔧 Test de hash manuel:');
        const manualHash = await bcrypt.hash(testPassword, 12);
        console.log('  - Hash manuel:', manualHash);
        
        const manualCompare = await bcrypt.compare(testPassword, manualHash);
        console.log('  - Comparaison manuelle:', manualCompare);
        
        // Test direct avec le hash stocké
        const directCompare = await bcrypt.compare(testPassword, admin.password);
        console.log('  - Comparaison directe:', directCompare);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la comparaison:', error);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Run the script
debugAdmin();
