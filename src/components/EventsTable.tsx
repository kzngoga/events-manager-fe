import { ReactNode, useEffect, useState } from "react";
import { fetchAllEvents } from "../store/actions/events";
import useAppContext from "../hooks/useAppContext";
import EventsTableRow from "./EventsTableRow";

export interface SelectedItem {
  actionType: "edit" | "delete";
  id: string;
}

const EventsTable = () => {
  const {
    dispatch,
    state: { events },
  } = useAppContext();

  useEffect(() => {
    fetchAllEvents(dispatch);
  }, [dispatch]);

  const { status, data: eventsData } = events;

  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const DisplayData = ({ children }: { children: ReactNode }) => {
    if (status === "loading" && !eventsData.length) {
      return (
        <tr>
          <th className="table-info" colSpan={6}>
            Loading users...
          </th>
        </tr>
      );
    } else if (status === "error" && !eventsData.length) {
      return (
        <tr>
          <th className="table-info" colSpan={6}>
            No users found!
          </th>
        </tr>
      );
    }

    return children;
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Organiser</th>
            <th>Location</th>
            <th>Event Date</th>
            <th>Entrance fee</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <DisplayData>
            {eventsData.map((item, idx) => (
              <EventsTableRow
                key={item.id}
                item={item}
                idx={idx}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            ))}
          </DisplayData>
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
