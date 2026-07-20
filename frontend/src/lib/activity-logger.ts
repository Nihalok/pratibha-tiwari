/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActivityType = 'post' | 'testimonial' | 'message' | 'system';
export type ActivityAction = 'create' | 'update' | 'delete' | 'status_change' | 'received';

interface LogActivityParams {
  type: ActivityType;
  action: ActivityAction;
  title: string;
  description: string;
  userId?: string;
  userName?: string;
  metadata?: any;
}

export const logActivity = async (params: LogActivityParams) => {
  try {
    const response = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      // Activity logging failed silently
    }
  } catch (_error) {
    // Activity logging error — non-critical, ignored
  }
};
