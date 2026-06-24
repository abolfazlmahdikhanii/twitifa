"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import PostCard from "../Posts/PostCard";
import Loader from "../ui/Loader/Loader";
import FollowCard from "../ui/FollowCard/FollowCard";

const RepostClientPage = ({ initialUsers, postId }) => {
  const [isMounted, setIsMounted] = useState(false);

  const activeTab = "reposts";
  useEffect(() => {
    const time = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(time);
  }, []);

  const {
    data,
    isPending: isQueryPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["reposts-page", postId, activeTab],
    queryFn: async ({ pageParam = null }) => {
      const url = `/api/posts/${postId}/reposts?cursor=${pageParam ?? ""}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Network error");
      }
      const json = await res.json();

      return json;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null,
    staleTime: 1000 * 60*2,
    initialData: {
      pages: [
        {
          users: initialUsers?.users ?? [],
          hasMore: initialUsers?.hasMore,
          nextCursor: initialUsers?.nextCursor,
        },
      ],
      pageParams: [null],
    },
  });

  const allPosts = useMemo(
    () => data?.pages.flatMap((page) => page.users) ?? [],
    [data],
  );

  const showLoader = !isMounted || isQueryPending;
  const showBackgroundRefetch =
    isFetching && !isFetchingNextPage && !showLoader;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 relative mt-3.5 px-7.5">
        {showLoader ? (
          <div className="h-full ">
            <Loader />
          </div>
        ) : (
          <>
            {showBackgroundRefetch && (
              <div className="absolute top-2 left-0 right-0  z-10">
                <Loader />
              </div>
            )}

            <Virtuoso
              key={activeTab}
              data={allPosts}
              endReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
              }}
              computeItemKey={(index, user) => user?._id ?? `item-${index}`}
              itemContent={(_, user) => <FollowCard {...user} />}
              components={{
                Footer: () =>
                  isFetchingNextPage ? (
                    <div className="py-4 flex justify-center">
                      <Loader />
                    </div>
                  ) : null,
                EmptyPlaceholder: () => (
                  <div className="text-center text-gray-500 py-10">
                    پستی یافت نشد
                  </div>
                ),
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default RepostClientPage;
