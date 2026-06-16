import { useInfiniteQuery } from "@tanstack/react-query";

export const useFeedQuery = (tab, initialPosts) =>
  useInfiniteQuery({
    queryKey: ["posts", tab],
    queryFn: async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/posts?cursor=${pageParam ?? ""}&tab=${tab}`,
      );
      if (!res.ok) throw new Error("Network error");
      return res.json();
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null,
    staleTime: 1000 * 60 * 2,
    ...(initialPosts && {
      initialData: {
        pages: [
          {
            posts: initialPosts.posts,
            hasMore: initialPosts.hasMore,
            nextCursor: initialPosts.nextCursor,
          },
        ],
        pageParams: [null],
      },
    }),
  });
