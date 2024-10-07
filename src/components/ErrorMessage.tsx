import React from "react";

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <h2 data-testid="error" className="text-red-700 text-center text-lg h-8">
      {error}
    </h2>
  );
};

export default ErrorMessage;
