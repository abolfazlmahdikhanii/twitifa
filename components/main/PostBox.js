"use client";
import ReplyTypeModal from "./ReplyTypeModal";

import { useAuth } from "@/context/AuthContext";
import usePostAction from "@/hooks/usePostAction";
import usePostComposer from "@/hooks/usePostComposer";
import PostComposerActions from "./PostBox/PostComposerActions";
import PostEditorArea from "./PostBox/PostEditorArea";
import PostHeader from "./PostBox/PostHeader";
import SubmitButton from "./PostBox/SubmitButton";

const PostBox = ({
  isModal = false,
  isEdit = false,
  initialData,
  onClose,
  isQuote = false,
  isReply = false,
  pId,
  author = null,
  children,
  replyingTo = null,
  clearReplyTo,
}) => {
  const { repostHandler, replyHandler } = usePostAction(
    pId,
    null,
    author?.username,
    author ? "posts" : null,
    isReply,
  );
  const { user } = useAuth();
  const composer = usePostComposer({
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
  });

  const {
    editor,
    imgRef,
    videoRef,
    setReplyType,
    replyType,
    mediaUrl,
    mediaType,
    setPollData,
    setHasPoll,
    hasPoll,
    isEmpty,
    isLoading,
    isImageLoading,
    isVideoLoading,
    removeSelectedMedia,
    handleImageClick,
    handleVideoClick,
    changeMediaFile,
    submitForm,
  } = composer;

  return (
    <div
      className={`${
        !isModal
          ? "border-b border-neutral-200 dark:border-[#374151] px-1 sm:px-9 py-4 sm:py-5.5"
          : "px-1 sm:px-3"
      } ${isReply ? "px-1 sm:px-11" : ""}`}
    >
      <div className="flex items-center gap-x-2.5">
        <PostHeader user={user} />

        <div
          className={`${!isModal ? "border-b border-neutral-200 dark:border-[#374151]" : ""} pb-1.5 sm:pb-4 flex-1 min-w-0`}
        >
          <PostEditorArea
            editor={editor}
            hasPoll={hasPoll}
            mediaUrl={mediaUrl}
            setPollData={setPollData}
            setHasPoll={setHasPoll}
            removeSelectedMedia={removeSelectedMedia}
            isEdit={isEdit}
            isReply={isReply}
          />

          {!isEdit && !isReply && (
            <ReplyTypeModal type={replyType} setType={setReplyType} />
          )}
        </div>
      </div>

      {isQuote && children}

      <div
        className={`${
          !isModal
            ? "pr-3 sm:pr-9"
            : "pr-1 sm:pr-2 border-t border-neutral-200 dark:border-[#374151] pt-3 sm:pt-4"
        } flex items-center justify-between mt-2 sm:mt-3`}
      >
        <PostComposerActions
          imgRef={imgRef}
          videoRef={videoRef}
          changeMediaFile={changeMediaFile}
          handleImageClick={handleImageClick}
          handleVideoClick={handleVideoClick}
          hasPoll={hasPoll}
          mediaType={mediaType}
          mediaUrl={mediaUrl}
          setHasPoll={setHasPoll}
          isImageLoading={isImageLoading}
          isVideoLoading={isVideoLoading}
        />

        <div
          className={`${isReply ? "flex items-center justify-end w-full" : ""}`}
        >
          <SubmitButton
            isReply={isReply}
            isEdit={isEdit}
            isLoading={isLoading}
            isEmpty={isEmpty}
            submitForm={submitForm}
          />
        </div>
      </div>
    </div>
  );
};

export default PostBox;
