"use client";
import { useCallback, useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({
  options,
  onReady,
  fullHeight = false,
  isPip = false,
  syncTime,
  onTimeUpdate,
  onEnded,
  setPlayerReady,
  autoplay = false,
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const timeUpdateRef = useRef(onTimeUpdate);

  useEffect(() => {
    timeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  const handleTimeUpdateStable = useCallback((time, duration) => {
    timeUpdateRef.current?.(time, duration);
  }, []);
  const handleSyncTime = useCallback(() => {
    if (playerRef.current && syncTime !== undefined && syncTime > 0) {
      playerRef.current.currentTime(syncTime);
    }
  }, [syncTime]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.off("timeupdate");
      }
    };
  }, []);

  // useEffect(() => {
  //   const player = playerRef.current;
  //   if (!player || typeof syncTime !== "number") return;

  //   player.currentTime(syncTime);
  // }, [syncTime]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    const initVideoPlayer = () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }

      const defaultOptions = {
        controls: !isPip,
        controlBar: isPip
          ? {
              playToggle: false,
              volumePanel: false,
              currentTimeDisplay: false,
              timeDivider: false,
              durationDisplay: false,
              remainingTimeDisplay: false,
              fullscreenToggle: false,
              pictureInPictureToggle: false,
              progressControl: true,
            }
          : {
              pictureInPictureToggle: false,
              fullscreenToggle: false,
            },
        preload: "auto",
        fluid: true,

        ...options,
      };

      try {
        const player = videojs(videoElement, defaultOptions, () => {
          playerRef.current = player;

          if (onReady) {
            onReady(player);
          }

          const handleFirstPlay = () => {
            setPlayerReady?.(true);
            player.off("play", handleFirstPlay);
          };

          player.on("play", handleFirstPlay);
          player.on("timeupdate", () => {
            handleTimeUpdateStable(player.currentTime(), player.duration());
          });
          player.on("ended", () => {
            setPlayerReady?.(false);
            if (onEnded) onEnded?.();
          });
          handleSyncTime();
        });
      } catch (error) {
        console.error("Video.js error:", error);
        setPlayerReady?.(false);
      }
    };

    const timer = setTimeout(initVideoPlayer, 50);
    return () => {
      clearTimeout(timer);
      if (playerRef.current) {
        playerRef.current.off("play");

        playerRef.current.off("timeupdate");
        playerRef.current.off("ended");
        playerRef.current.pause();
        playerRef.current = null;
      }
      setPlayerReady?.(false);
    };
  }, [
    isPip,
    handleSyncTime,
    onReady,
    options,
    handleTimeUpdateStable,
    onEnded,
    setPlayerReady,
  ]);

  return (
    <div
      data-vjs-player
      data-ispip={isPip}
      className={
        !fullHeight ? "custom-video-container" : "full-video-container"
      }
      style={{
        width: "100%",
        borderRadius: "24px",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <video
        ref={videoRef}
        className={`video-js vjs-big-play-centered vjs-fluid ${isPip ? "vjs-pip-only-progress" : ""}`}
        playsInline
        style={{
          width: "100%",
          height: fullHeight ? "99.2%" : "auto",

          borderRadius: "24px",
          display: "block",
        }}
      />
    </div>
  );
};

export default VideoPlayer;
