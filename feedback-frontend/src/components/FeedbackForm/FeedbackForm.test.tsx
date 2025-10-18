import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FeedbackForm from "./FeedbackForm";

jest.mock("../StatusModal/StatusModal", () => ({ show, message, type, onClose, children }: any) => (
    <div data-testid="modal">
        {show && (
            <>
                <p>{message}</p>
                <div>{children}</div>
                <button onClick={onClose}>Close</button>
            </>
        )}
    </div>
));

describe("FeedbackForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders all input fields and submit button", () => {
        render(<FeedbackForm />);
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    });

    test("shows validation errors when submitting empty form", async () => {
        render(<FeedbackForm />);
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        expect(await screen.findByText("Name is required.")).toBeInTheDocument();
        expect(screen.getByText("Email is required.")).toBeInTheDocument();
        expect(screen.getByText("Message is required.")).toBeInTheDocument();

        expect(screen.getByText("Please fix the highlighted errors and try again.")).toBeInTheDocument();
    });

    test("shows email format validation error", async () => {
        render(<FeedbackForm />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Vishal" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalid-email" } });
        fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Hello" } });

        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        expect(await screen.findByText("Email is invalid.")).toBeInTheDocument();
        expect(screen.getByText("Please fix the highlighted errors and try again.")).toBeInTheDocument();
    });

    test("submits form successfully and shows modal", async () => {
        const mockResponse = { id: 1, name: "Vishal", message: "Hello" };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            } as Response)
        );

        render(<FeedbackForm />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Vishal" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "vishal@example.com" } });
        fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Hello" } });

        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        expect(await screen.findByText("Feedback submitted successfully!")).toBeInTheDocument();
        expect(screen.getByTestId('modal-id')).toHaveTextContent('Id: 1');
        expect(screen.getByTestId('modal-name')).toHaveTextContent('Name: Vishal');
        expect(screen.getByTestId('modal-message')).toHaveTextContent('Message: Hello');

        // Ensure form is cleared
        expect(screen.getByLabelText(/name/i)).toHaveValue("");
        expect(screen.getByLabelText(/email/i)).toHaveValue("");
        expect(screen.getByLabelText(/message/i)).toHaveValue("");
    });

    test("handles network errors gracefully", async () => {
        global.fetch = jest.fn(() => Promise.resolve({ ok: false } as Response));

        render(<FeedbackForm />);
        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Vishal" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "vishal@example.com" } });
        fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Hello" } });

        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        expect(await screen.findByText("Something went wrong. Please try again later.")).toBeInTheDocument();
    });

    test("modal can be closed", async () => {
        render(<FeedbackForm />);
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        const modalCloseButton = await screen.findByText(/close/i);
        fireEvent.click(modalCloseButton);
        expect(screen.queryByText(/Please fix the highlighted errors and try again./)).not.toBeInTheDocument();
    });
    test("focuses on the first field after successful submission", async () => {
        const mockResponse = { id: 1, name: "Vishal", message: "Hello" };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            } as Response)
        );

        render(<FeedbackForm />);
        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const messageInput = screen.getByLabelText(/message/i);

        fireEvent.change(nameInput, { target: { value: "Vishal" } });
        fireEvent.change(emailInput, { target: { value: "vishal@example.com" } });
        fireEvent.change(messageInput, { target: { value: "Hello" } });

        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        expect(nameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(messageInput).toBeInTheDocument();

        await waitFor(() => {
            expect(nameInput).toHaveFocus();
        });
    });
});
