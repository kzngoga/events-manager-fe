import {
  getAllByRole,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import EventsTable from "../../components/EventsTable";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { EventItem } from "../../types";
import { convertDateForTable } from "../../helpers/date";
import { simulateGetError } from "../utils";

describe("EventsTable", () => {
  const events: EventItem[] = [];

  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const event = db.event.create();
      events.push(event);
    });
  });

  afterAll(() => {
    const eventIds = events.map((event) => event.id!);
    db.event.deleteMany({ where: { id: { in: eventIds } } });
  });

  const renderComponent = () => {
    render(<EventsTable />, { wrapper: AllProviders });

    return {
      getLoadingText: () => screen.queryByText(/loading/i),
    };
  };

  it("Should render the events in the table", async () => {
    const { getLoadingText } = renderComponent();

    await waitForElementToBeRemoved(getLoadingText);

    const tbody = screen.getAllByRole("rowgroup")[1];
    const tableRows = getAllByRole(tbody, "row");

    expect(tableRows).toHaveLength(events.length);

    // Check if the 1st row is matched
    const firstRow = tableRows[0];
    const firstEvent = events[0];

    const tableCells = getAllByRole(firstRow, "cell");

    tableCells.slice(1, tableCells.length - 1).forEach((element, index) => {
      const columns = [
        "name",
        "organiser",
        "location",
        "eventDate",
        "entranceFee",
      ];
      const columnField = columns[index];
      const cellValue = firstEvent[columnField as keyof EventItem];

      if (columnField === "eventDate") {
        expect(element.innerHTML).toBe(
          convertDateForTable(firstEvent.eventDate)
        );
      } else {
        expect(element.innerHTML).toBe(cellValue?.toString());
      }
    });
  });

  it("Should render the loading text when fetching events", async () => {
    const { getLoadingText } = renderComponent();

    expect(getLoadingText()).toBeInTheDocument();
  });

  it("Should render the error text when fetching events failed", async () => {
    simulateGetError("events/all");

    const { getLoadingText } = renderComponent();

    await waitForElementToBeRemoved(getLoadingText);

    const errorText = screen.getByText(/no users/i);

    expect(errorText).toBeInTheDocument();
  });
});
