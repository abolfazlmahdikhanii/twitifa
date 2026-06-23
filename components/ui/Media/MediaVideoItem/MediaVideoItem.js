"use client";
import { getIKPoster, getIKVideo } from "@/utils/imagekit";
import {
  formatFileSize,
  formatVideoDuration,
  getVideoType,
} from "@/utils/post";
import { Button, Modal } from "@heroui/react";
import {
  ArrowRight,
  Download,
  EllipsisVertical,
  PictureInPicture2,
  Play,
  X,
} from "lucide-react";
import Image from "next/image";
import { memo, useCallback, useMemo, useState } from "react";
import PipVideo from "../../PipVideo/PipVideo";
import VideoPlayer from "../../VideoPlayer/VideoPlayer";
import { useRouter } from "next/navigation";

const MediaVideoItem = memo(
  ({
    video,
    index,
    totalVideo,
    onRemove,
    isPreview = false,
    posterUrl,
    blurUrl,
    author,
    time,
    size,
    isGrid = false,
    postId
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPip, setIsPip] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
    const [pipTime, setPipTime] = useState(0);

    const objectUrl = useMemo(
      () => (isPreview ? URL.createObjectURL(video.file) : getIKVideo(video)),
      [video, isPreview],
    );

    const optimizedPoster = useMemo(() => getIKPoster(posterUrl), [posterUrl]);

    const layoutClass = useMemo(
      () => (totalVideo === 3 && index === 2 ? "col-span-2 " : ""),
      [totalVideo, index],
    );

    const videoOptions = useMemo(() => {
      if (!objectUrl) return null;
      return {
        sources: [{ src: objectUrl, type: getVideoType(objectUrl) }],
        poster: optimizedPoster,
        autoplay: isPip || shouldAutoPlay,
      };
    }, [objectUrl, optimizedPoster, isPip, shouldAutoPlay]);

    const handleTimeUpdate = useCallback((time, dur) => {
      setDuration(dur);
      setCurrentTime(time);
    }, []);

    const backToFullScreen = useCallback((currTime) => {
      setIsPip(false);
      setIsOpen(true);
      setPipTime(currTime);
      setShouldAutoPlay(true);
    }, []);

    const closePip = useCallback(() => {
      setIsPip(false);
      setIsOpen(false);
    }, []);

    const onEndVideo = useCallback(() => {
      closePip();
      setCurrentTime(0);
      setDuration(0);
      setPipTime(0);
      setIsPlayerReady(false);
      setShouldAutoPlay(false);
    }, [closePip]);

    return (
      <div
        className={`relative group ${isGrid ? "h-full" : ""} ${layoutClass}`}
        key={isPreview ? `${author}-${index}` : index}
      >
        {!isPreview ? (
          <>
            <div
              className={`relative cursor-pointer ${isGrid ? "w-full h-full" : "aspect-auto"}`}
              onClick={() => setIsOpen(true)}
            >
              <Image
                src={optimizedPoster}
                alt={`ویدیو ${index + 1}`}
                {...(isGrid
                  ? {
                      fill: true,
                      className:
                        "w-full h-full object-cover bg-no-repeat rounded-3xl overflow-hidden duration-700 ease-in-out",
                    }
                  : {
                      width: 600,
                      height: 600,
                      className:
                        "w-full h-full object-cover bg-no-repeat rounded-3xl min-h-63 max-h-149 overflow-hidden duration-700 ease-in-out",
                    })}
                placeholder={blurUrl ? "blur" : "empty"}
                blurDataURL={blurUrl}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />

              <Button
                isIconOnly
                className="absolute top-1/2 left-1/2 -translate-1/2 w-17.25 h-17.25 rounded-full ring-1 ring-gray-400 [&>svg]:size-6 bg-[rgba(0,0,0,0.2)] backdrop-blur-xl"
                size="lg"
                onPress={(e) => e?.stopPropagation()}
              >
                <Play />
              </Button>

              {!isGrid ? (
                <>
                  <div className="absolute bottom-4 left-3 bg-[rgba(0,0,0,0.3)] backdrop-blur-xl text-sm py-1.25 px-2.75 rounded-lg">
                    {formatVideoDuration(time)}
                  </div>

                  <div className="absolute top-4 right-3 bg-[rgba(0,0,0,0.3)] backdrop-blur-xl text-sm py-1.25 px-2.75 rounded-lg">
                    {formatFileSize(size)}
                  </div>
                </>
              ) : null}

              <PostVideoItem
                isPip={isPip}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                closePip={closePip}
                isPlayerReady={isPlayerReady}
                setIsPip={setIsPip}
                objectUrl={objectUrl}
                videoOptions={videoOptions}
                handleTimeUpdate={handleTimeUpdate}
                setIsPlayerReady={setIsPlayerReady}
                pipTime={pipTime}
                onEndVideo={onEndVideo}
                backToFullScreen={backToFullScreen}
                currentTime={currentTime}
                author={author}
                setPipTime={setPipTime}
                isGrid={isGrid}
                postId={postId}
              />
            </div>
          </>
        ) : (
          <>
            <VideoPlayer options={videoOptions} fullHeight />
            <div className="absolute flex items-center justify-between left-0 px-3 top-3.25 w-full">
              <Button isIconOnly size="sm" className="bg-gray-600/80">
                <EllipsisVertical />
              </Button>
              <Button
                isIconOnly
                size="sm"
                className="bg-gray-600/80"
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

const PostVideoItem = ({
  isPip,
  setIsOpen,
  isOpen,
  closePip,
  isPlayerReady,
  setIsPip,
  objectUrl,
  videoOptions,
  handleTimeUpdate,
  setIsPlayerReady,
  pipTime,
  onEndVideo,
  backToFullScreen,
  currentTime,
  author,
  setPipTime,
  isGrid=false,postId
}) => {
  const {push}=useRouter()
  return (
    <>
      <Modal isOpen={isOpen && !isPip} onOpenChange={setIsOpen}>
        <Modal.Backdrop isDismissable={false} variant="blur">
          <Modal.Container className="pointer-events-auto">
            <div className="self-start w-full flex items-center justify-between">
              <Button
                isIconOnly
                variant="tertiary"
                size="lg"
                className="[&>svg]:size-5 w-12 h-12"
                onPress={closePip}
              >
                <ArrowRight />
              </Button>

              {!isGrid ? (
                <div className="flex items-center gap-x-4">
                  {isPlayerReady && (
                    <Button
                      isIconOnly
                      variant="tertiary"
                      size="lg"
                      className="[&>svg]:size-5 w-12 h-12"
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
                    className="[&>svg]:size-5 w-12 h-12"
                    onPress={() => window.open(objectUrl, "_blank")}
                  >
                    <Download />
                  </Button>
                </div>
              ) : (
                <div>
                  <Button className={"h-11 px-6"} onClick={()=>push(`/${author.username}/status/${postId}`)}>مشاهده پست</Button>
                </div>
              )}
            </div>

            <Modal.Dialog className="sm:max-w-2xl h-full bg-[#1E1E2E] p-1.5 pb-0">
              <Modal.Body>
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

      {!isGrid && isPip && (
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
  );
};
