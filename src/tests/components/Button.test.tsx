import React from "react";
import { render, screen } from "@testing-library/react";
import Button from "../../components/Button";
import userEvent from "@testing-library/user-event";

describe("Button", () => {
  const handleClick = vi.fn();
  it('renders button with text "Sign In" correctly', () => {
    render(<Button handleClick={handleClick}>Sign In</Button>);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it("calls handleClick function when clicked", async () => {
    render(<Button handleClick={handleClick}>Sign In</Button>);

    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
