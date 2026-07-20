import express from 'express';
import { 
  getPosts, getPostsHome, getPostBySlug, createPost, updatePost, deletePost, deletePostsBulk,
  getMessages, createMessage, updateMessageStatus, deleteMessage, deleteMessagesBulk,
  getTestimonials, getTestimonialsHome, createTestimonial, updateTestimonial, deleteTestimonial, deleteTestimonialsBulk,
  getDashboardStats, getActivities, logClientActivity, clearActivities
} from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/posts/home', getPostsHome);
router.get('/posts', getPosts);
router.get('/posts/admin', protect, getPosts);
router.get('/posts/:slug', getPostBySlug);
router.get('/posts/slug/:slug', getPostBySlug);
router.get('/testimonials/home', getTestimonialsHome);
router.post('/messages', createMessage);
router.post('/activities', logClientActivity);

// Protected routes (Admin)
router.use(protect);

router.post('/posts', createPost);
router.patch('/posts/:id', updatePost);
router.delete('/posts/bulk', deletePostsBulk);
router.delete('/posts/:id', deletePost);

router.get('/messages', getMessages);
router.patch('/messages/:id/status', updateMessageStatus);
router.delete('/messages/bulk', deleteMessagesBulk);
router.delete('/messages/:id', deleteMessage);

router.get('/testimonials', getTestimonials);
router.post('/testimonials', createTestimonial);
router.patch('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/bulk', deleteTestimonialsBulk);
router.delete('/testimonials/:id', deleteTestimonial);

router.get('/activities', getActivities);
router.delete('/activities', clearActivities);
router.get('/dashboard/stats', getDashboardStats);

export default router;
