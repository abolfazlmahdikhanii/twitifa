"use client";
import { Button, Tabs } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Virtuoso } from "react-virtuoso";
import PostCard from "../Posts/PostCard";
import FollowCard from "../ui/FollowCard/FollowCard";
import Loader from "../ui/Loader/Loader";
import SearchBox from "../ui/SearchBox/SearchBox";
import Icon from "../ui/Icon/Icon";

const SearchResultPage = ({ initialResult, searchQuery }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const activeSearchTab = searchParams.get("type") || "top";

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["search", searchQuery, activeSearchTab],
      queryFn: async ({ pageParam = null }) => {
        const res = await fetch(
          `/api/search/all?q=${encodeURIComponent(searchQuery)}&type=${activeSearchTab}&cursor=${pageParam || ""}`,
        );
        if (!res.ok) throw new Error("Network error");
        return await res.json();
      },
      getNextPageParam: (lastPage) =>
        lastPage?.hasMore ? lastPage.nextCursor : undefined,
      initialPageParam: null,
      initialData:
        activeSearchTab === "top"
          ? {
              pages: [
                {
                  result: initialResult?.result || [],
                  matchedUsers: initialResult?.matchedUsers || [],
                  hasMore: initialResult?.hasMore || false,
                  nextCursor: initialResult?.nextCursor || null,
                },
              ],
              pageParams: [null],
            }
          : undefined,
    });

  const allResult = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) =>
      Array.isArray(page.result) ? page.result : [],
    );
  }, [data]);

  const allUser = useMemo(() => {
    if (!data?.pages) return [];
    const map = new Map();
    data.pages.forEach((page) => {
      (page.matchedUsers || []).forEach((u) => {
        if (u?._id && !map.has(u._id.toString())) {
          map.set(u._id.toString(), u);
        }
      });
    });
    return [...map.values()];
  }, [data]);

  const displayedData = useMemo(() => {
    if (activeSearchTab === "users") {
      return allUser;
    }

    if (activeSearchTab === "top") {
      return [...allResult].sort(
        (a, b) => (b.likesCount || 0) - (a.likesCount || 0),
      );
    }

    return allResult;
  }, [allResult, activeSearchTab, allUser]);

  const handleTabChange = (key) => {
    const url =
      key === "top"
        ? `/search?q=${searchQuery}`
        : `/search?q=${searchQuery}&type=${key}`;
    router.replace(url, { scroll: false });
  };

  return (
    <>
      <header className="flex items-center gap-x-4  mb-3.25 mt-3.5 pr-6 pl-3">
        <SearchBox isSearchPage query={searchQuery}/>
        <Button
          variant="ghost"
          className="text-base h-10 w-10"
          onClick={() => router.back()}
        >
          <Icon name="arrow-left" className="size-4" />
        </Button>
      </header>

      <Tabs
        selectedKey={activeSearchTab}
        onSelectionChange={handleTabChange}
        className="w-full"
        orientation="horizontal"
      >
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Search Tabs"
            className="gap-2 w-full relative rounded-none p-0 border-b border-[#34344E] bg-transparent px-12"
          >
            <Tabs.Tab
              id="top"
              className="w-full py-7 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold before:hidden"
            >
              بهترین‌ها
            </Tabs.Tab>
            <Tabs.Tab
              id="latest"
              className="w-full py-7 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold before:hidden"
            >
              تازه‌ترین‌ها
            </Tabs.Tab>
            <Tabs.Tab
              id="users"
              className="w-full py-7 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold before:hidden"
            >
              کاربران
            </Tabs.Tab>
            <Tabs.Tab
              id="media"
              className="w-full py-7 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold before:hidden"
            >
              رسانه
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <div className="relative h-[calc(100vh-150px)]">
          {isPending && !isFetchingNextPage ? (
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          ) : (
            <Virtuoso
              data={displayedData}
              endReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              computeItemKey={(index, item) =>
                item && item._id ? item._id : `item-${index}`
              }
              itemContent={(index, item) => {
                if (!item) return null;
                if (activeSearchTab === "users") {
                  return (
                    <div className="px-6 py-3">
                      <FollowCard {...item} />
                    </div>
                  );
                }
                return <PostCard post={item} />;
              }}
              components={{
                Footer: () =>
                  isFetchingNextPage ? (
                    <div className="py-4 flex justify-center">
                      <Loader />
                    </div>
                  ) : null,

                EmptyPlaceholder: () => (
                  <div className="text-center text-gray-500 py-10">
                    نتیجه‌ای یافت نشد
                  </div>
                ),
              }}
            />
          )}
        </div>
      </Tabs>
    </>
  );
};

export default SearchResultPage;
