import React from "react";
import { render, screen, fireEvent } from "@vtex/test-tools/react;
import { MockedProvider } from "@apollo/client/testing";
import ModalConfirm from "../../../components/ModalConfirm/index";

const mockInvoiceMutation = jest.fn();

const defaultProps = {
  invoiceMutation: mockInvoiceMutation,
  sellerData: {
    startDate: "2023-01-01",
    finalDate: "2023-12-31",
    sellerName: "Test Seller",
    id: "123",
  },
  messages: {
    warning: "Are you sure?",
    confirmation: "Please confirm your action.",
  },
  buttonMessage: "Open Modal",
  integration: "internal",
  disabled: false,
};

describe("ModalConfirm", () => {
  it("renders the button and modal correctly", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ModalConfirm {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByText(defaultProps.buttonMessage)).toBeInTheDocument();

    expect(
      screen.queryByText(defaultProps.messages.warning)
    ).not.toBeInTheDocument();
  });

  it("opens the modal when the button is clicked", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ModalConfirm {...defaultProps} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(defaultProps.buttonMessage));

    expect(screen.getByText(defaultProps.messages.warning)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.messages.confirmation)).toBeInTheDocument();
  });

  it("validates email input and shows errors", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ModalConfirm {...defaultProps} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(defaultProps.buttonMessage));

    const emailInput = screen.getByPlaceholderText("e-mail");

    fireEvent.change(emailInput, { target: { value: "" } });
    expect(screen.getByText("admin/modal-settings.email-empty")).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    expect(screen.getByText("admin/modal-settings.email-invalid")).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: "valid@test.com" } });

    expect(
      screen.queryByText("admin/modal-settings.email-invalid")
    ).not.toBeInTheDocument();
  });

  it("calls the mutation when form is valid", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ModalConfirm {...defaultProps} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText(defaultProps.buttonMessage));

    const emailInput = screen.getByPlaceholderText("e-mail");
    fireEvent.change(emailInput, { target: { value: "valid@test.com" } });

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    expect(mockInvoiceMutation).toHaveBeenCalledWith({
      variables: {
        invoiceData: {
          name: defaultProps.sellerData.sellerName,
          id: defaultProps.sellerData.id,
          email: "valid@test.com",
          startDate: defaultProps.sellerData.startDate,
          endDate: defaultProps.sellerData.finalDate,
        },
      },
    });
  });
});
