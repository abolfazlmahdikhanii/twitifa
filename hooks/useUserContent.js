import { useInfiniteQuery } from "@tanstack/react-query";

const useUserContent = (username, currentPage = "", initialData = {}) => {
  const createQueryConfig = (endpoint, key) => {
    const initial = initialData[key];
    return {
      queryKey: [key, username],
      queryFn: async ({ pageParam = null }) => {
        const res = await fetch(
          `/api/user/${username}/${endpoint}?cursor=${pageParam || ""}`,
        );
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
        return await res.json();
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextCursor : undefined,
      initialPageParam: null,
      initialData: initial
        ? {
            pages: [
              {
                posts: initial.posts,
                hasMore: initial.hasMore,
                nextCursor: initial.nextCursor,
              },
            ],
            pageParams: [null],
          }
        : undefined,

      enabled: !!username && currentPage === key,
      staleTime: 5 * 60 * 1000,
    };
  };

  const postsQuery = useInfiniteQuery(createQueryConfig("posts", "user-posts"));
  const repliesQuery = useInfiniteQuery(
    createQueryConfig("replies", "user-replies"),
  );
  const repostsQuery = useInfiniteQuery(
    createQueryConfig("reposts", "user-reposts"),
  );
  const reactionsQuery = useInfiniteQuery(
    createQueryConfig("reactions", "user-reactions"),
  );

  return {
    postsQuery,
    repliesQuery,
    repostsQuery,
    reactionsQuery,
  };
};

export default useUserContent;
