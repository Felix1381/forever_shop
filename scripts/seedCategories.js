const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Schema Category (copie du modèle TypeScript)
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de la catégorie est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  slug: {
    type: String,
    required: [true, 'Le slug est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  image: {
    type: String,
    trim: true
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'Le titre SEO ne peut pas dépasser 60 caractères']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'La description SEO ne peut pas dépasser 160 caractères']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware pour générer automatiquement le slug si non fourni
CategorySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

const Category = mongoose.model('Category', CategorySchema);

// Catégories par défaut pour Forever Living Products
const defaultCategories = [
  // Catégories principales
  {
    name: 'Boissons Aloe Vera',
    slug: 'boissons-aloe-vera',
    description: 'Découvrez notre gamme complète de boissons à base d\'Aloe Vera, riches en nutriments et bienfaits pour votre santé.',
    sortOrder: 1,
    isActive: true,
    seoTitle: 'Boissons Aloe Vera Forever Living - Nutrition Naturelle',
    seoDescription: 'Boissons Forever Living à base d\'Aloe Vera pur. Gel d\'Aloe Vera, jus et boissons nutritives pour votre bien-être quotidien.'
  },
  {
    name: 'Compléments Alimentaires',
    slug: 'complements-alimentaires',
    description: 'Compléments alimentaires naturels Forever Living pour soutenir votre santé et votre vitalité au quotidien.',
    sortOrder: 2,
    isActive: true,
    seoTitle: 'Compléments Alimentaires Forever Living - Nutrition Optimale',
    seoDescription: 'Compléments alimentaires Forever Living de qualité supérieure. Vitamines, minéraux et nutriments essentiels pour votre santé.'
  },
  {
    name: 'Soins de la Peau',
    slug: 'soins-peau',
    description: 'Produits de soins naturels à base d\'Aloe Vera pour une peau saine, hydratée et éclatante.',
    sortOrder: 3,
    isActive: true,
    seoTitle: 'Soins de la Peau Aloe Vera - Cosmétiques Naturels',
    seoDescription: 'Soins de la peau Forever Living à base d\'Aloe Vera. Crèmes, gels et produits cosmétiques naturels pour tous types de peau.'
  },
  {
    name: 'Soins Personnels',
    slug: 'soins-personnels',
    description: 'Gamme complète de produits d\'hygiène et de soins personnels naturels pour toute la famille.',
    sortOrder: 4,
    isActive: true,
    seoTitle: 'Soins Personnels Forever Living - Hygiène Naturelle',
    seoDescription: 'Produits d\'hygiène et soins personnels Forever Living. Dentifrice, shampooing, déodorant naturel à base d\'Aloe Vera.'
  },
  {
    name: 'Gestion du Poids',
    slug: 'gestion-poids',
    description: 'Programmes et produits Forever Living pour vous accompagner dans votre gestion du poids de manière naturelle.',
    sortOrder: 5,
    isActive: true,
    seoTitle: 'Gestion du Poids Forever Living - Minceur Naturelle',
    seoDescription: 'Produits Forever Living pour la gestion du poids. Programmes minceur naturels et compléments pour atteindre vos objectifs.'
  },
  {
    name: 'Ruche',
    slug: 'ruche',
    description: 'Produits de la ruche Forever Living : miel, gelée royale, propolis et pollen pour renforcer votre immunité.',
    sortOrder: 6,
    isActive: true,
    seoTitle: 'Produits de la Ruche Forever Living - Miel et Propolis',
    seoDescription: 'Produits de la ruche Forever Living de qualité premium. Miel, gelée royale, propolis et pollen pour votre santé naturelle.'
  }
];

