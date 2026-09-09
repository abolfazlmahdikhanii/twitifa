"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const invalidatePosts = (queryClient, author) => {
  queryClient.invalidateQueries({ queryKey: ["posts"] });
  if (author?.username) {
    queryClient.invalidateQueries({
      queryKey: ["user-posts", author.username],
    });
  }
};

const usePostSubmission = ({
  isEdit,
  isQuote,
  isReply,
  author,
  postId,
  replyType,
  pollData,
  hasPoll,
  mediaUrl,
  mediaType,
  getText,
  getContent,
  resetForm,
  uploadImage,
  uploadVideo,
  repostHandler,
  replyHandler,
  replyingTo,
  clearReplyTo,
}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const removePost = useCallback(async (id) => {
    if (!id) return;
    try {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
    } catch (error) {
      toast.error(error.message || "خطا در حذف پست");
    }
  }, []);

  const createPoll = useCallback(
    async (id) => {
      if (!id) return;
      try {
        const response = await fetch("/api/posts/poll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...pollData, postId: id }),
        });
        const data = await response.json();
        if (response.status !== 200) {
          await removePost(id);
          throw new Error(data.message || "خطا در ایجاد نظرسنجی");
        }
      } catch (error) {
        toast.error(error.message || "خطا در ایجاد نظرسنجی");
      }
    },
    [pollData, removePost],
  );

  const validatePoll = useCallback(() => {
    if (!hasPoll) return null;
    if (!pollData?.options || pollData.options.length < 2) {
      return "حداقل 2 گزینه برای نظرسنجی وارد کنید";
    }
    return pollData.duration ? null : "مدت زمان نظرسنجی را انتخاب کنید";
  }, [hasPoll, pollData]);

  const createPost = useCallback(async () => {
    const text = getText();
    if (!text.trim()) {
      toast.error("برای ایجاد پست متنی وارد کنید");
      return;
    }

    const pollError = validatePoll();
    if (pollError) {
      toast.error(pollError);
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("در حال ایجاد پست...");
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textContent: getContent(), replyType }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.message || "خطا در ایجاد پست");
      }

      const id = data.postId || data.post?._id || data.post?.id;
      if (!id) {
        throw new Error("شناسه پست پس از ایجاد دریافت نشد");
      }

      if (hasPoll) await createPoll(id);
      if (id && mediaUrl.length) {
        if (mediaType === "image") await uploadImage(id);
        if (mediaType === "video") await uploadVideo(id);
      }

      toast.success("پست با موفقیت ایجاد شد", { id: loadingToast });
      invalidatePosts(queryClient, author);
      resetForm();
    } catch (error) {
      toast.error(error.message || "خطا در ایجاد پست", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  }, [
    author,
    createPoll,
    getContent,
    getText,
    hasPoll,
    mediaType,
    mediaUrl.length,
    queryClient,
    replyType,
    resetForm,
    uploadImage,
    uploadVideo,
    validatePoll,
  ]);

  const updatePost = useCallback(async () => {
    const text = getText();
    if (pollData || hasPoll) {
      toast.error(
        "نظرسنجی را نمی‌توان ویرایش کرد. برای تغییر نظرسنجی، پست را حذف و مجددا ایجاد کنید",
      );
      return;
    }
    if (mediaUrl.length) {
      toast.error(
        "پست‌های دارای رسانه را نمی‌توان ویرایش کرد. برای تغییر رسانه، پست را حذف و مجددا ایجاد کنید",
      );
      return;
    }
    if (!text.trim()) {
      toast.error("برای ویرایش پست متنی وارد کنید");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textContent: getContent() }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.message || "خطا در ویرایش پست");
      }
      toast.success("پست با موفقیت ویرایش شد");
      invalidatePosts(queryClient, author);
      resetForm();
    } catch (error) {
      toast.error(error.message || "خطا در ویرایش پست");
    } finally {
      setIsLoading(false);
    }
  }, [
    author,
    getContent,
    getText,
    hasPoll,
    mediaUrl.length,
    pollData,
    postId,
    queryClient,
    resetForm,
  ]);

  const submitForm = useCallback(async () => {
    const content = getContent();
    if (isEdit) return updatePost();
    if (isReply) {
      await replyHandler(content, replyingTo);
      clearReplyTo?.();
      resetForm();
      return;
    }
    if (isQuote && repostHandler) {
      await repostHandler(content);
      resetForm();
      return;
    }
    await createPost();
  }, [
    clearReplyTo,
    createPost,
    getContent,
    isEdit,
    isQuote,
    isReply,
    repostHandler,
    replyHandler,
    replyingTo,
    resetForm,
    updatePost,
  ]);

  return { isLoading, submitForm };
};

export default usePostSubmission;
