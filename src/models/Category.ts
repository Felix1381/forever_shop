import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: mongoose.Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
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
    type: Schema.Types.ObjectId,
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

// Index pour améliorer les performances
CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1, sortOrder: 1 });
CategorySchema.index({ parentCategory: 1 });

// Virtual pour obtenir les sous-catégories
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

// Virtual pour compter les produits dans cette catégorie
CategorySchema.virtual('productCount', {
  ref: 'Product',
  localField: 'slug',
  foreignField: 'category',
  count: true
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
      .trim('-');
  }
  next();
});

// Méthode pour obtenir le chemin complet de la catégorie
CategorySchema.methods.getFullPath = async function() {
  const path = [this.name];
  let current = this;
  
  while (current.parentCategory) {
    current = await mongoose.model('Category').findById(current.parentCategory);
    if (current) {
      path.unshift(current.name);
    } else {
      break;
    }
  }
  
  return path.join(' > ');
};

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
