import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "../../pages/Login";
import userEvent from "@testing-library/user-event";
import { signInWithEmailAndPassword } from "firebase/auth";
import { MemoryRouter } from "react-router";

// Mock the Firebase Auth function
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
}));

describe("Login", () => {
  const correctEmail = "robb@stark.winterfell";
  const correctPassword = "Greywind";

  beforeEach(() => {
    vi.clearAllMocks(); // Clear previous mocks before each test
  });

  it("should render form with all needed inputs", () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: "Login" });
    const errorElement = screen.getByTestId("error");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(errorElement).toHaveTextContent("");
  });

  it("should render error message when received", async () => {
    const user = userEvent.setup();

    signInWithEmailAndPassword.mockImplementation(
      (auth, email: string, password: string) => {
        // Check if email and password match expected values
        if (email === correctEmail && password === correctPassword) {
          return Promise.resolve(); // Resolve promise for successful sign-in
        } else if (email === correctEmail && password !== correctPassword) {
          return Promise.reject({ code: "auth/wrong-password" }); // Mock error for invalid credentials
        } else {
          return Promise.reject({ code: "auth/invalid-credential" }); // Mock error for invalid credentials
        }
      }
    );

    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: "Login" });

    await user.type(emailInput, "robb@stark.winterfell");
    await user.type(passwordInput, "Ghost");
    await user.click(submitButton);

    expect(
      await screen.findByText(
        "The password is invalid or the user does not have a password."
      )
    ).toBeInTheDocument();
  });

  it("should navigate to DashboardPage on sucessful login", async () => {
    const user = userEvent.setup();

    signInWithEmailAndPassword.mockImplementation(
      (auth, email: string, password: string) => {
        // Check if email and password match expected values
        if (email === correctEmail && password === correctPassword) {
          return Promise.resolve(); // Resolve promise for successful sign-in
        } else {
          return Promise.reject({ code: "auth/invalid-credential" }); // Mock error for invalid credentials
        }
      }
    );

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: "Login" });

    await user.type(emailInput, "robb@stark.winterfell");
    await user.type(passwordInput, "Greywind");
    await user.click(submitButton);

    expect(screen.getByTestId("error")).toBeEmptyDOMElement(); //check if an error occured
    expect(window.location.pathname).toBe("/"); // Verify redirect
  });
});
