"use client";
import { Tabs } from "@heroui/react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import Loader from "../ui/Loader/Loader";
import NotificationHeader from "../ui/NotificationHeader/NotificationHeader";
import NotificationItem from "../ui/NotificationItem/NotificationItem";

const Notifications = () => {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("all");
  const [activeNotificationTab, setActiveNotificationTab] = useState("newest");

  const {
    data,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["notifications", selectedTab],
    queryFn: async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/notifications?filter=${selectedTab}&cursor=${pageParam || ""}`,
      );
      if (!res.ok) throw new Error("Network error");
      return await res.json();
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null,
  });

  const readAllNotification = useCallback(async () => {
    try {
      const res = await fetch(`/api/notifications`, { method: "PUT" });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  }, [queryClient]);

  useEffect(() => {
    readAllNotification();
  }, [readAllNotification]);

  const allNotifications = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.notifications);
  }, [data]);

  const displayedData = useMemo(() => {
    if (!allNotifications) return [];
    if (activeNotificationTab === "reactions") {
      return allNotifications.filter(
        (n) => n.type === "like" || n.type === "retweet" || n.type === "quote",
      );
    }
    if (activeNotificationTab === "mentions") {
      return allNotifications.filter(
        (n) => n.type === "reply" || n.type === "mention",
      );
    }
    return allNotifications;
  }, [allNotifications, activeNotificationTab]);

  const isAllRead = useMemo(() => {
    return (
      allNotifications.length > 0 &&
      allNotifications.every((item) => item.isRead)
    );
  }, [allNotifications]);

 
  return (
    <>
      <header>
        <div className="pt-4 sm:pt-6 pb-2.5 sm:pb-3.5 px-4 sm:px-7 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold">اعلان ها</h2>
          <NotificationHeader
            setSelectedTab={setSelectedTab}
            isAllRead={isAllRead}
            readAllNotification={readAllNotification}
          />
        </div>
      </header>

      <Tabs
        selectedKey={activeNotificationTab}
        onSelectionChange={(key) => setActiveNotificationTab(key)}
        className="w-full"
        orientation="horizontal"
      >
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Notification Tabs"
            className="gap-0 sm:gap-2 w-full relative rounded-none p-0 border-b border-[#34344E] bg-transparent px-2 sm:px-12"
          >
            <Tabs.Tab id="newest" className={"tab-box"}>
              همه
            </Tabs.Tab>
            <Tabs.Tab id="reactions" className={"tab-box"}>
              واکنش ها
            </Tabs.Tab>
            <Tabs.Tab id="mentions" className={"tab-box"}>
              <span className="hidden sm:inline">خطاب ها و پاسخ ها</span>
              <span className="sm:hidden">خطاب ها</span>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <div className="relative h-[calc(100vh-130px)] sm:h-[calc(100vh-150px)]">
          {!isFetching ? (
            <Virtuoso
              data={displayedData}
              endReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
              }}
              computeItemKey={(index, notification) => notification._id}
              itemContent={(index, notification) => (
                <NotificationItem notification={notification} />
              )}
              components={{
                Footer: () =>
                  isFetchingNextPage ? (
                    <div className="py-4 flex justify-center">
                      <Loader />
                    </div>
                  ) : null,
                EmptyPlaceholder: () => (
                  <div className="text-center text-gray-500 py-10 text-sm sm:text-base">
                    اعلانی یافت نشد
                  </div>
                ),
              }}
            />
          ) : (
            <Loader />
          )}
        </div>
      </Tabs>
    </>
  );
};

export default Notifications;