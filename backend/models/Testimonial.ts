import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  quote: string;
  name: string;
  title?: string;
  rating: number;
  showOnHome: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  quote: {
    type: String,
    required: [true, 'Quote is required'],
    trim: true,
    maxlength: [2000, 'Quote cannot exceed 2000 characters'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters'],
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  showOnHome: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

TestimonialSchema.index({ showOnHome: 1, createdAt: -1 });

const Testimonial = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
export default Testimonial;
