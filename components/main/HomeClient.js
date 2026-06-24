"use client";
import { useFeedQuery } from "@/hooks/useFeedQuery";
import { Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import PostCard from "../Posts/PostCard";
import Loader from "../ui/Loader/Loader";
import PostBox from "./PostBox";

const TABS = [
  { id: "following", label: "دنبال می کنید" },
  { id: "for-you", label: "برای شما" },
];



const Feed = ({ query, isMounted }) => {
  const posts = query.data?.pages?.flatMap((page) => page.posts) ?? [];
  const showLoader = !isMounted || query.isPending;

  if (showLoader) {
    return (
      <div className=" h-full">
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
      computeItemKey={(_, post) => post._id}
      itemContent={(_, post) => <PostCard post={post} />}
      components={{
        Footer: () =>
          query.isFetchingNextPage ? (
            <div className="py-4 flex justify-center">
              <Loader />
            </div>
          ) : null,
        Header: () => <div className="hidden md:block"><PostBox refetch={query.refetch} /></div>,
      }}
    />
  );
};

const HomeClient = ({ initialPosts }) => {
  const [activeTab, setActiveTab] = useState("following");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const time = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(time);
  }, []);

  const followingQuery = useFeedQuery("following", initialPosts);
  const forYouQuery = useFeedQuery("for-you", null);

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
          className="gap-2 w-full relative rounded-none p-0 border-b border-[#34344E] bg-transparent sm:px-12 px-4"
        >
          {TABS.map((tab) => (
            <Tabs.Tab key={tab.id} id={tab.id} className={"tab-box"}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>

      <div className="relative h-[calc(100vh-90px)]">
        <div
          className={`${
            activeTab === "following"
              ? "relative visible z-2"
              : "absolute hidden"
          } z-0 w-full h-full top-0 left-0`}
        >
          <Feed query={followingQuery} isMounted={isMounted} />
        </div>
        <div
          className={`${
            activeTab === "for-you" ? "relative visible z-2" : "absolute hidden"
          } z-0 w-full h-full top-0 left-0`}
        >
          <Feed query={forYouQuery} isMounted={isMounted} />
        </div>
      </div>
    </Tabs>
  );
};

export default HomeClient;
