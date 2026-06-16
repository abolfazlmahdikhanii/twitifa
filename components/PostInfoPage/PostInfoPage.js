"use client";
import { Button, Dropdown, Label } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import PostBox from "../main/PostBox";
import PostCard from "../Posts/PostCard";
import Loader from "../ui/Loader/Loader";
import RepliedUsers from "../ui/RepliedUsers/RepliedUsers";

const PostInfoPage = ({ postId, mainPost, initialPosts }) => {
  const [sort, setSort] = useState("new");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["post-detail", postId, sort],
    queryFn: async ({ pageParam = null }) => {
      const res = await fetch(
        `/api/posts/${postId}?sort=${sort}&cursor=${pageParam ?? ""}`,
      );
      if (!res.ok) throw new Error("Network error");
      return res.json();
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: null,
    staleTime: 1000 * 30,
    initialData:
      sort === "new"
        ? {
            pages: [
              {
                posts: initialPosts?.posts ?? [],
                hasMore: initialPosts?.hasMore,
                nextCursor: initialPosts?.nextCursor,
              },
            ],
            pageParams: [null],
          }
        : undefined,
  });

  const replies = useMemo(
    () => data?.pages?.flatMap((page) => page.posts ?? []) ?? [],
    [data],
  );

  const sortToPersian = (key) => {
   
     if (key === "old") return "قدیمی ترین";
    else return "جدید ترین";
  };

  return (
    <div className="h-[calc(100vh-90px)]">
      <Virtuoso
        data={replies}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        computeItemKey={(index, item) =>
          item?._id ? String(item._id) : `item-${index}`
        }
        itemContent={(_, item) => {
          if (isLoading) return <Loader />;
          return <PostCard post={item} />;
        }}
        components={{
          Header: () => (
            <div>
              {mainPost && (
                <>
                  <PostCard
                    post={{ ...mainPost, isPostDetail: true }}
                    isPostDetail
                  />
                  <div>
                    <div className="flex item-center justify-between w-full pr-10 pl-5 py-3.75 border-b border-b-[#34344e]">
                      <Link
                        className="flex items-center gap-x-0.5 text-[15px] transition-all border-b border-b-transparent duration-200 hover:border-b-muted text-muted"
                        href={`/${mainPost.author.username}/status/${postId}/quotes`}
                      >
                        <ChevronRight size={16} />
                        نقل قول ها
                      </Link>
                      <div>
                        <Dropdown>
                          <Button aria-label="Menu" variant="outline">
                            {sortToPersian(sort)}
                            <ChevronDown size={16} />
                          </Button>
                          <Dropdown.Popover
                            className={"min-w-42.5 shadow-none bg-[#1A1A31]"}
                          >
                            <Dropdown.Menu onAction={(key) => setSort(key)}>
                               <Dropdown.Item id="new" textValue="new">
                                <Label>جدید ترین</Label>
                              </Dropdown.Item>
                              <Dropdown.Item id="old" textValue="old">
                                <Label>قدیمی ترین</Label>
                              </Dropdown.Item>
                             
                            
                            </Dropdown.Menu>
                          </Dropdown.Popover>
                        </Dropdown>
                      </div>
                    </div>
                    <div className="pr-23 pt-4 pb-2">
                      <RepliedUsers
                        repliedUser={{ users: [mainPost.author] }}
                      />
                    </div>
                    <PostBox isReply={true} pId={postId} />
                  </div>
                </>
              )}
            </div>
          ),

          Footer: () =>
            isFetchingNextPage ? (
              <div className="py-4 flex justify-center">
                <Loader />
              </div>
            ) : null,
          EmptyPlaceholder: () => {
            if (isFetching && !isFetchingNextPage) {
              return (
                <div className="py-10 flex justify-center">
                  <Loader />
                </div>
              );
            }
            return (
              <div className="text-center text-gray-500 py-10">
                هیچ ریپلایی یافت نشد
              </div>
            );
          },
        }}
      />
    </div>
  );
};

export default PostInfoPage;
