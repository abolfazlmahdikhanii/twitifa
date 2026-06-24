"use client";
import { Avatar, Button } from "@heroui/react";
import { Fullscreen, Pause, Play, X } from "lucide-react";
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  memo,
} from "react";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { getAuthorName } from "@/utils/post";

const PipVideo = ({
  backToFullScreen,
  closePip,
  options,
  syncTime,
  displayUser,
}) => {
  const playerRef = useRef(null);
  const rafRef = useRef(null);
  const [playerInstance, setPlayerInstance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [pipTime, setPipTime] = useState(null);
  const [playerStates, setPlayerStates] = useState({
    currentTime: 0,
    duration: 0,
  });

  const handlePlayerStateUpdate = useCallback((time, dur) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setPlayerStates({
        currentTime: time || 0,
        duration: dur || 0,
      });
    });
  }, []);

  const handleEnded = useCallback(() => {
    closePip?.();
    setPipTime(0);
    setPlayerStates({
      currentTime: 0,
      duration: 0,
    });
  }, [closePip]);

  const handleReady = useCallback(
    (videoPlayer) => {
      playerRef.current = videoPlayer;
      setPlayerInstance(videoPlayer);
      setIsPlaying(!videoPlayer.paused());
      setIsPlayerReady(true);

      // videoPlayer.off("play");
      // videoPlayer.off("pause");
      // videoPlayer.off("timeupdate");
      // videoPlayer.off("ended");

      videoPlayer.on("play", () => {
        setIsPlaying(true);
      });

      videoPlayer.on("pause", () => {
        setIsPlaying(false);
      });

      videoPlayer.on("timeupdate", () => {
        const time =
          typeof videoPlayer.currentTime === "function"
            ? videoPlayer.currentTime()
            : 0;

        const dur =
          typeof videoPlayer.duration === "function"
            ? videoPlayer.duration()
            : 0;

        handlePlayerStateUpdate(time, dur);
        setPipTime(time);
      });

      videoPlayer.on("ended", handleEnded);

      if (typeof syncTime === "number") {
        videoPlayer.currentTime(syncTime);
      }
    },
    [syncTime, handleEnded, handlePlayerStateUpdate],
  );

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;

    if (playerRef.current.paused()) {
      playerRef.current.play().catch((e) => console.error("Play error:", e));
    } else {
      playerRef.current.pause();
    }
  }, []);

  const { currentTime, duration } = playerStates;
  const progressScale = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min(Math.max(currentTime / duration, 0), 1);
  }, [currentTime, duration]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (playerRef.current) {
        playerRef.current.off("play");
        playerRef.current.off("pause");
        playerRef.current.off("timeupdate");
        playerRef.current.off("ended");
      }
    };
  }, []);

  const stableDisplayUser = useMemo(() => displayUser, [displayUser]);

  return createPortal(
    <div className="fixed top-20 left-6 z-10 w-72 min-h-42 h-fit rounded-3xl bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl group overflow-hidden">
      <div className="absolute inset-0 bg-black/30 z-5 rounded-3xl"></div>

      {/* Header Controls */}
      <div className="absolute top-3 flex gap-1 z-10 items-center justify-between w-full px-3  transition-all duration-200">
        <Button
          size="sm"
          className="w-8 h-8 bg-white/20 backdrop-blur-lg hover:bg-white/30"
          onPress={() => backToFullScreen(currentTime)}
          title="بازگشت به تمام‌صفحه"
        >
          <Fullscreen />
        </Button>
        <Button
          size="sm"
          className="w-8 h-8 bg-white/20 backdrop-blur-lg hover:bg-white/30"
          onPress={closePip}
          title="بستن"
        >
          <X size={14} />
        </Button>
      </div>

      <VideoPlayer
        options={options}
        isPip={true}
        syncTime={syncTime}
        onReady={handleReady}
      />

      <div className="absolute top-1/2 left-1/2 -translate-1/2 z-10">
        <Button
          size="sm"
          isIconOnly
          className="w-9.5 h-9.5 min-w-9.5 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white"
          onPress={togglePlay}
        >
          {isPlaying ? (
            <Pause size={14} />
          ) : (
            <Play size={14} className="ml-0.5" />
          )}
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-4 z-20">
        <div className="absolute inset-0 rounded-br-2xl rounded-tr-2xl"></div>
        <div className="absolute bottom-5 right-3">
          <AuthorInfo displayUser={stableDisplayUser} />
        </div>
        <div className="absolute right-0 bottom-0 w-5 h-2 bg-blue-500 rounded-br-2xl -z-10"></div>
        <div
          className="absolute right-4 bottom-0 w-[calc(100%-1.25rem)] h-2 bg-blue-500 rounded-bl-3xl -z-10 origin-right will-change-transform transition-transform duration-300 ease-linear"
          style={{ transform: `scaleX(${progressScale})` }}
        />
      </div>
    </div>,
    document.body,
  );
};

export default PipVideo;

const AuthorInfo = memo(({ displayUser }) => {
  const displayName = getAuthorName(displayUser);

  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="size-6.75 relative z-1">
        <Avatar.Image
          src={
            displayUser?.avatar ||
            "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
          }
          alt={displayName}
        />
        <Avatar.Fallback className="uppercase text-xs">
          {displayUser?.username?.charAt(0)}
        </Avatar.Fallback>
      </Avatar>

      <Link className="flex items-center" href={`/${displayUser?.username}`}>
        <span className="text-[13.5px] font-bold truncate">{displayName}</span>
        {!displayUser?.isVerified && (
          <Image
            src="/images/verified-business.png"
            alt="verified"
            width={96}
            height={96}
            className="object-cover size-3.5 shrink-0 mr-1 -mt-1"
          />
        )}
      </Link>
    </div>
  );
});

AuthorInfo.displayName = "AuthorInfo";
