import { Spinner } from "@heroui/react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full py-4">
      <div className="bg-default-100 p-2 w-11 h-11 rounded-full animate-pulse flex items-center justify-center">
        <Spinner size="lg" color="default" />
      </div>
    </div>
  );
};

export default Loader;