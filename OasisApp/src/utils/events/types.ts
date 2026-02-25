export interface IDateTimeParts {
  year: number;
  month: string;   
  day: string;     
  hours: string;   
  minutes: string;
  seconds: string; 
  date: string;    
  time24:string;
  time12:string;
}

import type { FestEvent } from "@/models/events.models";

// Re-export FestEvent as Event and IEventProps for type compatibility
export type Event = FestEvent;
export type IEventProps = FestEvent;
