/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Post {
  id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  excerpt: string;
  body: string;
  authorId: string;
  status: 'draft' | 'published';
  createdAt: number;
  updatedAt: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title?: string;
  rating: number;
  showOnHome: boolean;
  createdAt: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  inquiryType: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: number;
}

export interface Admin {
  id: string;
  email: string;
  role: 'admin';
}

export interface Activity {
  id: string;
  type: 'post' | 'testimonial' | 'message' | 'system';
  action: 'create' | 'update' | 'delete' | 'status_change' | 'received';
  title: string;
  description: string;
  timestamp: any;
  userId?: string;
  userName?: string;
  metadata?: any;
}

export type InquiryType = 
  | 'Individual Coaching' 
  | 'Corporate Training' 
  | 'Speaking / Keynote' 
  | 'Workshop' 
  | 'Book / Podcast' 
  | 'Other';
