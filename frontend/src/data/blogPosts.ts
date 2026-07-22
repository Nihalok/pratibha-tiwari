/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  category: string;
  readTime: string;
  imageUrl?: string;
}

export const staticBlogPosts: BlogPostData[] = [
  {
    id: "static-1",
    slug: "career-sustainability-in-the-ai-era",
    title: "Career Sustainability in the AI Era",
    category: "Strategic Leadership",
    date: "July 22, 2026",
    readTime: "5m read",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
    excerpt: "How the rapid acceleration of artificial intelligence demands a new blueprint for personal performance, structural career audits, and emotional resilience.",
    body: `
      <p>The dawn of the artificial intelligence era is no longer a future projection—it is our current working reality. As AI systems continuously automate complex analytical and operational workflows, professionals across every tier are left with a critical question: <strong>How do we maintain long-term career sustainability in a landscape defined by constant disruption?</strong></p>

      <h2>The Paradigm Shift: From Cognitive Hard Skills to Human Core Capabilities</h2>
      <p>For decades, career security was built on highly specialized cognitive skills. Coding, contract drafting, financial modeling, and data analytics were the gold standards of professional value. Today, large language models and cognitive agents perform these tasks in seconds. This shift has changed the equation. The competitive edge is no longer what you know, but how you synthesize what you know using uniquely human capabilities.</p>

      <blockquote>"AI won't replace professionals. But professionals who leverage AI and master emotional intelligence will replace those who do not."</blockquote>

      <p>True sustainability requires pivoting to high-leverage qualities that machines cannot emulate: persuasive leadership, structured empathy, executive presence, and emotional resilience. Building these qualities starts with a deep structural audit of your current skill sets.</p>

      <h2>The Pillars of AI-Ready Career Sustainability</h2>
      <ul>
        <li><strong>Adaptive Intelligence (AQ):</strong> The capacity to rapidly unlearn old methodologies and integrate new, collaborative AI tools into your daily workflow.</li>
        <li><strong>Structural Emotional Intelligence (EI):</strong> The capability to navigate organizational complexity, influence stakeholders, and lead cross-cultural teams with absolute clarity and calm.</li>
        <li><strong>Executive Presence and Communication:</strong> Distilling complex cognitive concepts into stories that motivate stakeholders and command authority in high-stakes environments.</li>
      </ul>

      <h2>Audit Your Trajectory: Benchmark Your AI-Readiness</h2>
      <p>Are your professional skills structured for growth, or are they vulnerable to automated obsolescence? Taking a proactive approach to your career trajectory is the first step toward securing your future in the modern digital workspace. Benchmarking yourself against the strategic categories of emotional adaptability, strategic foresight, and cognitive partnership is essential to mapping a sustainable long-term pathway.</p>
    `
  }
];
