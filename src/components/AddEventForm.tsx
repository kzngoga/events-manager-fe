import useAppContext from "../hooks/useAppContext";
import { createNewEvent, fetchAllEvents } from "../store/actions/events";
import { EventInput, EventItem } from "../types";
import { convertDateForInput } from "../helpers/date";
import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_VALUES: EventInput = {
  entranceFee: 0,
  eventDate: "",
  location: "",
  name: "",
  organiser: "",
};

const AddEventForm = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState<EventInput>(DEFAULT_VALUES);

  const {
    dispatch,
    state: { newEvent },
  } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: EventItem = {
      ...eventForm,
      eventDate: new Date(eventForm.eventDate as string).getTime(),
    };

    createNewEvent(dispatch, payload);
  };

  useEffect(() => {
    if (newEvent.status === "success") {
      setEventForm(DEFAULT_VALUES);
      setShowEventForm(false);
      fetchAllEvents(dispatch);
    }
  }, [newEvent.status, dispatch]);

  const handleChange = (field: string, value: string | number | null) => {
    setEventForm({ ...eventForm, [field]: value });
  };

  const minDate = new Date();
  // set min date to next day
  minDate.setDate(minDate.getDate() + 2);
  const convertedDate = convertDateForInput(minDate.getTime());

  const isValid = useMemo(() => {
    return Object.values(eventForm).every((value) => value);
  }, [eventForm]);

  return (
    <div className="event-form">
      <div className={`event-form__header ${showEventForm ? "form-open" : ""}`}>
        <h4 className="event-form__title">Add new Event</h4>

        {showEventForm ? (
          <button
            className="event-form__header-btn btn--close"
            onClick={() => setShowEventForm(false)}
            disabled={newEvent.status === "loading"}
          >
            Close
          </button>
        ) : (
          <button
            className="event-form__header-btn"
            onClick={() => setShowEventForm(true)}
          >
            Add
          </button>
        )}
      </div>

      {showEventForm && (
        <div className="event-form__content">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="event-form__group">
                <label className="hint">Event name</label>
                <input
                  required
                  type="text"
                  value={eventForm.name}
                  placeholder="Event name"
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div className="event-form__group">
                <label className="hint">Event location</label>
                <input
                  required
                  type="text"
                  value={eventForm.location}
                  placeholder="Event location"
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
              <div className="event-form__group">
                <label className="hint">Entrance fee</label>
                <input
                  required
                  type="number"
                  value={eventForm.entranceFee}
                  placeholder="Entrance fee"
                  onChange={(e) => handleChange("entranceFee", e.target.value)}
                />
              </div>
              <div className="event-form__group">
                <label className="hint">Event organiser</label>
                <input
                  required
                  type="text"
                  placeholder="Event organiser"
                  value={eventForm.organiser}
                  onChange={(e) => handleChange("organiser", e.target.value)}
                />
              </div>
              <div className="event-form__group">
                <label className="hint">Event date</label>
                <input
                  required
                  type="date"
                  value={eventForm.eventDate}
                  min={convertedDate}
                  onChange={(e) => handleChange("eventDate", e.target.value)}
                />
              </div>
            </div>

            <div className="event-form__save">
              <button disabled={!isValid || newEvent.status === "loading"}>
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddEventForm;
