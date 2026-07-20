/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const calculateReadTime = (content: string | undefined): string => {
  if (!content) return '1 min read';
  const wordsPerMinute = 225; // Average adult reading speed
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
};
