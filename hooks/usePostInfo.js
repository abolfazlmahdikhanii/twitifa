"use client";
import { useQueries } from "@tanstack/react-query";

const usePostInfo = (pId) => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["post-actions", pId],
        queryFn: async () => {
          const res = await fetch(`/api/posts/${pId}/post-actions`);
          if (!res.ok) throw new Error("خطا در دریافت اطلاعات");
          const data = await res.json();
          return data;
        },
        enabled: !!pId,
        refetchOnMount: true,
      },
      {
        queryKey: ["post-pin", pId],
        queryFn: async () => {
          const res = await fetch(`/api/posts/pin/${pId}`);
          if (!res.ok) throw new Error("خطا در دریافت اطلاعات");
          const data = await res.json();
          return data;
        },
        enabled: !!pId,
        refetchOnMount: true,
      },
    ],
  });

  const [
    {
      data: postAction,
      refetch: refetchPostActions,
      isLoading: loadingPostActions,
      error: postActionError,
    },

    { data: pin, refetch: refetchPin, isLoading: loadingPin, error: pinError },
  ] = results;

  const isLoading = results.some(({ isLoading }) => isLoading);
  const errors = results.map(({ error }) => error).filter(Boolean);

  const { likes, reposts, replySetting, views, replyCount } = postAction || {};

  return {
    likes: likes || { likeCount: 0, isLiked: false },
    reposts: reposts || { repostCount: 0, isUserReposted: false },
    replySetting: replySetting || "all",
    views: views || { viewsCount: 0 },
    // replies,
    replyCount: replyCount || 0,
    pin,

    // Refetch functions
    refetchAll: () => {
      refetchPostActions();
    },
    refetchPostActions,

    // States
    isLoading,
    errors,
    hasError: errors.length > 0,
  };
};

export default usePostInfo;
