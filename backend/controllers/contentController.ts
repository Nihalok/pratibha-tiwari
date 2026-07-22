import Post from '../models/Post.js';
import Message from '../models/Message.js';
import Testimonial from '../models/Testimonial.js';
import Activity from '../models/Activity.js';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import { uploadImage } from '../utils/imageUploader.js';
import nodemailer from 'nodemailer';

// Posts
export const getPosts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const selectQuery = (req as any).admin ? '' : '-body';
  const posts = await Post.find().select(selectQuery).sort({ createdAt: -1 }).lean();

  res.status(200).json({ success: true, count: posts.length, data: posts });
});

export const getPostsHome = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const posts = await Post.find({ status: 'published' })
    .select('-body')
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  res.status(200).json({ success: true, count: posts.length, data: posts });
});

export const getPostBySlug = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const post = await Post.findOne({ slug: req.params.slug }).lean();

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  res.status(200).json({ success: true, data: post });
});

export const createPost = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  let featuredImage = req.body.featuredImage;
  if (featuredImage) {
    featuredImage = await uploadImage(featuredImage, 'posts');
  }

  const postData = {
    ...req.body,
    featuredImage,
    authorId: req.admin.id || req.admin._id,
  };

  const post = await Post.create(postData);

  await Activity.create({
    type: 'post',
    action: 'create',
    title: req.body.title,
    description: 'New blog post created',
    timestamp: new Date(),
  });

  res.status(201).json({ success: true, data: post });
});

export const updatePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  let featuredImage = req.body.featuredImage;
  if (featuredImage && featuredImage !== post.featuredImage) {
    featuredImage = await uploadImage(featuredImage, 'posts');
    req.body.featuredImage = featuredImage;
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await Activity.create({
    type: 'post',
    action: 'update',
    title: req.body.title || post?.title,
    description: `Blog post ${req.body.status ? 'status updated' : 'updated'}`,
    timestamp: new Date(),
  });

  res.status(200).json({ success: true, data: post });
});

export const deletePost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  await Post.findByIdAndDelete(req.params.id);

  await Activity.create({
    type: 'post',
    action: 'delete',
    title: post.title,
    description: 'Blog post deleted',
    timestamp: new Date(),
  });

  res.status(200).json({ success: true, data: {} });
});

export const deletePostsBulk = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { ids, all } = req.body;

  if (all === true) {
    await Post.deleteMany({});
    await Activity.create({
      type: 'post',
      action: 'delete',
      title: 'All Posts',
      description: 'All posts deleted in bulk',
      timestamp: new Date(),
    });
    return res.status(200).json({ success: true, message: 'All posts deleted successfully' });
  }

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid or empty IDs array' });
  }

  await Post.deleteMany({ _id: { $in: ids } });
  await Activity.create({
    type: 'post',
    action: 'delete',
    title: `${ids.length} Posts`,
    description: `${ids.length} posts deleted in bulk`,
    timestamp: new Date(),
  });

  res.status(200).json({ success: true, message: `${ids.length} posts deleted successfully` });
});

// Messages
export const getMessages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const messages = await Message.find().sort({ createdAt: -1 }).lean();

  res.status(200).json({ success: true, count: messages.length, data: messages });
});

