import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  images: {
    public_id: string;
    secure_url: string;
    alt?: string;
  }[];
  benefits: string[];
  ingredients: string[];
  usage: string;
  inStock: boolean;
  stockQuantity: number;
  isPopular: boolean;
  isNew: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['boissons', 'complements', 'soins'],
  },
  description: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  images: [{
    public_id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    alt: String,
  }],
  benefits: [String],
  ingredients: [String],
  usage: {
    type: String,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  isNew: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  seoTitle: String,
  seoDescription: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
}, {
  timestamps: true,
});

// Create slug from name before saving
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
