import { getAllByRole, render, screen } from "@testing-library/react";
import EventsTableRow from "../../components/EventsTableRow";
import { db } from "../mocks/db";
import { EventItem } from "../../types";
import { convertDateForTable } from "../../helpers/date";
import userEvent from "@testing-library/user-event";
import { SelectedItem } from "../../components/EventsTable";

describe("EventsTableRow", () => {
  let product: EventItem;

  beforeAll(() => {
    product = db.event.create();
  });

  afterAll(() => {
    db.event.delete({ where: { id: { equals: product.id } } });
  });

  const renderComponent = () => {
    const mockedSetSelectedItem = vi.fn();
    const productIndex = 0;

    const { rerender } = render(
      <EventsTableRow
        idx={productIndex}
        item={product}
        selectedItem={null}
        setSelectedItem={mockedSetSelectedItem}
      />
    );

    return {
      productIndex,
      user: userEvent.setup(),
      getEditButton: () => screen.queryByRole("button", { name: /edit/i }),
      getDeleteButton: () => screen.queryByRole("button", { name: /delete/i }),
      rerender,
      mockedSetSelectedItem,
    };
  };

  it("Should display events table row data", () => {
    const { getEditButton, getDeleteButton, productIndex } = renderComponent();

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
        const cellValue = product[columnField as keyof EventItem];

        if (columnField === "eventDate") {
          expect(element.innerHTML).toBe(
            convertDateForTable(product.eventDate)
          );
        } else if (columnField === "index") {
          expect(element.innerHTML).toBe((productIndex + 1).toString());
        } else {
          expect(element.innerHTML).toBe(cellValue?.toString());
        }
      });
  });

  it.each([{ actionType: "edit" }, { actionType: "delete" }])(
    "Should show the edit row when the $actionType button is clicked",
    async ({ actionType }) => {
      const {
        productIndex,
        user,
        rerender,
        getEditButton,
        getDeleteButton,
        mockedSetSelectedItem,
      } = renderComponent();

      if (actionType === "edit") {
        await user.click(getEditButton()!);
      } else {
        await user.click(getDeleteButton()!);
      }

      const props: SelectedItem = {
        actionType: actionType as SelectedItem["actionType"],
        id: product.id!,
      };

      rerender(
        <EventsTableRow
          idx={productIndex}
          item={product}
          selectedItem={props}
          setSelectedItem={mockedSetSelectedItem}
        />
      );

      expect(mockedSetSelectedItem).toHaveBeenCalledWith(props);

      if (actionType === "edit") {
        expect(getEditButton()).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: /save/i })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: /close/i })
        ).toBeInTheDocument();
      } else {
        expect(getDeleteButton()).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: /confirm/i })
        ).toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: /cancel/i })
        ).toBeInTheDocument();
      }
    }
  );
});
