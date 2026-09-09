"use client";

import {
  checkMediaType,
  generatePosterFromVideo,
  getVideoDuration,
} from "@/utils/post";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const usePostMedia = ({ imgRef, videoRef }) => {
  const [mediaUrl, setMediaUrl] = useState([]);
  const [mediaType, setMediaType] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const changeMediaFile = useCallback(async (event, isVideo = false) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
      const fileType = checkMediaType(file.type);

      if (file.size > maxSize) {
        toast.error(
          `اندازه فایل باید کمتر از ${isVideo ? "10" : "5"} مگابایت باشد`,
        );
        return;
      }

      let duration = 0;
      if (isVideo) {
        try {
          duration = await getVideoDuration(file);
        } catch (error) {
          console.error("Error getting duration:", error);
        }
      }

      setMediaUrl((current) => [
        ...current,
        {
          file,
          id: crypto.randomUUID(),
          mediaType: fileType,
          duration: isVideo ? duration : undefined,
        },
      ]);
      setMediaType(fileType);
    }

    if (event.currentTarget) event.currentTarget.value = "";
  }, []);

  const uploadImage = useCallback(
    async (postID) => {
      try {
        if (!mediaUrl.length || mediaType !== "image") return false;

        const formData = new FormData();
        formData.append("postID", postID);
        mediaUrl.forEach(({ file }) => formData.append("image", file));

        const response = await fetch("/api/posts/upload/image", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "خطا در اپلود پست");

        setMediaUrl([]);
        setMediaType("");
        return true;
      } catch (error) {
        toast.error(error.message || "خطا در اپلود پست");
        return false;
      }
    },
    [mediaType, mediaUrl],
  );

  const uploadVideo = useCallback(
    async (postID) => {
      try {
        if (!mediaUrl.length || mediaType !== "video") return false;

        const formData = new FormData();
        formData.append("postID", postID);
        for (const media of mediaUrl) {
          formData.append("video", media.file);
          formData.append("duration", String(media.duration ?? 0));
          const poster = await generatePosterFromVideo(media.file);
          formData.append("poster", poster.blob, `poster-${Date.now()}.webp`);
        }

        const response = await fetch("/api/posts/upload/video", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "خطا در اپلود پست");

        setMediaUrl([]);
        setMediaType("");
        return true;
      } catch {
        return false;
      }
    },
    [mediaType, mediaUrl],
  );

  const removeSelectedMedia = useCallback((id) => {
    setMediaUrl((current) => {
      const next = current.filter((item) => item.id !== id);
      if (!next.length) setMediaType("");
      return next;
    });
  }, []);

  const openFilePicker = useCallback((ref, setLoading) => {
    setLoading(true);
    ref.current?.click();
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return {
    mediaUrl,
    mediaType,
    isImageLoading,
    isVideoLoading,
    changeMediaFile,
    uploadImage,
    uploadVideo,
    removeSelectedMedia,
    handleImageClick: useCallback(
      () => openFilePicker(imgRef, setIsImageLoading),
      [imgRef, openFilePicker],
    ),
    handleVideoClick: useCallback(
      () => openFilePicker(videoRef, setIsVideoLoading),
      [openFilePicker, videoRef],
    ),
    clearMedia: useCallback(() => {
      setMediaUrl([]);
      setMediaType(null);
    }, []),
  };
};

export default usePostMedia;
