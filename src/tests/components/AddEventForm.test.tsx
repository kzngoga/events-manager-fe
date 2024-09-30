import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddEventForm from "../../components/AddEventForm";
import { EventInput } from "../../types";
import AllProviders from "../AllProviders";
import { simulatePostError } from "../utils";

describe("AddEventForm", () => {
  const validFormData: EventInput = {
    entranceFee: 50,
    eventDate: "2024-10-23",
    location: "Kirehe Stadium",
    name: "John Doe",
    organiser: "EAP",
  };

  const renderComponent = () => {
    render(<AddEventForm />, { wrapper: AllProviders });

    const user = userEvent.setup();

    const formTitle = screen.getByRole("heading", {
      level: 4,
    });

    const getAddButton = () => {
      return screen.queryByRole("button", {
        name: /add/i,
      });
    };

    const getCloseButton = async () => {
      return await screen.findByRole("button", {
        name: /close/i,
      });
    };

    const getSaveButton = async () => {
      return screen.queryByRole("button", {
        name: /save/i,
      });
    };

    const getEventForm = async () => {
      await screen.findByRole("form");

      const nameInput = screen.getByPlaceholderText(/name/i);
      const locationInput = screen.getByPlaceholderText(/location/i);
      const entranceFeeInput = screen.getByPlaceholderText(/fee/i);
      const organiserInput = screen.getByPlaceholderText(/organiser/i);
      const dateInput = screen.getByLabelText(/date/i);

      const fillForm = async (formData: EventInput) => {
        await user.type(nameInput, formData.name);
        await user.type(locationInput, formData.location);
        await user.type(entranceFeeInput, formData.entranceFee.toString());
        await user.type(organiserInput, formData.organiser);
        await user.type(dateInput, formData.eventDate);
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
      formTitle,
      getAddButton,
      user,
      getCloseButton,
      getEventForm,
      getSaveButton,
    };
  };

  it("Should render the AddEvent component with initial state", async () => {
    const { formTitle, getAddButton } = renderComponent();

    const addButton = getAddButton();
    expect(formTitle).toHaveTextContent(/add new event/i);
    expect(addButton).toBeInTheDocument();
  });

  it("Should render the AddEvent form with disabled save button when the add button is clicked", async () => {
    const { getAddButton, user, getCloseButton, getEventForm, getSaveButton } =
      renderComponent();

    // Click the add button
    await user.click(getAddButton()!);

    const {
      nameInput,
      locationInput,
      entranceFeeInput,
      organiserInput,
      dateInput,
    } = await getEventForm();

    expect(getAddButton()).not.toBeInTheDocument();
    expect(await getCloseButton()).toBeInTheDocument();

    expect(await getSaveButton()).toBeInTheDocument();
    expect(await getSaveButton()).toBeDisabled();

    expect(nameInput).toBeInTheDocument();
    expect(locationInput).toBeInTheDocument();
    expect(entranceFeeInput).toBeInTheDocument();
    expect(entranceFeeInput).toBeInTheDocument();
    expect(organiserInput).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();
  });

  it("Should enable the save button when all form fields are filled correctly", async () => {
    const { getAddButton, getEventForm, user, getSaveButton } =
      renderComponent();

    // Click the add button
    await user.click(getAddButton()!);

    const { fillForm } = await getEventForm();
    await fillForm(validFormData);

    expect(await getSaveButton()).toBeInTheDocument();
    expect(await getSaveButton()).toBeEnabled();
  });

  it("Should submit the form & hide the form on success", async () => {
    const { getAddButton, getEventForm, user, getSaveButton } =
      renderComponent();

    // Click the add button
    await user.click(getAddButton()!);

    const { fillForm } = await getEventForm();
    await fillForm(validFormData);

    await user.click((await getSaveButton()) as HTMLElement);

    await waitFor(() => {
      expect(getAddButton()).toBeInTheDocument();
    });
  });

  it("Should show error text when the create event API fails", async () => {
    simulatePostError("events/new");

    const { getAddButton, getEventForm, user, getSaveButton } =
      renderComponent();

    // Click the add button
    await user.click(getAddButton()!);

    const { fillForm } = await getEventForm();
    await fillForm(validFormData);

    await user.click((await getSaveButton()) as HTMLElement);

    await waitFor(() => {
      const errorText = screen.getByText(/error/i);
      expect(errorText).toBeInTheDocument();
    });
  });
});
