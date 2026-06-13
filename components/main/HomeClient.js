"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Tabs } from "@heroui/react";
import PostCard from "../Posts/PostCard";
import PostBox from "./PostBox";
import Loader from "../ui/Loader/Loader";
import { useState } from "react";
import { Virtuoso } from "react-virtuoso";

const HomeClient = ({ initialPosts }) => {
  const [activeTab, setActiveTab] = useState("following");

  const followingQuery = useInfiniteQuery({
    queryKey: ["posts", "following"],
    queryFn: async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/posts?cursor=${pageParam || ""}&tab=following`,
      );
      return await res.json();
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null,
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
    staleTime: 1000 * 60 * 2,
  });

  const forYouQuery = useInfiniteQuery({
    queryKey: ["posts", "for-you"],
    queryFn: async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/posts?cursor=${pageParam || ""}&tab=for-you`,
      );
      return await res.json();
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null,
    staleTime: 1000 * 60 * 2,
  });

  const renderFeed = (query) => {
    const posts = query.data?.pages?.flatMap((page) => page.posts) || [];

    if (query.isPending) {
      return (
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      );
    }

    return (
      <Virtuoso
        data={posts}
        style={{ height: "100%" }}
        endReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
          }
        }}
        computeItemKey={(index, post) => post._id}
        itemContent={(index, post) => <PostCard post={post} />}
        components={{
          Footer: () =>
            query.isFetchingNextPage ? (
              <div className="py-4 flex justify-center">
                <Loader />
              </div>
            ) : null,
          Header: () => <PostBox refetch={query.refetch} />,
        }}
      />
    );
  };

  return (
    <Tabs
      selectedKey={activeTab}
      className="w-full mt-2"
      orientation="horizontal"
      onSelectionChange={(key) => setActiveTab(key)}
    >
      <Tabs.ListContainer>
        <Tabs.List
          aria-label="Feed Tabs"
          className="gap-2 w-full relative rounded-none p-0 border-b border-[#34344E] bg-transparent px-12"
        >
          <Tabs.Tab
            id="following"
            className="w-full py-7 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold"
          >
            دنبال می کنید
          </Tabs.Tab>
          <Tabs.Tab
            id="for-you"
            className="w-full py-7 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold "
          >
            برای شما
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>

      <div className="relative h-[calc(100vh-90px)]">
        <div
          className={`${activeTab === "following" ? "relative visible z-2" : "absolute hidden"} z-0 w-full h-full top-0 left-0`}
        >
          {renderFeed(followingQuery)}
        </div>
        <div
          className={`${activeTab === "for-you" ? "relative visible z-2" : "absolute hidden"} z-0 w-full h-full top-0 left-0`}
        >
          {renderFeed(forYouQuery)}
        </div>
      </div>
    </Tabs>
  );
};

export default HomeClient;
