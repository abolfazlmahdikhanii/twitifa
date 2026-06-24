"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import PostCard from "../Posts/PostCard";
import Loader from "../ui/Loader/Loader";

const ExplorerClient = ({ initialPosts }) => {
  const [isMounted, setIsMounted] = useState(false);

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
    queryKey: ["explorer-for-you"],
    queryFn: async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/explorer/for-you?cursor=${pageParam ?? ""}`,
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
    <div className="flex flex-col ">
      <div className="flex-1 min-h-0 relative ">
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
              style={{ height: "100%" }}
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

export default ExplorerClient;
