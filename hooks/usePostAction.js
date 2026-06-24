"use client";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useCallback } from "react";
import { toast } from "sonner";

// API Helper
const apiCall = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      message: data.message || "خطا در درخواست",
      status: res.status,
    };
  }

  return data;
};
const usePostAction = (
  postId,
  setIsOpen = null,
  username = null,
  currentPage = "posts",
  isReply = false,
) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showChangeReply, setShowChangeReply] = useState(false);

  const postLikeHandler = useCallback(async () => {
    if (!user) {
      toast.error("برای پسندیدن پست ابتدا باید وارد شوید");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiCall(`/api/posts/likes/${postId}`, {
        method: "POST",
      });
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["post-actions", postId],
      });
    } catch (error) {
      toast.error(error.message || "خطا در پسندیدن پست");
    } finally {
      setIsLoading(false);
    }
  }, [user, postId, queryClient]);

  const postPinHandler = useCallback(async () => {
    if (!user) {
      toast.error("برای سنجاق کردن پست ابتدا باید وارد شوید");
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiCall(`/api/posts/pin/${postId}`, { method: "PUT" });
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["post-pin", postId],
      });
    } catch (error) {
      toast.error(error.message || "خطا در سنجاق کردن پست");
    } finally {
      setIsLoading(false);
    }
  }, [user, postId, queryClient]);

  const repostHandler = useCallback(
    async (quote = "") => {
      if (!user) {
        toast.error("برای بازپست کردن پست ابتدا باید وارد شوید");
        return;
      }

      setIsLoading(true);
      try {
        const data = await apiCall(`/api/repost/${postId}`, {
          method: "POST",
          body: JSON.stringify({ quoteContent: quote }),
        });
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["post-actions", postId],
        });
      } catch (error) {
        toast.error(error.message || "خطا در بازنشر پست");
      } finally {
        setIsLoading(false);
      }
    },
    [user, postId, queryClient],
  );

  const replyHandler = useCallback(
    async (reply, replyingTo = null) => {
      if (!user || !reply?.trim()) {
        toast.error("برای پاسخ ابتدا وارد شوید و محتوا بنویسید");
        return;
      }

      setIsLoading(true);
      try {
        const data = await apiCall(
          `/api/reply/${replyingTo ? replyingTo : postId}`,
          {
            method: "POST",
            body: JSON.stringify({ replyContent: reply }),
          },
        );
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["replyPost", postId],
        });
      } catch (error) {
        toast.error(error.message || "خطا در پاسخ پست");
      } finally {
        setIsLoading(false);
      }
    },
    [user, postId, queryClient],
  );

  const removePostMutation = useMutation({
    mutationFn: (id) => apiCall(`/api/posts/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("حذف توییت با موفقیت انجام شد");

      if (isReply) {
        queryClient.invalidateQueries({
          queryKey: ["replyPost"],
          exact: false,
          refetchType: "active",
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: false,
        refetchType: "all",
      });
      if (currentPage) {
        queryClient.invalidateQueries({
          queryKey: [`user-${currentPage}`, username],
        });
      }
    },
    onError: () => {
      toast.error("حذف تویییت با خطا مواجه شد");
    },
  });

  const removePost = useCallback(async () => {
    if (!postId) return;
    setIsLoading(true);
    await removePostMutation.mutateAsync(postId);
    setIsLoading(false);
  }, [postId, removePostMutation]);

  const updateReplyType = useCallback(
    async (replyType) => {
      if (!replyType) {
        toast.error("گزینه‌ای را انتخاب کنید");
        return;
      }

      setShowChangeReply(false);
      try {
        const data = await apiCall(`/api/posts/change-replies/${postId}`, {
          method: "PUT",
          body: JSON.stringify({ replyType }),
        });
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["post-actions", postId],
        });
      } catch (error) {
        toast.error(error.message || "خطا در ویرایش افراد پاسخ دهنده");
      }
    },
    [postId, queryClient],
  );

  return {
    postLikeHandler,
    postPinHandler,
    repostHandler,
    replyHandler,
    removePost,
    updateReplyType,
    showChangeReply,
    setShowChangeReply,
    isLoading,
  };
};

export default usePostAction;
