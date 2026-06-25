"use client"
import { useEffect, useState } from "react";

const useResponsiveHeight = (baseHeight) => {
  const [height, setHeight] = useState(baseHeight);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setHeight(Math.round(baseHeight * 0.55));
      else if (w < 768) setHeight(Math.round(baseHeight * 0.75));
      else setHeight(baseHeight);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [baseHeight]);

  return height;
};

export default useResponsiveHeight;
