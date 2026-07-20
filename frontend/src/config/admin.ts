/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const ADMIN_PREFIX = import.meta.env.VITE_ADMIN_PATH || 'admin';

export const ADMIN_ROUTES = {
  base: `/${ADMIN_PREFIX}`,
  login: `/${ADMIN_PREFIX}/login`,
  posts: `/${ADMIN_PREFIX}/posts`,
  messages: `/${ADMIN_PREFIX}/messages`,
  testimonials: `/${ADMIN_PREFIX}/testimonials`,
};
