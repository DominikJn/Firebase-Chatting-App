import React from "react";
import { render, screen } from "@testing-library/react";
import File from "../../components/chat/File";

describe("File", () => {
  it("should render img if file type is image", () => {
    render(
      <File
        file={{ type: "image/jpeg", url: "https://example.com/image.jpg" }}
      />
    );

    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("should render other file format if file type is other than image", () => {
    render(
      <File
        file={{
          type: "application/json",
          url: "https://example.com/example.json",
        }}
      />
    );

    //expect file extension to be displayed as it is always present when file type is other than image
    const extensionElement = screen.getByText(/json/i);

    expect(extensionElement).toBeInTheDocument();
  });
});
