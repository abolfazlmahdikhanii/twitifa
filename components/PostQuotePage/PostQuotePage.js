"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import PostCard from "../Posts/PostCard";
import Loader from "../ui/Loader/Loader";

const PostQuotePage = ({ initialPosts, postId, username }) => {
  const [isMounted, setIsMounted] = useState(false);
  const activeTab = "quotes";

  useEffect(() => {
    const time = setTimeout(() => setIsMounted(true), 0);
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
    queryKey: ["quote-page", postId, activeTab],
    queryFn: async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/posts/${postId}/quotes?cursor=${pageParam ?? ""}`,
      );
      if (!res.ok) throw new Error("Network error");
      return res.json();
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null,
    staleTime: 1000 * 30,
    initialData: {
      pages: [
        {
          posts: initialPosts?.posts ?? [],
          hasMore: initialPosts?.hasMore,
          nextCursor: initialPosts?.nextCursor,
        },
      ],
      pageParams: [null],
    },
  });

  const allPosts = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data],
  );

  const showLoader = !isMounted || isQueryPending;
  const showBackgroundRefetch =
    isFetching && !isFetchingNextPage && !showLoader;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 relative">
        {showLoader ? (
          <div className="h-full flex items-center justify-center py-10">
            <Loader />
          </div>
        ) : (
          <>
            {showBackgroundRefetch && (
              <div className="absolute top-2 left-0 right-0 z-10 flex justify-center">
                <Loader />
              </div>
            )}

            <Virtuoso
              key={activeTab}
              data={allPosts}
              endReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
              }}
              computeItemKey={(index, post) => post?._id ?? `item-${index}`}
              itemContent={(_, post) => <PostCard post={post} />}
              components={{
                Footer: () =>
                  isFetchingNextPage ? (
                    <div className="py-4 flex justify-center">
                      <Loader />
                    </div>
                  ) : null,
                EmptyPlaceholder: () => (
                  <div className="text-center text-gray-500 py-8 sm:py-10 text-sm sm:text-base">
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

export default PostQuotePage;