const escapeHTML = (str: string): string => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const createMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const name = escapeHTML(req.body.name || '');
  const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
  const phone = escapeHTML(req.body.phone || '');
  const country = escapeHTML(req.body.country || '');
  const inquiryType = escapeHTML(req.body.inquiryType || '');
  const messageText = escapeHTML(req.body.message || '');

  const messageData = {
    name,
    email,
    phone,
    country,
    inquiryType,
    message: messageText,
    status: 'unread' as const,
  };

  const message = await Message.create(messageData);

  await Activity.create({
    type: 'message',
    action: 'received',
    title: `From: ${name}`,
    description: 'New contact form message received',
    timestamp: new Date(),
  });

  // Send email notification to admin asynchronously (non-blocking)
  const sendEmailNotification = async () => {
    const recipient = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || '';
    console.log(`[Email Debug] Inbound message received from ${name}. Sending alert to recipient: ${recipient}`);
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      if (!recipient) {
        console.log('[Email Debug] No recipient found, skipping email notification.');
        return;
      }

      const htmlMessage = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f9fc; margin: 0; padding: 20px; color: #333333; }
            .container { max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e1e8ed; margin: 0 auto; }
            .header { background-color: #0A1929; padding: 30px; text-align: center; color: #ffffff; }
            .header h2 { margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: normal; letter-spacing: 1px; }
            .header p { margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #b8974a; font-weight: bold; }
            .content { padding: 40px 30px; }
            .lead { font-size: 16px; margin-bottom: 25px; line-height: 1.6; }
            .info-card { background-color: #f8fafc; border-left: 4px solid #b8974a; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px; }
            .info-item { margin-bottom: 12px; font-size: 14px; line-height: 1.5; }
            .info-item strong { color: #0A1929; width: 120px; display: inline-block; }
            .message-box { background-color: #f1f5f9; border-radius: 8px; padding: 20px; font-size: 14px; line-height: 1.6; border: 1px solid #e2e8f0; font-style: italic; color: #475569; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; background-color: #f8fafc; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Pratibha Tiwari</h2>
              <p>New Inbound Message</p>
            </div>
            <div class="content">
              <p class="lead">Hello Admin,</p>
              <p class="lead">You have received a new inquiry from the contact form. Here are the details:</p>
              
              <div class="info-card">
                <div class="info-item"><strong>Client Name:</strong> ${name}</div>
                <div class="info-item"><strong>Email Address:</strong> ${email}</div>
                <div class="info-item"><strong>Phone Number:</strong> ${phone || 'N/A'}</div>
                <div class="info-item"><strong>Country/Region:</strong> ${country || 'N/A'}</div>
                <div class="info-item"><strong>Inquiry Type:</strong> ${inquiryType || 'General Inquiry'}</div>
              </div>
              
              <div class="message-box">
                "${messageText}"
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Pratibha Tiwari. All rights reserved.</p>
              <p>This is an automated system notification from your website.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const plainTextMessage = `
New Inbound Inquiry from Pratibha Tiwari Website:

Name: ${name}
Email Address: ${email}
Phone Number: ${phone || 'N/A'}
Country/Region: ${country || 'N/A'}
Inquiry Type: ${inquiryType || 'General Inquiry'}

Message:
"${messageText}"

---
This is an automated system notification from your website.
      `.trim();

      await transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'Pratibha Tiwari Admin'}" <${process.env.FROM_EMAIL}>`,
        to: recipient,
        replyTo: email,
        subject: `New Inquiry from ${name} (${inquiryType})`,
        text: plainTextMessage,
        html: htmlMessage
      });
      console.log(`[Email] Notification sent successfully to admin for message from ${name}`);
    } catch (err: any) {
      console.error(`[Email] Failed to send contact notification email:`, err.message);
    }
  };

  await sendEmailNotification();

  res.status(201).json({ success: true, data: message });
});

export const updateMessageStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  // Security: Only allow valid status values
  const validStatuses = ['read', 'unread'];
  if (!validStatuses.includes(req.body.status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  message.status = req.body.status;
  await message.save();

  await Activity.create({
    type: 'message',
    action: 'status_change',
    title: message.name,
    description: `Message marked as ${req.body.status}`,
    timestamp: new Date(),
  });

  res.status(200).json({ success: true, data: { id: req.params.id, status: req.body.status } });
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }

  await Message.findByIdAndDelete(req.params.id);

  await Activity.create({
    type: 'message',
    action: 'delete',
    title: message.name,
    description: 'Message deleted',
    timestamp: new Date(),
  });

  res.status(200).json({ success: true, data: {} });
});

