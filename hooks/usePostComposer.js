"use client";

import { useAuth } from "@/context/AuthContext";
import { useCallback, useRef, useState } from "react";
import usePostEditor from "./postComposer/usePostEditor";
import usePostMedia from "./postComposer/usePostMedia";
import usePostSubmission from "./postComposer/usePostSubmission";

const usePostComposer = ({
  isEdit,
  initialData,
  isQuote,
  isReply,
  author,
  onClose,
  replyingTo,
  clearReplyTo,
  repostHandler,
  replyHandler,
}) => {
  const { user } = useAuth();
  const imgRef = useRef(null);
  const videoRef = useRef(null);
  const [postId, setPostId] = useState(null);
  const [replyType, setReplyType] = useState("all");
  const [pollData, setPollData] = useState(null);
  const [hasPoll, setHasPoll] = useState(false);

  const handleInitialData = useCallback((data) => {
    setPollData(data.poll || null);
    setHasPoll(!!data.poll);
    setPostId(data._id || null);
  }, []);

  const { editor, isEmpty, getText, getContent, clearEditor } = usePostEditor({
    isEdit,
    initialData,
    isReply,
    hasPoll,
    onInitialData: handleInitialData,
  });
  const media = usePostMedia({ imgRef, videoRef });

  const resetForm = useCallback(() => {
    clearEditor();
    media.clearMedia();
    setPollData(null);
    setHasPoll(false);
    setPostId(null);
    onClose?.();
  }, [clearEditor, media, onClose]);

  const { isLoading, submitForm } = usePostSubmission({
    isEdit,
    isQuote,
    isReply,
    author,
    postId,
    replyType,
    pollData,
    hasPoll,
    mediaUrl: media.mediaUrl,
    mediaType: media.mediaType,
    getText,
    getContent,
    resetForm,
    uploadImage: media.uploadImage,
    uploadVideo: media.uploadVideo,
    repostHandler,
    replyHandler,
    replyingTo,
    clearReplyTo,
  });

  return {
    user,
    editor,
    imgRef,
    videoRef,
    setReplyType,
    replyType,
    mediaUrl: media.mediaUrl,
    mediaType: media.mediaType,
    setPollData,
    setHasPoll,
    hasPoll,
    isEmpty,
    isLoading,
    isImageLoading: media.isImageLoading,
    isVideoLoading: media.isVideoLoading,
    removeSelectedMedia: media.removeSelectedMedia,
    handleImageClick: media.handleImageClick,
    handleVideoClick: media.handleVideoClick,
    changeMediaFile: media.changeMediaFile,
    submitForm,
  };
};

export default usePostComposer;
