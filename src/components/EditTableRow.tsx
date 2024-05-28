import React, { useEffect, useMemo, useState } from "react";
import { EventInput, EventItem } from "../types";
import { SelectedItem } from "./EventsTable";
import { convertDateForInput } from "../helpers/date";
import { editAnEvent, fetchAllEvents } from "../store/actions/events";
import useAppContext from "../hooks/useAppContext";

const EditTableRow = ({
  item,
  idx,
  setSelectedItem,
}: {
  item: EventItem;
  idx: number;
  setSelectedItem: (item: SelectedItem | null) => void;
}) => {
  const {
    state: { editEvent },
    dispatch,
  } = useAppContext();

  const [eventForm, setEventForm] = useState<EventInput>({} as EventInput);

  const handleChange = (field: string, value: string | number | null) => {
    setEventForm({ ...eventForm, [field]: value });
  };

  useEffect(() => {
    if (eventForm) {
      setEventForm({
        entranceFee: item.entranceFee,
        eventDate: convertDateForInput(item.eventDate),
        location: item.location,
        name: item.name,
        organiser: item.organiser,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const minDate = new Date();
  // set min date to next day
  minDate.setDate(minDate.getDate() + 2);
  const convertedDate = convertDateForInput(minDate.getTime());

  const isValid = useMemo(() => {
    return Object.values(eventForm).every((value) => value);
  }, [eventForm]);

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: EventItem = {
      ...eventForm,
      eventDate: new Date(eventForm.eventDate).getTime(),
    };
    editAnEvent(dispatch, payload, item.id as string);
  };

  useEffect(() => {
    if (editEvent.status === "success") {
      setSelectedItem(null);
      fetchAllEvents(dispatch);
    }
  }, [editEvent.status, setSelectedItem, dispatch]);

  return (
    <tr key={item.id}>
      <td>{idx + 1}</td>
      <td>
        <input
          required
          type="text"
          value={eventForm.name}
          placeholder="Event name"
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </td>
      <td>
        <input
          required
          type="text"
          value={eventForm.organiser}
          placeholder="Event organiser"
          onChange={(e) => handleChange("organiser", e.target.value)}
        />
      </td>
      <td>
        <input
          required
          type="text"
          value={eventForm.location}
          placeholder="Event location"
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </td>
      <td>
        <input
          required
          type="date"
          value={eventForm.eventDate as string}
          placeholder="Event date"
          min={convertedDate}
          onChange={(e) => handleChange("eventDate", e.target.value)}
        />
      </td>
      <td>
        <input
          required
          type="number"
          value={eventForm.entranceFee}
          placeholder="Entrance Fee"
          onChange={(e) => handleChange("entranceFee", e.target.value)}
        />
      </td>
      <td>
        <button
          onClick={handleEdit}
          disabled={!isValid || editEvent.status === "loading"}
        >
          Save
        </button>
        <button
          className="delete-btn"
          onClick={() => setSelectedItem(null)}
          disabled={editEvent.status === "loading"}
        >
          Close
        </button>
      </td>
    </tr>
  );
};

export default EditTableRow;
