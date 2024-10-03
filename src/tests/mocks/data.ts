import { EventInput } from "../../types";

export type NullableEventInput<T> = { [P in keyof T]: T[P] | null };

export const validFormData: EventInput = {
  entranceFee: 50,
  eventDate: "2024-10-23",
  location: "Kirehe Stadium",
  name: "John Doe",
  organiser: "EAP",
};
