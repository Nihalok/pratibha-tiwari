import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  excerpt?: string;
  body: string;
  authorId: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Post slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  featuredImage: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  excerpt: {
    type: String,
    trim: true,
    maxlength: [500, 'Excerpt cannot exceed 500 characters'],
  },
  body: {
    type: String,
    required: [true, 'Post body is required'],
    maxlength: [500000, 'Body cannot exceed 500,000 characters'],
  },
  authorId: {
    type: String,
    required: [true, 'Author ID is required'],
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
}, {
  timestamps: true,
});

// Index for common queries
PostSchema.index({ status: 1, createdAt: -1 });

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;
