import React from "react";
import File from "./File";

interface MessagePreviewProps {
  file?: File;
  text?: string;
  setFile: (arg: null) => void;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({
  file,
  text,
  setFile,
}) => {
  return (
    <div
      data-testid="file-view"
      className="absolute bottom-[100%] w-1/2 bg-slate-900 text-white p-4 flex justify-between"
    >
      {file && (
        <div className="w-1/5 h-auto">
          <File file={{ type: file.type, url: URL.createObjectURL(file) }} />
          <span>{file.name}</span>
        </div>
      )}
      {text && <span>{text}</span>}
      <button className="text-4xl" onClick={() => setFile(null)}>
        X
      </button>
    </div>
  );
};

export default MessagePreview;
