"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import PostCard from "../Posts/PostCard";
import Loader from "../ui/Loader/Loader";

const PostInfoPage = ({ postId, initialPosts }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const time = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(time);
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["post-detail", postId],
      queryFn: async ({ pageParam = null }) => {
        const res = await fetch(
          `/api/posts/${postId}?cursor=${pageParam ?? ""}`,
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
            postInfo: initialPosts.postInfo,
            posts: initialPosts.posts ?? [],
            hasMore: initialPosts.hasMore,
            nextCursor: initialPosts.nextCursor,
          },
        ],
        pageParams: [null],
      },
    });

  const mainPost = useMemo(() => data?.pages?.[0]?.postInfo, [data]);
  const replies = useMemo(
    () => data?.pages?.flatMap((page) => page.posts ?? []) ?? [],
    [data],
  );

  if (!isMounted) {
    return (
      <div className="h-[calc(100vh-90px)]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-90px)] overflow-auto">
      {mainPost && (
        <PostCard post={{ ...mainPost, isPostDetail: true }} isPostDetail />
      )}

      <Virtuoso
        useWindowScroll
        data={replies}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        computeItemKey={(index, item) =>
          item?._id ? String(item._id) : `item-${index}`
        }
        itemContent={(_, item) => <PostCard post={item} />}
        components={{
          Footer: () =>
            isFetchingNextPage ? (
              <div className="py-4 flex justify-center">
                <Loader />
              </div>
            ) : null,
          EmptyPlaceholder: () =>
            replies.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                هیچ ریپلایی یافت نشد
              </div>
            ) : null,
        }}
      />
    </div>
  );
};

export default PostInfoPage;
