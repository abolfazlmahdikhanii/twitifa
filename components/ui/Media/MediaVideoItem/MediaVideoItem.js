"use client";
import { Button, Modal } from "@heroui/react";
import {
  ArrowRight,
  Download,
  EllipsisVertical,
  PictureInPicture2,
  PictureInPictureIcon,
  Play,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { memo, useCallback, useMemo, useState } from "react";
import VideoPlayer from "../../VideoPlayer/VideoPlayer";
import {
  formatFileSize,
  formatVideoDuration,
  getVideoType,
} from "@/utils/post";
import PipVideo from "../../PipVideo/PipVideo";

const MediaVideoItem = memo(
  ({
    video,
    index,
    totalVideo,
    onRemove,
    isPreview = false,
    posterUrl,
    author,
    blurUrl,
    time,
    size
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPip, setIsPip] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

    const [pipTime, setPipTime] = useState(0);
    const objectUrl = useMemo(
      () => (isPreview ? URL.createObjectURL(video.file) : video),
      [video, isPreview],
    );
    const newPosterUrl = useMemo(() => posterUrl, [posterUrl]);
    const layoutClass = useMemo(
      () => (totalVideo === 3 && index === 2 ? "col-span-2 " : ""),
      [totalVideo, index],
    );

    const imageKey = useMemo(
      () => `${video.size}-${video.name}-${video.lastModified || index}`,
      [video.size, video.name, video.lastModified, index],
    );
    const videoOptions = useMemo(() => {
      if (!objectUrl) return null;
      return {
        sources: [
          {
            src: objectUrl,
            type: getVideoType(objectUrl),
          },
        ],
        poster: posterUrl,
        autoplay: isPip || (shouldAutoPlay && true),
      };
    }, [objectUrl, posterUrl, isPip, shouldAutoPlay]);
    const handlePlayerReady = (player) => {
      if (!player) return;

      if (isPreview) {
        player.ready(() => {
          const duration = player.duration();

          if (duration && !isNaN(duration)) {
            // onSetDuration(duration);
          }
        });

        player.play().catch((e) => console.log("Auto-play failed:", e));
      }
    };
    const handleTimeUpdate = (time, dur) => {
      setDuration(dur);
      setCurrentTime(time);
    };

    const backToFullScreen = useCallback((currTime) => {
      setIsPip(false);
      setIsOpen(true);
      setPipTime(currTime);
      setShouldAutoPlay(true);
    }, []);
    const closePip = () => {
      setIsPip(false);
      setIsOpen(false);
    };
    const onEndVideo = useCallback(() => {
      closePip();
      setCurrentTime(0);
      setDuration(0);
      setPipTime(0);
      setIsPlayerReady(false);
      setShouldAutoPlay(false);
    }, []);
    return (
      <div
        className={`relative group ${layoutClass}`}
        key={isPreview && `${author}-index`}
      >
        {!isPreview ? (
          <>
            <div
              className="relative aspect-auto"
              onClick={() => setIsOpen(true)}
            >
              <Image
                src={newPosterUrl}
                alt={`تصویر ${index + 1}`}
                className={`w-full h-full object-cover bg-no-repeat rounded-3xl min-h-63 max-h-149 cursor-pointer overflow-hidden duration-700 ease-in-out`}
                width={600}
                height={600}
                placeholder="blur"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                blurDataURL={blurUrl}
              />

              <Button
                isIconOnly
                className={
                  "absolute top-1/2 left-1/2 -translate-1/2 w-17.25 h-17.25 rounded-full ring-1 ring-gray-400   [&>svg]:size-6 bg-[rgba(0,0,0,0.2)] backdrop-blur-xl "
                }
                size="lg"
                onPress={(e) => {
                  e?.stopPropagation();
                }}
              >
                <Play />
              </Button>
              <div className="absolute bottom-4 left-3 bg-[rgba(0,0,0,0.3)] backdrop-blur-xl text-sm py-1.25 px-2.75 rounded-lg">
                {formatVideoDuration(time)}
              </div>
              <div className="absolute top-4 right-3 bg-[rgba(0,0,0,0.3)] backdrop-blur-xl text-sm py-1.25 px-2.75 rounded-lg">
                {formatFileSize(size)}
              </div>
            </div>
            <Modal isOpen={isOpen && !isPip} onOpenChange={setIsOpen}>
              <Modal.Backdrop isDismissable={false} variant="blur">
                <Modal.Container className={"pointer-events-auto"}>
                  <div className="self-start w-full flex items-center justify-between ">
                    <Button
                      isIconOnly
                      variant="tertiary"
                      size="lg"
                      className={"[&>svg]:size-5 w-12 h-12 "}
                      onClick={() => {
                        closePip();
                      }}
                    >
                      <ArrowRight />
                    </Button>
                    <div className="flex items-center gap-x-4">
                      {isPlayerReady && (
                        <Button
                          isIconOnly
                          variant="tertiary"
                          size="lg"
                          className={"[&>svg]:size-5  w-12 h-12"}
                          onPress={() => {
                            setIsPip(true);
                            setIsOpen(false);
                          }}
                        >
                          <PictureInPicture2 />
                        </Button>
                      )}
                      <Button
                        isIconOnly
                        variant="tertiary"
                        size="lg"
                        className={"[&>svg]:size-5  w-12 h-12"}
                      >
                        <Download />
                      </Button>
                    </div>
                  </div>
                  <Modal.Dialog className="sm:max-w-2xl h-full  bg-[#1E1E2E] p-1.5 pb-0">
                    <Modal.Body className="">
                      <VideoPlayer
                        options={videoOptions}
                        fullHeight
                        onTimeUpdate={handleTimeUpdate}
                        setPlayerReady={setIsPlayerReady}
                        syncTime={pipTime}
                        onEnded={onEndVideo}
                      />
                    </Modal.Body>
                  </Modal.Dialog>
                </Modal.Container>
              </Modal.Backdrop>
            </Modal>
            {isPip && (
              <PipVideo
                backToFullScreen={backToFullScreen}
                syncTime={currentTime}
                options={videoOptions}
                closePip={closePip}
                displayUser={author}
                setSyncTime={setPipTime}
              />
            )}
          </>
        ) : (
          <>
            <VideoPlayer
              options={videoOptions}
              fullHeight
              // onReady={handlePlayerReady}
            />
            <div className="absolute flex items-center justify-between left-0 px-3 top-3.25 w-full">
              <Button isIconOnly size="sm" className={"bg-gray-600/80"}>
                <EllipsisVertical />
              </Button>
              <Button
                isIconOnly
                size="sm"
                className={"bg-gray-600/80"}
                onPress={onRemove}
              >
                <X />
              </Button>
            </div>
          </>
        )}
      </div>
    );
  },
);
MediaVideoItem.displayName = "MediaVideoItem";
export default MediaVideoItem;