export const deleteMessagesBulk = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { ids, all } = req.body;

  if (all === true) {
    await Message.deleteMany({});
    await Activity.create({
      type: 'message',
      action: 'delete',
      title: 'All Messages',
      description: 'All messages deleted in bulk',
      timestamp: new Date(),
    });
    return res.status(200).json({ success: true, message: 'All messages deleted successfully' });
  }

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid or empty IDs array' });
  }

  await Message.deleteMany({ _id: { $in: ids } });
  await Activity.create({
    type: 'message',
    action: 'delete',
    title: `${ids.length} Messages`,
    description: `${ids.length} messages deleted in bulk`,
    timestamp: new Date(),
  });

  res.status(200).json({ success: true, message: `${ids.length} messages deleted successfully` });
});

// Testimonials
export const getTestimonials = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();

  res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
});

export const getTestimonialsHome = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const testimonials = await Testimonial.find({ showOnHome: true })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
});

export const createTestimonial = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let image = req.body.image;
  if (image) {
    image = await uploadImage(image, 'testimonials');
  }

  const testimonialData = {
    ...req.body,
    image,
  };

  const testimonial = await Testimonial.create(testimonialData);

  await Activity.create({
    type: 'testimonial',
    action: 'create',
    title: req.body.name,
    description: 'New testimonial added',
    timestamp: new Date(),
  });

  res.status(201).json({ success: true, data: testimonial });
});

export const updateTestimonial = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }

  let image = req.body.image;
  if (image && image !== testimonial.image) {
    image = await uploadImage(image, 'testimonials');
    req.body.image = image;
  }

  testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await Activity.create({
    type: 'testimonial',
    action: 'status_change',
    title: testimonial?.name,
    description: 'Testimonial visibility updated',
    timestamp: new Date(),
  });

  res.status(200).json({ success: true, data: testimonial });
});

export const deleteTestimonial = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }

  await Testimonial.findByIdAndDelete(req.params.id);

  await Activity.create({
    type: 'testimonial',
    action: 'delete',
    title: testimonial.name,
    description: 'Testimonial deleted',
    timestamp: new Date(),
  });

  res.status(200).json({ success: true, data: {} });
});

export const deleteTestimonialsBulk = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { ids, all } = req.body;

  if (all === true) {
    await Testimonial.deleteMany({});
    await Activity.create({
      type: 'testimonial',
      action: 'delete',
      title: 'All Testimonials',
      description: 'All testimonials deleted in bulk',
      timestamp: new Date(),
    });
    return res.status(200).json({ success: true, message: 'All testimonials deleted successfully' });
  }

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid or empty IDs array' });
  }

  await Testimonial.deleteMany({ _id: { $in: ids } });
  await Activity.create({
    type: 'testimonial',
    action: 'delete',
    title: `${ids.length} Testimonials`,
    description: `${ids.length} testimonials deleted in bulk`,
    timestamp: new Date(),
  });

  res.status(200).json({ success: true, message: `${ids.length} testimonials deleted successfully` });
});

// Activities
export const getActivities = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const activities = await Activity.find().sort({ timestamp: -1 }).limit(50).lean();

  res.status(200).json({ success: true, count: activities.length, data: activities });
});

export const clearActivities = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await Activity.deleteMany({});
  res.status(200).json({ success: true, message: 'Activity log cleared successfully' });
});

export const logClientActivity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const activityData = {
    ...req.body,
    timestamp: new Date(),
  };
  const activity = await Activity.create(activityData);
  res.status(201).json({ success: true, data: activity });
});

// Dashboard Stats
export const getDashboardStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const [postCount, unreadMessages, testimonialCount, recentActivities] = await Promise.all([
    Post.countDocuments(),
    Message.countDocuments({ status: 'unread' }),
    Testimonial.countDocuments(),
    Activity.find().sort({ timestamp: -1 }).limit(10).lean(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      postCount,
      unreadMessages,
      testimonialCount,
      recentActivities
    }
  });
});
