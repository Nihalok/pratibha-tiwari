/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import bookCoachCover from '../assets/images/books/own-coach.jpg';
import bookMotivationalDiet from '../assets/images/books/motivational-diet.jpg';
import bookBlueprint from '../assets/images/books/career-blueprint.jpg';
import globalbook from '../assets/images/books/global voice.jpg';

export interface Book {
  title: string;
  subtitle: string;
  desc: string;
  detailedDesc?: string;
  link: string;
  image: string;
  color: string;
  tag: string;
  highlights: string[];
}

export const books: Book[] = [
  {
    title: "Motivational Diet for 369 Days (2022)",
    subtitle: "Daily Transformation Journey",
    desc: "Transformation doesn't happen overnight—it happens one day at a time.",
    detailedDesc: "This daily motivational companion offers 369 powerful reflections to help you build resilience, stay inspired, strengthen your mindset, and create positive habits that support lasting personal growth.",
    link: "https://amzn.eu/d/07iAPvGQ",
    image: bookMotivationalDiet,
    color: "#121212",
    tag: "Daily Wisdom",
    highlights: ["Daily Reflections", "Resilience", "Mindset Building"]
  },
  {
    title: "Design Success Blueprint & Be Your Own Coach (2024)",
    subtitle: "Your Dream Career Strategy",
    desc: "Your dream career begins with clarity, confidence, and the right strategy. This practical career guide helps you discover your core values, beliefs, strengths, and passions to identify a career path that truly aligns with your purpose.",
    detailedDesc: "Learn how to build a powerful personal brand through LinkedIn, create an ATS-friendly CV that attracts recruiters, prepare for job interviews with confidence, and develop the mindset needed to succeed in today’s competitive job market. From finding your passion to securing your dream job, this book provides step-by-step guidance to help you build a meaningful and successful career with confidence.",
    link: "https://a.co/d/01FFAOIX",
    image: bookBlueprint,
    color: "#1C1C2E",
    tag: "Latest Release",
    highlights: ["Career Strategy", "Personal Branding", "Interview Mastery"]
  },
  {
    title: "Balance Your Emotion & Be Your Own Coach (2019)",
    subtitle: "Emotional Intelligence Foundation",
    desc: "Emotional intelligence is the foundation of meaningful leadership and personal fulfilment.",
    detailedDesc: "This transformational book provides practical tools to help readers manage emotions, build self-awareness, overcome limiting beliefs, and become the coach of their own life's journey.",
    link: "https://www.amazon.ae/dp/1646505565",
    image: bookCoachCover,
    color: "#0F172A",
    tag: "Foundational",
    highlights: ["Emotional Mastery", "Self-Awareness", "Personal Fulfillment"]
  },
{
    title: "Global Voices",
    subtitle: "Inspirational Stories from Toastmasters Worldwide",
    desc: "A curated collection of transformative journeys and empowering narratives from global communicators and leaders.",
    detailedDesc: "Co-compiled by Pratibha Tiwari, this powerful anthology brings together diverse voices from Toastmasters across the globe. It celebrates the profound impact of effective communication, resilience, and leadership, offering readers a global perspective on personal and professional growth.",
    link: "https://mail.google.com/mail/u/0/?fs=1&to=designsuperdestiny@gmail.com&tf=cm", // Update this with the exact link if you have it
    image: globalbook, // Make sure this variable points to image_e3cc22.jpg in your imports
    color: "#822424", // Matched to the maroon/dark red title text on the cover
    tag: "Anthology",
    highlights: ["Public Speaking", "Leadership Journeys", "Global Perspectives"]
  }
];
