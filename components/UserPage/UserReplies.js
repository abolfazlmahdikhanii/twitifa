"use client";
import React, { useEffect, useRef } from "react";
import PostCard from "../Posts/PostCard";
import useUserContent from "@/hooks/useUserContent";
import Loader from "../ui/Loader/Loader";
import EmptyData from "../ui/EmptyData/EmptyData";

const UserReplies = ({ username, initialReplies }) => {
  const { repliesQuery } = useUserContent(username, "user-replies", { "user-replies": initialReplies });
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = repliesQuery;

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
      { threshold: 0.1 } 
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderReplies = (reply, i, level = 1, isLastInLevel = false) => {
    return (
      <div key={reply._id} className={`relative pt-0.5`}>
        {reply.isDeleted ? (
          <div className="px-5 py-4 bg-gray-50 dark:bg-[#141428] border border-[#34344E]  rounded-[18px] text-neutral-300  mr-8 ml-9 mb-8 relative before:w-0.5 before:h-5 before:bg-[#34344E]  before:absolute before:top-17.25 z-3  before:right-7 before:bottom-0">
            {" "}
            این توییت حذف شده است.
          </div>
        ) : (
          <PostCard
            post={reply}
            isFirstReply={reply.isParent}
            isReply={true}
            repliedUser={reply.repliedUser}
            lastReply={isLastInLevel}
            isShowReplyHeader={
              reply.isParent &&
              reply.directReplies?.some(
                (item) =>
                  reply.author?.username === item.replyToPost?.author?.username,
              )
            }
            replyHeader={reply.replyHeader}
            isUserPage
            currentPage="replies"
          />
        )}
        {reply.directReplies?.length > 0 &&
          reply.directReplies.map((item, idx) =>
            renderReplies(
              item,
              idx,
              level + 1,
              idx === reply.directReplies.length - 1,
            ),
          )}
      </div>
    );
  };

  if (isPending) return <Loader />;


  const allPages = data?.pages?.flatMap((page) => page.posts) || [];

  if (allPages.length === 0 && !isFetchingNextPage) {
    return <EmptyData text={"هیچ توییتی وجود ندارد"} />;
  }

  return (
    <div className="pt-0.5">
      {allPages.map((post, i) => renderReplies(post, i, 1))}

    
      <div ref={loadMoreRef} className="h-10 flex justify-center">
        {isFetchingNextPage && <Loader />}
      </div>
    </div>
  );
};

export default UserReplies;