import { useAuth } from "@/context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const useActiveAuthor = (userId) => {
  const queryClient = useQueryClient();
  const [lastCheckTime, setLastCheckTime] = useState(() =>
    new Date().toISOString(),
  );
  const {
    data: activeAuthors = [],
    isLoading: isChecking,
    refetch: checkActiveAuthors,
    isFetching,
  } = useQuery({
    queryKey: ["activeAuthors", userId],
    queryFn: async () => {
      const url = lastCheckTime
        ? `/api/posts/new-author?lastCheckTime=${lastCheckTime}`
        : `/api/posts/new-author`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("خطا در دریافت");
      }

      const data = await res.json();

      setLastCheckTime(() => new Date().toISOString());

      return data.activeAuthors || [];
    },
    refetchInterval: (data) => {
      if (!data || data.length === 0) return 60 * 1000;
      return 30 * 1000;
    },
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    // staleTime: 2 * 60 * 1000,
    gcTime: 0,

    // placeholderData: [],
    // retry: 1,
    enabled: !!userId ,
  });

  const clearNotifications = () => {
    queryClient.setQueryData(["activeAuthors", userId], []);
  };

  const removeAuthorNotification = (authorId) => {
    const newData = activeAuthors.filter((a) => a.author._id !== authorId);
    queryClient.setQueryData(["activeAuthors", userId], newData);
  };

  return {
    activeAuthors,
    isChecking: isFetching || isChecking,
    clearNotifications,
    removeAuthorNotification,
    refreshNotifications: checkActiveAuthors,
    refetch: checkActiveAuthors,
  };
};

export default useActiveAuthor;
