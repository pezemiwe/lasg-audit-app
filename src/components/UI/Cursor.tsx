import React from "react";
import { useCustomCursor } from "../../hooks/useCustomCursor";

const Cursor: React.FC = () => {
  useCustomCursor();
  return (
    <>
      <div className="cursor"></div>
      <div className="cursor-ring"></div>
    </>
  );
};

export default Cursor;
