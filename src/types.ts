export interface EventItem {
  name: string;
  location: string;
  eventDate: number;
  entranceFee: number;
  organiser: string;
  id?: string;
}

export interface EventInput {
  name: string;
  location: string;
  eventDate: string;
  entranceFee: number;
  organiser: string;
}
