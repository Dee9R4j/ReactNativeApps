/**
 * Events domain models
 */
export interface FestEvent {
  id: number;
  name: string;
  date_time: string;
  description: string;
  categories: string[];
  venue_name: string;
  organiser: string;
  bookmark: boolean;
  is_live: boolean;
}
