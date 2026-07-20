import Testimonial from '../models/Testimonial.js';

const initialTestimonials = [
  {
    name: "Dr. Ahmed Mansoor",
    title: "Senior Executive, Healthcare",
    quote: "Pratibha's approach to emotional intelligence transformed how our leadership team communicates. Her insights into the UAE corporate landscape are unparalleled.",
    rating: 5,
    showOnHome: true,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
  },
  {
    name: "Sarah Al-Qasimi",
    title: "Venture Partner",
    quote: "The 'Strategic Blueprint' isn't just a book; it's a structural audit for your professional life. Working with Pratibha was the best investment in my career.",
    rating: 5,
    showOnHome: true,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
  },
  {
    name: "Marcus Thorne",
    title: "Managing Director, Tech Solutions",
    quote: "Her ability to distill complex human dynamics into actionable strategies is remarkable. We saw immediate improvements in team cohesion and performance.",
    rating: 5,
    showOnHome: true,
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
  },
  {
    name: "Elena Rodriguez",
    title: "Chief Operations Officer",
    quote: "As a woman in leadership, Pratibha's mentoring on executive presence was game-changing. I finally found my authentic global voice.",
    rating: 5,
    showOnHome: true,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
  },
  {
    name: "James Wilson",
    title: "Founder, Fintech Start-up",
    quote: "The Motivational Diet provided the resilience I needed during our Series A funding. Pratibha is truly a visionary leadership strategist.",
    rating: 5,
    showOnHome: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  }
];

export const seedTestimonials = async () => {
  try {
    // Check if the testimonials collection has any documents
    const count = await Testimonial.countDocuments();
    if (count > 0) {
      console.log('[Seed] Testimonials collection is not empty. Skipping seeding.');
      return;
    }

    for (const t of initialTestimonials) {
      await Testimonial.create(t);
      console.log(`[Seed] Testimonial for "${t.name}" created.`);
    }
  } catch (err: any) {
    console.error('[Seed] Failed to seed testimonials:', err.message);
  }
};
