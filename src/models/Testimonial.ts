import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  type: 'text' | 'video' | 'product-review';
  category: 'health' | 'weight-loss' | 'business' | 'lifestyle' | 'transformation';
  name: string;
  email: string;
  phone?: string;
  location: string;
  title: string;
  content: string;
  rating?: number;
  productId?: mongoose.Types.ObjectId;
  productName?: string;
  youtubeUrl?: string;
  images?: {
    public_id: string;
    secure_url: string;
    alt?: string;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  moderatorNotes?: string;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  type: {
    type: String,
    enum: ['text', 'video', 'product-review'],
    required: true,
  },
  category: {
    type: String,
    enum: ['health', 'weight-loss', 'business', 'lifestyle', 'transformation'],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  productName: {
    type: String,
    trim: true,
  },
  youtubeUrl: {
    type: String,
    trim: true,
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
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  moderatorNotes: {
    type: String,
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  },
  approvedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
