"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { useQueries } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
const useFollow = (
  username,

  {
    fetchFollow = false,
    fetchFollowing = false,
    fetchFollower = false,
    fetchFollowCount = true,
    fetchSharedFollower = false,
  } = {},
  initialData,
) => {
  const { user } = useAuth();
  const queries = useQueries({
    queries: [
      {
        queryKey: ["follow", username],
        queryFn: () =>
          fetch(`/api/user/${username}/follow`).then((res) => res.json()),
        enabled: !!username && fetchFollow,
      },
      {
        queryKey: ["following", username],
        queryFn: () =>
          fetch(`/api/user/${username}/following`).then((res) => res.json()),
        enabled: !!username && fetchFollowing,
        initialData: initialData?.followingData,
        staleTime: 60 * 1000,
      },
      {
        queryKey: ["follower", username],
        queryFn: () =>
          fetch(`/api/user/${username}/follower`).then((res) => res.json()),
        enabled: !!username && fetchFollower,
        initialData: initialData?.followerData,
        staleTime: 60 * 1000,
      },
      {
        queryKey: ["followCount", username],
        queryFn: () =>
          fetch(`/api/user/${username}/follow-count`).then((res) => res.json()),
        enabled: !!username && fetchFollowCount,
        staleTime: 30 * 1000,
      },
      {
        queryKey: ["sharedFollower", username],
        queryFn: () =>
          fetch(`/api/user/${username}/shared-follower`).then((res) =>
            res.json(),
          ),
        enabled: !!username && fetchSharedFollower,
        staleTime: 30 * 60 * 1000, // 30min
      },
    ],
  });

  const [
    followQuery,
    followingQuery,
    followerQuery,
    followCountQuery,
    sharedFollowerQuery,
  ] = queries;
  const follow = followQuery.data;
  const refetchFollow = followQuery.refetch;
  const [followLoading, setFollowLoading] = useState(false);

  const following = followingQuery.data;
  const follower = followerQuery.data;
  const followCount = followCountQuery.data;
  const sharedFollower = sharedFollowerQuery.data;
  const refetchFollower = followerQuery.refetch;
  const refetchFollowing = followingQuery.refetch;
  const refetchFollowCount = followCountQuery.refetch;
  const refetchSharedFollower = sharedFollowerQuery.refetch;
  const followHandler = async (e) => {
    e?.preventDefault();
    try {
      if (!user) {
        toast.warning("باید لاگین کنید");
        return;
      }
      if (followLoading) return;
      setFollowLoading(true);
      const res = await fetch(`/api/user/${username}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "خطا در دنبال کردن");
      } else {
        toast.success(data.message);

        if (fetchFollow) refetchFollow();
        if (fetchFollowing) refetchFollowing();
        if (fetchFollower) refetchFollower();

        refetchFollowCount();
        refetchSharedFollower();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFollowLoading(false);
    }
  };

  return {
    follow,
    followLoading,
    following,
    follower,
    sharedFollower,
    followHandler,
    followCount,
    refetchFollowCount,
  };
};

export default useFollow;
