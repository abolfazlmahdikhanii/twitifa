"use client";
import { Tabs } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Virtuoso } from "react-virtuoso";
import PostCard from "../Posts/PostCard";
import Loader from "../ui/Loader/Loader";

const TABS = [
  { id: "newest", label: "تازه ها" },
  { id: "pictures", label: "تصاویر" },
  { id: "videos", label: "ویدئوها" },
];


const filterPosts = (posts, tab) => {
  const nonReplies = posts.filter((p) => !p.replyToPost);
  if (tab === "pictures")
    return nonReplies.filter((p) =>
      p.media?.some((m) => m.mediaType === "image"),
    );
  if (tab === "videos")
    return nonReplies.filter((p) =>
      p.media?.some((m) => m.mediaType === "video"),
    );
  return nonReplies;
};

const HashtagPage = ({ initialPosts, hashtagName }) => {
  const [activeTab, setActiveTab] = useState("newest");
  const [isTabPending, startTabTransition] = useTransition();
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
    queryKey: ["hashtag", hashtagName],
    queryFn: async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/hashtags/${hashtagName}?cursor=${pageParam ?? ""}`,
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

  const filteredData = useMemo(
    () => filterPosts(allPosts, activeTab),
    [allPosts, activeTab],
  );

  const handleTabChange = (key) => {
    startTabTransition(() => setActiveTab(key));
  };

  const showLoader = !isMounted || isQueryPending || isTabPending;
  const showBackgroundRefetch =
    isFetching && !isFetchingNextPage && !showLoader;

  return (
    <div className="flex flex-col h-full">
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={handleTabChange}
        className="w-full mt-1 sm:mt-2 shrink-0"
        orientation="horizontal"
      >
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Hashtag Tabs"
            className="gap-2 w-full relative rounded-none p-0 border-b border-[#34344E] bg-transparent sm:px-12 px-4"
          >
            {TABS.map((tab) => (
              <Tabs.Tab key={tab.id} id={tab.id} className={"tab-box"}>
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      <div className="flex-1 min-h-0 relative">
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
              data={filteredData}
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

export default HashtagPage;
