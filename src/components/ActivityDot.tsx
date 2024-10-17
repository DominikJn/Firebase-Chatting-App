import React from "react";

interface ActivityDotProps {
  size?: number;
  testidAdditional?: string;
}

const ActivityDot: React.FC<ActivityDotProps> = ({
  size = 2,
  testidAdditional = "",
}) => {
  return (
    <div
      data-testid={`active-dot${testidAdditional}`}
      className={`absolute bottom-0 right-0 bg-green-600 p-${size} rounded-full`}
    ></div>
  );
};

export default ActivityDot;
