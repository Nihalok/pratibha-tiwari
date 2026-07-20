import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  inquiryType?: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [30, 'Phone cannot exceed 30 characters'],
  },
  country: {
    type: String,
    trim: true,
    maxlength: [100, 'Country cannot exceed 100 characters'],
  },
  inquiryType: {
    type: String,
    trim: true,
    maxlength: [100, 'Inquiry type cannot exceed 100 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [10000, 'Message cannot exceed 10,000 characters'],
  },
  status: {
    type: String,
    enum: ['read', 'unread'],
    default: 'unread',
  },
}, {
  timestamps: true,
});

MessageSchema.index({ status: 1, createdAt: -1 });

const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
