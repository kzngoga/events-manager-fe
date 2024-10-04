import { getAllByRole, render, screen } from "@testing-library/react";
import EventsTableRow from "../../components/EventsTableRow";
import { db } from "../mocks/db";
import { EventInput, EventItem } from "../../types";
import { convertDateForInput, convertDateForTable } from "../../helpers/date";
import userEvent from "@testing-library/user-event";
import { SelectedItem } from "../../components/EventsTable";
import { NullableEventInput, validFormData } from "../mocks/data";
import AllProviders from "../AllProviders";

describe("EventsTableRow", () => {
  let event: EventItem;

  beforeAll(() => {
    event = db.event.create();
  });

  afterAll(() => {
    db.event.delete({ where: { id: { equals: event.id } } });
  });

  const renderComponent = (props?: SelectedItem | null) => {
    const mockedSetSelectedItem = vi.fn();
    const eventIndex = 0;

    const { rerender } = render(
      <EventsTableRow
        idx={eventIndex}
        item={event}
        selectedItem={props || null}
        setSelectedItem={mockedSetSelectedItem}
      />,
      { wrapper: AllProviders }
    );

    return {
      eventIndex,
      user: userEvent.setup(),
      getEditButton: () => screen.queryByRole("button", { name: /edit/i }),
      getDeleteButton: () => screen.queryByRole("button", { name: /delete/i }),
      getSaveButton: () => screen.queryByRole("button", { name: /save/i }),
      getCloseButton: () => screen.queryByRole("button", { name: /close/i }),
      getConfirmButton: () =>
        screen.queryByRole("button", { name: /confirm/i }),
      getCancelButton: () => screen.queryByRole("button", { name: /cancel/i }),
      rerender,
      mockedSetSelectedItem,
    };
  };

  it("Should display events table row data", () => {
    const { getEditButton, getDeleteButton, eventIndex } = renderComponent();

    const tableRow = screen.getByRole("row");
    const tableRowCells = getAllByRole(tableRow, "cell");

    expect(tableRow).toBeInTheDocument();
    expect(getDeleteButton()).toBeInTheDocument();
    expect(getEditButton()).toBeInTheDocument();

    tableRowCells
      .slice(0, tableRowCells.length - 1)
      .forEach((element, index) => {
        const columns = [
          "index",
          "name",
          "organiser",
          "location",
          "eventDate",
          "entranceFee",
        ];

        const columnField = columns[index];
        const cellValue = event[columnField as keyof EventItem];

        if (columnField === "eventDate") {
          expect(element.innerHTML).toBe(convertDateForTable(event.eventDate));
        } else if (columnField === "index") {
          expect(element.innerHTML).toBe((eventIndex + 1).toString());
        } else {
          expect(element.innerHTML).toBe(cellValue?.toString());
        }
      });
  });

  it.each([{ actionType: "edit" }, { actionType: "delete" }])(
    "Should show the edit row when the $actionType button is clicked",
    async ({ actionType }) => {
      const {
        eventIndex,
        user,
        rerender,
        getEditButton,
        getDeleteButton,
        getSaveButton,
        getCancelButton,
        getConfirmButton,
        getCloseButton,
        mockedSetSelectedItem,
      } = renderComponent();

      if (actionType === "edit") {
        await user.click(getEditButton()!);
      } else {
        await user.click(getDeleteButton()!);
      }

      const props: SelectedItem = {
        actionType: actionType as SelectedItem["actionType"],
        id: event.id!,
      };

      rerender(
        <EventsTableRow
          idx={eventIndex}
          item={event}
          selectedItem={props}
          setSelectedItem={mockedSetSelectedItem}
        />
      );

      expect(mockedSetSelectedItem).toHaveBeenCalledWith(props);

      if (actionType === "edit") {
        expect(getEditButton()).not.toBeInTheDocument();
        expect(getSaveButton()).toBeInTheDocument();
        expect(getCloseButton()).toBeInTheDocument();
      } else {
        expect(getDeleteButton()).not.toBeInTheDocument();
        expect(getConfirmButton()).toBeInTheDocument();
        expect(getCancelButton()).toBeInTheDocument();
      }
    }
  );

  describe("EditTableRow", () => {
    const user = userEvent.setup();

    const getEventForm = async () => {
      const nameInput = screen.getByPlaceholderText(/name/i);
      const locationInput = screen.getByPlaceholderText(/location/i);
      const entranceFeeInput = screen.getByPlaceholderText(/fee/i);
      const organiserInput = screen.getByPlaceholderText(/organiser/i);
      const dateInput = screen.getByLabelText(/date/i);

      const fillForm = async (formData: NullableEventInput<EventInput>) => {
        if (formData?.name) {
          await user.type(nameInput, formData.name);
        } else {
          await user.clear(nameInput);
        }

        if (formData?.location) {
          await user.type(locationInput, formData.location);
        } else {
          await user.clear(locationInput);
        }

        if (formData?.entranceFee) {
          await user.type(entranceFeeInput, formData.entranceFee.toString());
        } else {
          await user.clear(entranceFeeInput);
        }

        if (formData?.organiser) {
          await user.type(organiserInput, formData.organiser);
        } else {
          await user.clear(organiserInput);
        }

        if (formData?.eventDate) {
          await user.type(dateInput, formData.eventDate);
        } else {
          await user.clear(dateInput);
        }
      };

      return {
        nameInput,
        locationInput,
        entranceFeeInput,
        organiserInput,
        dateInput,
        fillForm,
      };
    };

    it("Should render form filled with data ", async () => {
      const { getSaveButton, getCloseButton } = renderComponent({
        actionType: "edit",
        id: event.id!,
      });

      const {
        nameInput,
        dateInput,
        organiserInput,
        entranceFeeInput,
        locationInput,
      } = await getEventForm();

      expect(nameInput).toHaveValue(event.name);
      expect(dateInput).toHaveValue(convertDateForInput(event.eventDate));
      expect(organiserInput).toHaveValue(event.organiser);
      expect(entranceFeeInput).toHaveValue(event.entranceFee);
      expect(locationInput).toHaveValue(event.location);

      expect(getSaveButton()).toBeInTheDocument();
      expect(getCloseButton()).toBeInTheDocument();
    });

    it("Should disable the save button when form is not valid", async () => {
      const { getSaveButton } = renderComponent({
        actionType: "edit",
        id: event.id!,
      });

      const { fillForm } = await getEventForm();

      await fillForm({ ...validFormData, name: "" });
      expect(getSaveButton()).toBeDisabled();
    });

    it("Should submit form when 'save' button is clicked, and close the row", async () => {
      const {
        getEditButton,
        getSaveButton,
        getCloseButton,
        rerender,
        eventIndex,
        user,
        mockedSetSelectedItem,
      } = renderComponent({
        actionType: "edit",
        id: event.id!,
      });

      await user.click(getSaveButton()!);

      rerender(
        <EventsTableRow
          idx={eventIndex}
          item={event}
          selectedItem={null}
          setSelectedItem={mockedSetSelectedItem}
        />
      );

      expect(mockedSetSelectedItem).toHaveBeenCalledWith(null);
      expect(getSaveButton()).not.toBeInTheDocument();
      expect(getCloseButton()).not.toBeInTheDocument();
      expect(getEditButton()).toBeInTheDocument();
    });

    it("Should close the row when 'close' button is clicked", async () => {
      const {
        getCloseButton,
        getEditButton,
        eventIndex,
        rerender,
        user,
        mockedSetSelectedItem,
      } = renderComponent({ actionType: "edit", id: event.id! });

      await user.click(getCloseButton()!);

      rerender(
        <EventsTableRow
          idx={eventIndex}
          item={event}
          selectedItem={null}
          setSelectedItem={mockedSetSelectedItem}
        />
      );

      expect(mockedSetSelectedItem).toHaveBeenCalledWith(null);
      expect(getEditButton()).toBeInTheDocument();
    });
  });

  describe("DeleteTableRow", () => {
    it("Should show the confirm & close button when loaded", () => {
      const { getConfirmButton, getCancelButton } = renderComponent({
        actionType: "delete",
        id: event.id!,
      });

      expect(getCancelButton()).toBeInTheDocument();
      expect(getConfirmButton()).toBeInTheDocument();
    });

    it("Should hide the delete row action buttons when the 'cancel' button is clicked", async () => {
      const {
        getConfirmButton,
        getCancelButton,
        getDeleteButton,
        user,
        eventIndex,
        rerender,
        mockedSetSelectedItem,
      } = renderComponent({
        actionType: "delete",
        id: event.id!,
      });

      await user.click(getCancelButton()!);

      rerender(
        <EventsTableRow
          idx={eventIndex}
          item={event}
          selectedItem={null}
          setSelectedItem={mockedSetSelectedItem}
        />
      );

      expect(mockedSetSelectedItem).toHaveBeenCalledWith(null);
      expect(getDeleteButton()).toBeInTheDocument();
      expect(getCancelButton()).not.toBeInTheDocument();
      expect(getConfirmButton()).not.toBeInTheDocument();
    });

    it("Should delete the event when 'confirm' button is clicked", async () => {
      const { getConfirmButton, user, mockedSetSelectedItem } = renderComponent(
        {
          actionType: "delete",
          id: event.id!,
        }
      );

      await user.click(getConfirmButton()!);

      // Get current events from DB
      const events = db.event.getAll();

      expect(mockedSetSelectedItem).toHaveBeenCalledWith(null);
      expect(events).toHaveLength(0);
    });
  });
});
