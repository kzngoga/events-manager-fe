import { convertDateForTable } from "../helpers/date";
import { EventItem } from "../types";
import DeleteTableRow from "./DeleteTableRow";
import EditTableRow from "./EditTableRow";
import { SelectedItem } from "./EventsTable";

interface EventsTableRowProps {
  selectedItem: SelectedItem | null;
  setSelectedItem: (item: SelectedItem | null) => void;
  item: EventItem;
  idx: number;
}

const EventsTableRow = ({
  selectedItem,
  item,
  idx,
  setSelectedItem,
}: EventsTableRowProps) => {
  if (selectedItem?.id === item.id && selectedItem?.actionType === "edit") {
    return (
      <EditTableRow
        key={item?.id}
        idx={idx}
        item={item}
        setSelectedItem={setSelectedItem}
      />
    );
  } else if (
    selectedItem?.id === item?.id &&
    selectedItem?.actionType === "delete"
  ) {
    return (
      <DeleteTableRow
        key={item?.id}
        idx={idx}
        item={item}
        setSelectedItem={setSelectedItem}
      />
    );
  }
  return (
    <tr key={item?.id}>
      <td>{idx + 1}</td>
      <td>{item.name}</td>
      <td>{item.organiser}</td>
      <td>{item.location}</td>
      <td>{convertDateForTable(item.eventDate)}</td>
      <td>{item.entranceFee}</td>
      <td>
        <button
          className="edit-btn"
          onClick={() =>
            setSelectedItem({
              actionType: "edit",
              id: item?.id as string,
            })
          }
        >
          Edit
        </button>
        <button
          className="delete-btn"
          onClick={() =>
            setSelectedItem({
              actionType: "delete",
              id: item?.id as string,
            })
          }
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default EventsTableRow;
