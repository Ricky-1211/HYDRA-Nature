import mongoose, { Document, Schema } from 'mongoose';

export interface ICareer extends Document {
  title: string;
  slug: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Hybrid';
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema = new Schema<ICareer>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: 'Bhubaneswar, India / Hybrid',
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Remote', 'Hybrid'],
      default: 'Full-time',
    },
    experience: {
      type: String,
      default: '2-4 Years',
    },
    description: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [
        'Competitive Salary & Stock Options',
        'Health & Skincare Allowance',
        'Flexible Hybrid Work Culture',
        'Learning & Conference Stipend',
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

CareerSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

export const Career = mongoose.model<ICareer>('Career', CareerSchema);
