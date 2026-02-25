/**
 * Stub notification slice — types for notifications screen
 */
export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  order_id: number | null;
  new_status: number | null;
  old_status: number | null;
  is_read: boolean;
  created_at: string;
  url?: string | null;
}
