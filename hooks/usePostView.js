"use client";
import { useEffect, useRef, useCallback } from "react";

export const usePostView = (postId, viewsElementId) => {
  const postRef = useRef(null);
  const hasViewedRef = useRef(false);

  const trackView = useCallback(async (type) => {
    if (hasViewedRef.current) return;
    
    hasViewedRef.current = true;

    try {
      await fetch(`/api/posts/register-view/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewType: type }),
        credentials: "include",
      });
    } catch (e) {
      console.log("Scroll track failed:", e);
    }
  }, [postId]);

  useEffect(() => {
    if (!postRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        
        if (!hasViewedRef.current && entry.isIntersecting) {
          if (ratio >= 0.5) {
            trackView("scroll");
          }
          if (ratio >= 0.8) {
            trackView("scroll");
          }
        }
      },
      { 
        threshold: [0.5, 0.8],
        rootMargin: "0px 0px -25% 0px"
      }
    );

    observer.observe(postRef.current);
    return () => observer.disconnect();
  }, [trackView]);

  const trackClick = useCallback(() => {
    if (!hasViewedRef.current) {
      trackView("click");
    }
  }, [trackView]);

  return { postRef, trackClick };
};