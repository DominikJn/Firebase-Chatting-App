import React from "react";
import { render, screen } from "@testing-library/react";
import StartingPage from "../../pages/StartingPage";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const StartingPageMock = () => {
  return (
    <BrowserRouter>
      <StartingPage />
    </BrowserRouter>
  );
};

describe("StartingPage", () => {
  it("should render all the welcome text", () => {
    render(<StartingPageMock />);

    const headingOneText = screen.getByText(/Find new friends with/i);
    const headingTwoText = screen.getByText(
      /Sign up and use the best free chatting website!/i
    );
    const signInButton = screen.getByRole("button", { name: /Sign In/i });
    const signUpButton = screen.getByRole("button", { name: /Sign Up/i });

    expect(headingOneText).toBeInTheDocument();
    expect(headingTwoText).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });

  it("should navigate to different pathnames on sign buttons click", async () => {
    const user = userEvent.setup();
    render(<StartingPageMock />);

    const signInButton = screen.getByRole("button", { name: /Sign In/i });
    const signUpButton = screen.getByRole("button", { name: /Sign Up/i });

    // '/login'
    await user.click(signInButton);
    expect(window.location.pathname).toBe("/login");
    // '/register'
    await user.click(signUpButton);
    expect(window.location.pathname).toBe("/register");
  });
});
