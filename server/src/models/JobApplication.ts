import mongoose, { Document, Schema } from 'mongoose';

export interface IJobApplication extends Document {
  career: mongoose.Types.ObjectId;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  portfolioUrl?: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'Received' | 'Under Review' | 'Shortlisted' | 'Accepted' | 'Hired' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    career: {
      type: Schema.Types.ObjectId,
      ref: 'Career',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    fullName: {
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
      required: true,
      trim: true,
    },
    portfolioUrl: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Received', 'Under Review', 'Shortlisted', 'Accepted', 'Hired', 'Rejected'],
      default: 'Received',
    },
  },
  {
    timestamps: true,
  }
);

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
