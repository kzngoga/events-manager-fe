import { render, screen, waitFor } from "@testing-library/react";
import EditTableRow from "../../components/EditTableRow";
import { db } from "../mocks/db";
import { EventInput, EventItem } from "../../types";
import userEvent from "@testing-library/user-event";
import { convertDateForInput } from "../../helpers/date";
import { NullableEventInput, validFormData } from "../mocks/data";
import AllProviders from "../AllProviders";

describe("EditTableRow", () => {
  let product: EventItem;

  beforeAll(() => {
    product = db.event.create();
  });

  afterAll(() => {
    db.event.delete({ where: { id: { equals: product.id } } });
  });

  const renderComponent = () => {
    const productIndex = 0;
    const mockedSetSelectedItem = vi.fn();

    render(
      <AllProviders>
        <EditTableRow
          idx={productIndex}
          item={product}
          setSelectedItem={mockedSetSelectedItem}
        />
      </AllProviders>
    );

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

    return {
      user,
      getEventForm,
      mockedSetSelectedItem,
      getSaveButton: () => screen.queryByRole("button", { name: /save/i }),
      getCloseButton: () => screen.queryByRole("button", { name: /close/i }),
    };
  };

  it("Should render form filled with data", async () => {
    const { getEventForm, getSaveButton, getCloseButton } = renderComponent();

    const {
      nameInput,
      dateInput,
      organiserInput,
      entranceFeeInput,
      locationInput,
    } = await getEventForm();

    expect(nameInput).toHaveValue(product.name);
    expect(dateInput).toHaveValue(convertDateForInput(product.eventDate));
    expect(organiserInput).toHaveValue(product.organiser);
    expect(entranceFeeInput).toHaveValue(product.entranceFee);
    expect(locationInput).toHaveValue(product.location);

    expect(getSaveButton()).toBeInTheDocument();
    expect(getCloseButton()).toBeInTheDocument();
  });

  it("Should disable the save button when form is not valid", async () => {
    const { getEventForm, getSaveButton } = renderComponent();

    const { fillForm } = await getEventForm();

    await fillForm({ ...validFormData, name: "" });
    expect(getSaveButton()).toBeDisabled();
  });

  it("Should submit form when 'save' button is clicked, and close the row", async () => {
    const { getSaveButton, user, mockedSetSelectedItem } = renderComponent();

    await user.click(getSaveButton()!);

    await waitFor(() => {
      expect(mockedSetSelectedItem).toHaveBeenCalledWith(null);
    });
  });

  it("Should close the row when 'close' button is clicked", async () => {
    const { getCloseButton, user, mockedSetSelectedItem } = renderComponent();

    await user.click(getCloseButton()!);

    await waitFor(() => {
      expect(mockedSetSelectedItem).toHaveBeenCalledWith(null);
    });
  });
});
