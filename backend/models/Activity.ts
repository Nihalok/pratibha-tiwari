import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  type: 'post' | 'testimonial' | 'message' | 'system';
  action: 'create' | 'update' | 'delete' | 'status_change' | 'received';
  title: string;
  description?: string;
  timestamp: Date;
}

const ActivitySchema = new Schema<IActivity>({
  type: {
    type: String,
    enum: ['post', 'testimonial', 'message', 'system'],
    required: [true, 'Activity type is required'],
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'status_change', 'received'],
    required: [true, 'Activity action is required'],
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true,
    maxlength: [500, 'Title cannot exceed 500 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Auto-expire old activities after 90 days to keep the collection lean
ActivitySchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
ActivitySchema.index({ timestamp: -1 });

const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
export default Activity;
