import React from "react";
import { FaFile } from "react-icons/fa";

interface FileProps {
  file: { type: string; url: string };
}

const File: React.FC<FileProps> = ({ file }) => {
  const fileExtension = file.type.split("/")[1];

  return (
    <div data-testid="file-message">
      {file.type.includes("image") ? (
        <img src={file.url} alt="something went wrong" />
      ) : (
        <div className="flex items-center gap-6 text-4xl">
          <FaFile />
          <span className="text-xl text-gray-400">
            example_filename.{fileExtension}
          </span>
        </div>
      )}
    </div>
  );
};

export default File;
