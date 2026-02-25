/**
 * Professional Shows domain models
 */
export interface ProfShow {
  id: number;
  name: string;
  artist: string;
  date_time: string;
  venue: string;
  description: string;
  image_url: string;
  ticket_price: number;
  available_seats: number;
}
