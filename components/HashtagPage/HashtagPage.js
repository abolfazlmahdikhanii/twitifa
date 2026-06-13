"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Tabs } from "@heroui/react";
import PostCard from "../Posts/PostCard";
import Loader from "../ui/Loader/Loader";
import EmptyData from "../ui/EmptyData/EmptyData";
import { useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";

const HashtagPage = ({ initialPosts, hashtagName }) => {
  const [activeTab, setActiveTab] = useState("newest");

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["hashtag", hashtagName],
      queryFn: async ({ pageParam = null }) => {
        const res = await fetch(
          `/api/hashtags/${hashtagName}?cursor=${pageParam || ""}`,
        );
        if (!res.ok) throw new Error("Network error");
        return await res.json();
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextCursor : undefined,
      initialPageParam: null,
      initialData: initialPosts
        ? {
            pages: [
              {
                posts: initialPosts.posts,
                hasMore: initialPosts.hasMore,
                nextCursor: initialPosts.nextCursor,
              },
            ],
            pageParams: [null],
          }
        : undefined,
    });

  const allPosts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.posts);
  }, [data]);

  const filteredData = useMemo(() => {
    if (!allPosts) return [];

    if (activeTab === "pictures") {
      return allPosts.filter(
        (post) =>
          !post.replyToPost &&
          Array.isArray(post.media) &&
          post.media.some((item) => item.mediaType === "image"),
      );
    }

    if (activeTab === "videos") {
      return allPosts.filter(
        (post) =>
          !post.replyToPost &&
          Array.isArray(post.media) &&
          post.media.some((item) => item.mediaType === "video"),
      );
    }

    return allPosts.filter((post) => !post.replyToPost);
  }, [allPosts, activeTab]);

  const Footer = () => {
    return isFetchingNextPage ? (
      <div className="py-4 flex justify-center">
        <Loader />
      </div>
    ) : null;
  };

  if (isPending) return <Loader />;

  return (
    <Tabs
      selectedKey={activeTab}
      onSelectionChange={(key) => setActiveTab(key)}
      className="w-full mt-2"
      orientation="horizontal"
    >
      <Tabs.ListContainer>
        <Tabs.List
          aria-label="Hashtag Tabs"
          className="gap-2 w-full relative rounded-none p-0 border-b border-[#34344E] bg-transparent px-12"
        >
          <Tabs.Tab
            id="newest"
            className="w-full py-7 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold before:hidden"
          >
            تازه ها
          </Tabs.Tab>
          <Tabs.Tab
            id="pictures"
            className="w-full py-7 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold before:hidden"
          >
            تصاویر
          </Tabs.Tab>
          <Tabs.Tab
            id="videos"
            className="w-full py-7 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold before:hidden"
          >
            ویدئوها
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>

      <div className="relative h-[calc(100vh-90px)">
        {filteredData.length === 0 && !isFetchingNextPage ? (
          <EmptyData text="پستی یافت نشد" />
        ) : (
          <Virtuoso
            data={filteredData}
            endReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            computeItemKey={(index, post) => post._id}
            itemContent={(index, post) => <PostCard post={post} />}
            components={{ Footer }}
          />
        )}
      </div>
    </Tabs>
  );
};

export default HashtagPage;
