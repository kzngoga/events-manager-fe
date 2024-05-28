import { EventItem } from "../../types";
import { DispatchAction } from "../AppContext";
import { ActionTypes } from "../AppReducer";
import AxiosClient from "../AxiosClient";

export const fetchAllEvents = async (dispatch: DispatchAction) => {
  try {
    // Reset events
    dispatch({
      type: ActionTypes.FETCH_ALL_EVENTS,
      payload: {
        status: "loading",
        data: [],
      },
    });
    dispatch({
      type: ActionTypes.ADD_NEW_EVENT,
      payload: {
        status: "idle",
      },
    });
    dispatch({
      type: ActionTypes.DELETE_EVENT,
      payload: {
        status: "idle",
      },
    });
    dispatch({
      type: ActionTypes.UPDATE_EVENT,
      payload: {
        status: "idle",
      },
    });

    const response = await AxiosClient().get("/events/all");
    dispatch({
      type: ActionTypes.FETCH_ALL_EVENTS,
      payload: {
        status: "success",
        data: response.data.data,
      },
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.FETCH_ALL_EVENTS,
      payload: {
        status: "error",
        data: [],
      },
    });
  }
};

export const createNewEvent = async (
  dispatch: DispatchAction,
  body: EventItem
) => {
  try {
    // Reset events
    dispatch({
      type: ActionTypes.ADD_NEW_EVENT,
      payload: {
        status: "loading",
      },
    });

    await AxiosClient().post("/events/new", body);
    dispatch({
      type: ActionTypes.ADD_NEW_EVENT,
      payload: {
        status: "success",
      },
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.ADD_NEW_EVENT,
      payload: {
        status: "error",
      },
    });
  }
};

export const editAnEvent = async (
  dispatch: DispatchAction,
  body: EventItem,
  id: string
) => {
  try {
    // Reset events
    dispatch({
      type: ActionTypes.UPDATE_EVENT,
      payload: {
        status: "loading",
      },
    });

    await AxiosClient().put(`/events/update/${id}`, body);
    dispatch({
      type: ActionTypes.UPDATE_EVENT,
      payload: {
        status: "success",
      },
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.UPDATE_EVENT,
      payload: {
        status: "error",
      },
    });
  }
};

export const deleteAnEvent = async (dispatch: DispatchAction, id: string) => {
  try {
    // Reset events
    dispatch({
      type: ActionTypes.DELETE_EVENT,
      payload: {
        status: "loading",
      },
    });

    await AxiosClient().delete(`/events/delete/${id}`);
    dispatch({
      type: ActionTypes.DELETE_EVENT,
      payload: {
        status: "success",
      },
    });
  } catch (error) {
    dispatch({
      type: ActionTypes.DELETE_EVENT,
      payload: {
        status: "error",
      },
    });
  }
};
