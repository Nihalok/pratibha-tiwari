import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  email: string;
  password: string;
  role: 'admin';
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    select: false, // Don't return password by default in queries
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Static helper methods (kept compatible with existing controller code)
export class AdminHelper {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  static async matchPassword(enteredPassword: string, storedHash: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, storedHash);
  }
}

const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;
