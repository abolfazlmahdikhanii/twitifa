"use client";
import React, { useEffect, useRef } from "react";
import PostCard from "../Posts/PostCard";
import useUserContent from "@/hooks/useUserContent";
import Loader from "../ui/Loader/Loader";
import EmptyData from "../ui/EmptyData/EmptyData";

const UserPosts = ({ username, initialPosts }) => {
  const { repostsQuery } = useUserContent(username, "user-reposts", {
    "user-reposts": initialPosts,
  });

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    repostsQuery;

  const loadMoreRef = useRef(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

  if (isPending) return <Loader />;

 

  return (
    <div className="pt-0.5">
      {allPosts.length > 0 ? (
        allPosts?.map((post, index) => (
          <PostCard
            key={post._id ? String(post._id) : index}
            post={post}
            isUserPage
            currentPage="reposts"
          />
        ))
      ) : (
        <EmptyData text={"هنوز پستی منتشر نکرده‌اید"} />
      )}

      <div ref={loadMoreRef} className="h-10 flex justify-center">
        {isFetchingNextPage && <Loader />}
      </div>
    </div>
  );
};

export default UserPosts;
