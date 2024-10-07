import React from "react";
import { render, screen } from "@testing-library/react";
import Register from "../../pages/Register";
import userEvent from "@testing-library/user-event";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Mock the Firebase Auth function
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear previous mocks before each test
  });

  it("should render form with all needed inputs", () => {
    render(<Register />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: "Register" });
    const errorElement = screen.getByTestId("error");

    expect(emailInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(errorElement).toHaveTextContent("");
  });

  it("should render error message when received", async () => {
    const user = userEvent.setup();

    createUserWithEmailAndPassword.mockImplementation(
      (auth, email: string, password: string) => {
        if (email && password.length >= 6) {
          return Promise.resolve();
        }
        if (password.length < 6) {
          return Promise.reject({ code: "auth/weak-password" }); // Mock error for invalid credentials
        } else {
          return Promise.reject("unknown error");
        }
      }
    );

    render(<Register />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: "Register" });

    await user.type(emailInput, "robb@stark.winterfell");
    await user.type(usernameInput, "robb");
    await user.type(passwordInput, "123");
    await user.click(submitButton);

    expect(
      await screen.findByText("The password must be 6 characters long or more.")
    ).toBeInTheDocument();
  });

  it.todo("should register new user successfully", async () => {
    const user = userEvent.setup();

    // Mock successful registration
    createUserWithEmailAndPassword.mockImplementation(() => Promise.resolve());

    render(<Register />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: /register/i });

    await user.type(emailInput, "robb@stark.winterfell");
    await user.type(usernameInput, "robb");
    await user.type(passwordInput, "123456"); // Valid password
    await user.click(submitButton);

    // Assert that no error message is displayed
    expect(window.location.pathname).toBe("/"); // Verify redirect
  });
});
