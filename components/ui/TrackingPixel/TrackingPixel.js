// import React, { useCallback, useEffect, useRef, useState } from "react";

// const TrackingPixel = ({ postId }) => {
//   const pixelLoadedRef = useRef(false);
//   const pixelRef = useRef(null);
//   const loadPixel = useCallback(() => {
//     if (pixelLoadedRef.current) return;
//     const img = new Image(1, 1);
//     img.src = `/api/posts/imperession?id=${postId}`;
//     img.referrerPolicy = "no-referrer-when-downgrade";
//     img.onload = () => {
//       pixelLoadedRef.current = true;
//     };
//     // img.onerror = (e) => console.log("Pixel failed:", e);

//     // Cleanup
//     return () => {
//       if (img.parentNode) img.parentNode.removeChild(img);
//     };
//   }, [postId]);

//   useEffect(() => {
//     loadPixel();
//   }, [loadPixel]);
//   return (
//     <>
//       <img
//         ref={pixelRef}
//         src={`/api/posts/imperession?id=${postId}`}
//         width={1}
//         height={1}
//         alt=""
//         loading="eager"
//         fetchPriority="high"
//         className="absolute inset-0 invisible pointer-events-none select-none"
//         draggable={false}
//         onLoad={() => console.log("DOM Pixel loaded")}
//       />
//     </>
//   );
// };

// export default TrackingPixel;
// return (
//     <div>TrackingPixel</div>
//   )
"use client"
import React, { useEffect, useRef } from "react";
const TrackingPixel = ({ postId }) => {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    fetch("/api/posts/imperession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });
  }, [postId]);
   return null;
};

export default TrackingPixel;
