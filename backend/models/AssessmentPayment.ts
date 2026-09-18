import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentPayment extends Document {
  paymentId: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp?: string;
  packageId: 'report' | 'platinum';
  packageTitle: string;
  amount: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  assessmentStatus: 'not_started' | 'in_progress' | 'completed';
  reportStatus: 'pending' | 'processing' | 'sent';
  paymentDate?: Date;
  assessmentData?: Record<string, any>;
  submittedAt?: Date;
  reportNotes?: string;
  reportSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentPaymentSchema: Schema = new Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    stripePaymentIntentId: {
      type: String,
      default: ''
    },
    customerName: {
      type: String,
      default: 'Valued Candidate'
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    customerWhatsapp: {
      type: String,
      default: ''
    },
    packageId: {
      type: String,
      enum: ['report', 'platinum'],
      default: 'report'
    },
    packageTitle: {
      type: String,
      default: 'Premium AI Career Intelligence Report'
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'usd'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true
    },
    assessmentStatus: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
      index: true
    },
    reportStatus: {
      type: String,
      enum: ['pending', 'processing', 'sent'],
      default: 'pending',
      index: true
    },
    paymentDate: {
      type: Date
    },
    assessmentData: {
      type: Schema.Types.Mixed,
      default: null
    },
    submittedAt: {
      type: Date
    },
    reportNotes: {
      type: String,
      default: ''
    },
    reportSentAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IAssessmentPayment>('AssessmentPayment', AssessmentPaymentSchema);
