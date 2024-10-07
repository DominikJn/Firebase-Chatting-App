import handleAuthError from "../../utils/handleAuthError";

describe("handleAuthError", () => {
  it("should return response assigned to error code", () => {
    const code = "auth/wrong-password";

    const result = handleAuthError(code);

    expect(result).toBe(
      "The password is invalid or the user does not have a password."
    );
  });

  it("should return uknown error response when code does not match anything", () => {
    const code = "randomshit/foobar";

    const result = handleAuthError(code);

    expect(result).toBe("Something went wrong, unknown error.");
  });
});
