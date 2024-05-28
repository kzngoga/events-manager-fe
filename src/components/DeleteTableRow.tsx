import { useEffect } from "react";
import useAppContext from "../hooks/useAppContext";
import { deleteAnEvent, fetchAllEvents } from "../store/actions/events";
import { EventItem } from "../types";
import { SelectedItem } from "./EventsTable";
import { convertDateForTable } from "../helpers/date";

const DeleteTableRow = ({
  item,
  idx,
  setSelectedItem,
}: {
  item: EventItem;
  idx: number;
  setSelectedItem: (item: SelectedItem | null) => void;
}) => {
  const {
    state: { deleteEvent },
    dispatch,
  } = useAppContext();

  const handleDelete = () => {
    deleteAnEvent(dispatch, item?.id as string);
  };

  useEffect(() => {
    if (deleteEvent.status === "success") {
      setSelectedItem(null);
      fetchAllEvents(dispatch);
    }
  }, [deleteEvent.status, dispatch, setSelectedItem]);

  return (
    <tr key={item.id}>
      <td>{idx + 1}</td>
      <td>{item.name}</td>
      <td>{item.organiser}</td>
      <td>{item.location}</td>
      <td>{convertDateForTable(item.eventDate)}</td>
      <td>{item.entranceFee}</td>
      <td>
        <button
          className="success-btn"
          disabled={deleteEvent.status === "loading"}
          onClick={handleDelete}
        >
          Confirm
        </button>
        <button
          className="delete-btn"
          disabled={deleteEvent.status === "loading"}
          onClick={() => setSelectedItem(null)}
        >
          Cancel
        </button>
      </td>
    </tr>
  );
};

export default DeleteTableRow;
