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

export const staticBlogPosts: BlogPostData[] = [];
