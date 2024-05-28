import { Reducer } from "react";
import { EventItem } from "../types";

export interface AppState {
  events: {
    status: string;
    data: EventItem[];
  };
  newEvent: {
    status: string;
  };
  deleteEvent: {
    status: string;
  };
  editEvent: {
    status: string;
  };
}

// Initial state
export const initialState: AppState = {
  events: {
    status: "idle",
    data: [],
  },
  newEvent: {
    status: "idle",
  },
  deleteEvent: {
    status: "idle",
  },
  editEvent: {
    status: "idle",
  },
};

export enum ActionTypes {
  FETCH_ALL_EVENTS = "FETCH_ALL_EVENTS",
  ADD_NEW_EVENT = "ADD_NEW_EVENT",
  UPDATE_EVENT = "UPDATE_EVENT",
  DELETE_EVENT = "DELETE_EVENT",
}

export interface Action {
  type: ActionTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

export const reducer: Reducer<AppState, Action> = (state, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_ALL_EVENTS:
      return { ...state, events: action.payload };
    case ActionTypes.ADD_NEW_EVENT:
      return { ...state, newEvent: action.payload };
    case ActionTypes.DELETE_EVENT:
      return { ...state, deleteEvent: action.payload };
    case ActionTypes.UPDATE_EVENT:
      return { ...state, editEvent: action.payload };
    default:
      return state;
  }
};