// Sous-catégories
const subCategories = [
  // Sous-catégories pour Boissons Aloe Vera
  {
    name: 'Gel d\'Aloe Vera',
    slug: 'gel-aloe-vera',
    description: 'Gel d\'Aloe Vera pur à boire, source naturelle de vitamines et minéraux.',
    parentSlug: 'boissons-aloe-vera',
    sortOrder: 1,
    isActive: true,
    seoTitle: 'Gel d\'Aloe Vera à Boire - Forever Living',
    seoDescription: 'Gel d\'Aloe Vera pur Forever Living. Boisson naturelle riche en nutriments pour votre bien-être quotidien.'
  },
  {
    name: 'Jus d\'Aloe Vera',
    slug: 'jus-aloe-vera',
    description: 'Jus d\'Aloe Vera aux saveurs variées pour une consommation agréable et bénéfique.',
    parentSlug: 'boissons-aloe-vera',
    sortOrder: 2,
    isActive: true,
    seoTitle: 'Jus d\'Aloe Vera Aromatisé - Forever Living',
    seoDescription: 'Jus d\'Aloe Vera Forever Living aux saveurs naturelles. Boissons nutritives et délicieuses pour toute la famille.'
  },
  
  // Sous-catégories pour Compléments Alimentaires
  {
    name: 'Vitamines & Minéraux',
    slug: 'vitamines-mineraux',
    description: 'Complexes vitaminiques et minéraux essentiels pour combler vos besoins nutritionnels.',
    parentSlug: 'complements-alimentaires',
    sortOrder: 1,
    isActive: true,
    seoTitle: 'Vitamines et Minéraux Forever Living',
    seoDescription: 'Compléments vitaminiques Forever Living. Vitamines, minéraux et oligo-éléments pour une nutrition optimale.'
  },
  {
    name: 'Antioxydants',
    slug: 'antioxydants',
    description: 'Compléments riches en antioxydants pour lutter contre le vieillissement cellulaire.',
    parentSlug: 'complements-alimentaires',
    sortOrder: 2,
    isActive: true,
    seoTitle: 'Antioxydants Forever Living - Anti-âge Naturel',
    seoDescription: 'Compléments antioxydants Forever Living. Protection cellulaire naturelle contre le stress oxydatif et le vieillissement.'
  },
  {
    name: 'Digestion & Transit',
    slug: 'digestion-transit',
    description: 'Produits naturels pour améliorer la digestion et favoriser un transit intestinal sain.',
    parentSlug: 'complements-alimentaires',
    sortOrder: 3,
    isActive: true,
    seoTitle: 'Digestion et Transit - Compléments Forever Living',
    seoDescription: 'Compléments Forever Living pour la digestion. Probiotiques et fibres naturelles pour un système digestif sain.'
  },
  
  // Sous-catégories pour Soins de la Peau
  {
    name: 'Visage',
    slug: 'soins-visage',
    description: 'Soins spécifiques pour le visage : nettoyants, hydratants, anti-âge à base d\'Aloe Vera.',
    parentSlug: 'soins-peau',
    sortOrder: 1,
    isActive: true,
    seoTitle: 'Soins du Visage Aloe Vera - Forever Living',
    seoDescription: 'Soins du visage Forever Living à base d\'Aloe Vera. Crèmes, sérums et traitements anti-âge naturels.'
  },
  {
    name: 'Corps',
    slug: 'soins-corps',
    description: 'Soins corporels hydratants et nourrissants pour une peau douce et protégée.',
    parentSlug: 'soins-peau',
    sortOrder: 2,
    isActive: true,
    seoTitle: 'Soins du Corps Aloe Vera - Forever Living',
    seoDescription: 'Soins du corps Forever Living. Crèmes hydratantes, gels et lotions à base d\'Aloe Vera pour une peau saine.'
  },
  {
    name: 'Protection Solaire',
    slug: 'protection-solaire',
    description: 'Produits de protection solaire naturels pour préserver votre peau des UV.',
    parentSlug: 'soins-peau',
    sortOrder: 3,
    isActive: true,
    seoTitle: 'Protection Solaire Aloe Vera - Forever Living',
    seoDescription: 'Crèmes solaires Forever Living à base d\'Aloe Vera. Protection naturelle contre les UV pour toute la famille.'
  }
];

async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI non définie dans les variables d\'environnement');
    }

    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
}

async function seedCategories() {
  try {
    console.log('🌱 Début du seed des catégories...');

    // Supprimer toutes les catégories existantes
    await Category.deleteMany({});
    console.log('🗑️  Catégories existantes supprimées');

    // Créer les catégories principales
    console.log('📁 Création des catégories principales...');
    const createdMainCategories = [];
    
    for (const categoryData of defaultCategories) {
      const category = new Category(categoryData);
      const savedCategory = await category.save();
      createdMainCategories.push(savedCategory);
      console.log(`✅ Catégorie créée: ${savedCategory.name} (${savedCategory.slug})`);
    }

    // Créer les sous-catégories
    console.log('📂 Création des sous-catégories...');
    
    for (const subCategoryData of subCategories) {
      // Trouver la catégorie parente
      const parentCategory = createdMainCategories.find(cat => cat.slug === subCategoryData.parentSlug);
      
      if (parentCategory) {
        const subCategory = new Category({
          ...subCategoryData,
          parentCategory: parentCategory._id
        });
        delete subCategory.parentSlug; // Supprimer le champ temporaire
        
        const savedSubCategory = await subCategory.save();
        console.log(`✅ Sous-catégorie créée: ${savedSubCategory.name} (parent: ${parentCategory.name})`);
      } else {
        console.warn(`⚠️  Catégorie parente non trouvée pour: ${subCategoryData.name}`);
      }
    }

    console.log('🎉 Seed des catégories terminé avec succès !');
    
    // Afficher un résumé
    const totalCategories = await Category.countDocuments();
    const mainCategories = await Category.countDocuments({ parentCategory: null });
    const subCategoriesCount = await Category.countDocuments({ parentCategory: { $ne: null } });
    
    console.log('\n📊 Résumé:');
    console.log(`   Total des catégories: ${totalCategories}`);
    console.log(`   Catégories principales: ${mainCategories}`);
    console.log(`   Sous-catégories: ${subCategoriesCount}`);

  } catch (error) {
    console.error('❌ Erreur lors du seed des catégories:', error);
    throw error;
  }
}

async function main() {
  try {
    await connectDB();
    await seedCategories();
    console.log('\n✨ Script terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur dans le script principal:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { seedCategories, Category };
