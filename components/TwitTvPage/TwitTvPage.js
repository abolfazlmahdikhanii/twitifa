"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import Loader from "../ui/Loader/Loader";
import MediaGrid from "../ui/MediaGrid/MediaGrid";
import TwitTvHeader from "../ui/TwitTvHeader/TwitTvHeader";

const generateInstagramRows = (items) => {
  const rows = [];
  for (let i = 0; i < items.length; i += 3) {
    const rowItems = items.slice(i, i + 3);
    const rowIndex = Math.floor(i / 3);

    if (rowIndex % 4 === 1 && rowItems.length === 3) {
      rows.push({ type: "left-large", items: rowItems, height: 450 });
    } else if (rowIndex % 4 === 3 && rowItems.length === 3) {
      rows.push({ type: "right-large", items: rowItems, height: 450 });
    } else {
      rows.push({ type: "normal", items: rowItems, height: 250 });
    }
  }
  return rows;
};

const TwitTvPage = ({ initialMedia }) => {
  const [selectedTab, setSelectedTab] = useState("video");

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const time = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(time);
  }, []);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching,  isPending: isQueryPending, } =
    useInfiniteQuery({
      queryKey: ["twit-media", selectedTab],
      queryFn: async ({ pageParam = null }) => {
        const res = await fetch(
          `/api/media?filter=${selectedTab}&cursor=${pageParam || ""}`,
        );
        if (!res.ok) throw new Error("Network error");
        return res.json();
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextCursor : undefined,
      initialPageParam: null,
      staleTime: 1000 * 30,
      ...(selectedTab === "video" && {
        initialData: {
          pages: [
            {
              posts: initialMedia?.posts ?? [],
              hasMore: initialMedia?.hasMore,
              nextCursor: initialMedia?.nextCursor,
            },
          ],
          pageParams: [null],
        },
      }),
    });

  const allPosts = useMemo(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data],
  );
  console.log(initialMedia);
  const rows = useMemo(() => generateInstagramRows(allPosts), [allPosts]);
  const showLoader = !isMounted || isQueryPending ;
  const showBackgroundRefetch =
    isFetching && !isFetchingNextPage && !showLoader;
  return (
    <div className="">
      <header className=" border-b">
        <div className="pt-6 pb-3.5 px-7 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">توییتیوی</h2>
          </div>
          <TwitTvHeader setSelectedTab={setSelectedTab} />
        </div>
      </header>

      <div className=" mt-6 px-2 h-[calc(100vh-130px)]">
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
              data={rows}
              endReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              itemContent={(index, row) => <MediaGrid row={row} />}
              components={{
                Footer: () =>
                  isFetchingNextPage ? (
                    <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : null,
                EmptyPlaceholder: () => (
                  <div className="text-center text-gray-500 py-10">
                    محتوایی یافت نشد
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

export default TwitTvPage;
