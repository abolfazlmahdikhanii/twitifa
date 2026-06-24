import React from "react";

const EmptyData = ({ text }) => {
  return (
    <div className="flex items-center justify-center mt-22 h-full">
      <p className="text-2xl font-bold ">{text}</p>
    </div>
  );
};

export default EmptyData;
